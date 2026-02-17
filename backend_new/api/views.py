from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets  # <--- इथे 'viewsets' ॲड करा
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAdminUser

from django.core.mail import send_mail
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str

from .models import (
    CustomUser,
    DepressionScan,
    ClientInformation,
    Appointment,
    Counsellor,
    Client,
    Note
)

from .serializers import (
    UserSerializer,
    NoteSerializer,
    DepressionScanSerializer,
    ClientInformationSerializer,
    AppointmentSerializer,
    CounsellorSerializer,
    ClientSerializer,
    NoteSerializer
)

# -------------------------------
# User Signup
# -------------------------------
class SignupView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "User created successfully",
                "user": UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------------------
# User Login
# -------------------------------
class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"error": "Username and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)
        if user:
            first_time = not bool(user.preferred_language)
            return Response({
                "message": "Login successful",
                "user": UserSerializer(user).data,
                "first_time": first_time
            })

        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )


# -------------------------------
# Save Preferred Language
# -------------------------------
class SaveLanguageView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")
        language = request.data.get("language")

        if not user_id or not language:
            return Response(
                {"error": "user_id and language are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = CustomUser.objects.get(id=user_id)
            user.preferred_language = language
            user.save()
            return Response({"message": "Language saved successfully"})
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)


# -------------------------------
# Notes API
# -------------------------------

# -------------------------------
# Depression Scan API
# -------------------------------
class DepressionScanView(APIView):
    def post(self, request):
        serializer = DepressionScanSerializer(data=request.data)
        if serializer.is_valid():
            scan = serializer.save()
            user = scan.user

            client_info, _ = ClientInformation.objects.get_or_create(user=user)

            percentage = round((scan.total_score / 12) * 100)

            if client_info.marks is None:
                client_info.marks = {}

            marks = dict(client_info.marks)
            marks["Depression"] = percentage
            client_info.marks = marks
            client_info.save()

            return Response({
                "message": "Saved successfully",
                "total_score": scan.total_score,
                "percentage": percentage
            }, status=201)

        return Response(serializer.errors, status=400)


# -------------------------------
# Client Information API
# -------------------------------
class ClientInformationView(APIView):
    def post(self, request):
        serializer = ClientInformationSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.save()
            return Response({
                "message": "Client information saved",
                "data": ClientInformationSerializer(data).data
            }, status=201)

        return Response(serializer.errors, status=400)

    def get(self, request):
        user_id = request.query_params.get("user_id")
        if not user_id:
            return Response({"error": "user_id required"}, status=400)

        try:
            user = CustomUser.objects.get(id=user_id)
            info = ClientInformation.objects.filter(user=user).first()
            if not info:
                return Response({"message": "No data found"}, status=404)

            return Response(ClientInformationSerializer(info).data)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)


# -------------------------------
# Admin Register
# -------------------------------
class AdminRegisterView(APIView):
    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        if not username or not email or not password:
            return Response({"error": "All fields required"}, status=400)

        if CustomUser.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=400)

        user = CustomUser.objects.create_user(
            username=username,
            email=email,
            password=password,
            is_staff=True
        )

        return Response({
            "message": "Admin registered",
            "admin": UserSerializer(user).data
        }, status=201)


# -------------------------------
# Admin Login
# -------------------------------
class AdminLoginView(APIView):
    def post(self, request):
        user = authenticate(
            username=request.data.get("username"),
            password=request.data.get("password")
        )

        if user and user.is_staff:
            return Response({
                "message": "Admin login successful",
                "admin": UserSerializer(user).data
            })

        return Response({"error": "Invalid admin credentials"}, status=401)


# -------------------------------
# User Profile
# -------------------------------
class ProfileView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, user_id):
        try:
            user = CustomUser.objects.get(id=user_id)
            return Response(UserSerializer(user, context={"request": request}).data)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

    def patch(self, request, user_id):
        try:
            user = CustomUser.objects.get(id=user_id)
            serializer = UserSerializer(
                user, data=request.data, partial=True,
                context={"request": request}
            )
            if serializer.is_valid():
                serializer.save()
                return Response({
                    "message": "Profile updated",
                    **serializer.data
                })

            return Response(serializer.errors, status=400)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)


# -------------------------------
# Change Password
# -------------------------------
class ChangePasswordView(APIView):
    def post(self, request, user_id):
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        try:
            user = CustomUser.objects.get(id=user_id)
            if not user.check_password(old_password):
                return Response({"error": "Wrong current password"}, status=400)

            user.set_password(new_password)
            user.save()
            return Response({"message": "Password changed successfully"})
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)


# -------------------------------
# Forgot Password
# -------------------------------
class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get("email")
        try:
            user = CustomUser.objects.get(email=email)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            reset_link = f"http://localhost:3000/reset-password/{uid}/{token}"

            send_mail(
                "MindSpace - Password Reset",
                f"Reset link:\n{reset_link}",
                "support@mindspace.com",
                [email]
            )

            return Response({"message": "Reset link sent"})
        except CustomUser.DoesNotExist:
            return Response({"error": "Email not registered"}, status=404)


# -------------------------------
# Reset Password Confirm
# -------------------------------
class ResetPasswordConfirmView(APIView):
    def post(self, request, uidb64, token):
        new_password = request.data.get("new_password")
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(pk=uid)

            if default_token_generator.check_token(user, token):
                user.set_password(new_password)
                user.save()
                return Response({"message": "Password reset successful"})

            return Response({"error": "Invalid or expired link"}, status=400)
        except Exception:
            return Response({"error": "Invalid link"}, status=400)


# -------------------------------
# Admin - All Users
# -------------------------------
class AdminUserListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = CustomUser.objects.filter(is_staff=False)
        return Response(UserSerializer(users, many=True).data)


# -------------------------------
# Admin - Client Information
# -------------------------------
class AdminClientInfoListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        data = ClientInformation.objects.all()
        return Response(ClientInformationSerializer(data, many=True).data)


# -------------------------------
# Appointment API
# -------------------------------
class AppointmentView(APIView):
    def get(self, request):
        appointments = Appointment.objects.all().order_by("-created_at")
        return Response(AppointmentSerializer(appointments, many=True).data)

    def post(self, request):
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            appointment = serializer.save()
            return Response({
                "message": "Appointment booked",
                "appointment": AppointmentSerializer(appointment).data
            }, status=201)

        return Response(serializer.errors, status=400)


# -------------------------------
# User Appointment Search
# -------------------------------
class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all().order_by("-created_at")
    serializer_class = AppointmentSerializer

class DashboardSummaryView(APIView):
    # जर फक्त ॲडमिनला दाखवायचे असेल तर IsAdminUser वापरा
    # permission_classes = [IsAdminUser]

    def get(self, request):
        try:
            # १. आकडेवारी (Stats) गोळा करा
            total_counsellors = CustomUser.objects.filter(is_staff=True).count()
            total_clients = ClientInformation.objects.count()
            total_appointments = Appointment.objects.count()

            # २. टेबलसाठी अलीकडील १० क्लायंट्सची माहिती
            recent_clients = ClientInformation.objects.all().order_by('-created_at')[:10]
            client_serializer = ClientInformationSerializer(recent_clients, many=True)

            return Response({
                "stats": {
                    "counsellors": total_counsellors,
                    "clients": total_clients,
                    "appointments": total_appointments
                },
                "recent_clients": client_serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# -------------------------------
# Counsellor API (ViewSet) - ✅ हा स्वतंत्र असावा
# -------------------------------
class CounsellorViewSet(viewsets.ModelViewSet):
    queryset = Counsellor.objects.all()
    serializer_class = CounsellorSerializer


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer


# -------------------------------
# Notes API
# -------------------------------
class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all().order_by('-created_at') # नवीन नोट्स आधी दिसतील
    serializer_class = NoteSerializer