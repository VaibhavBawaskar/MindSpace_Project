from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets  # <--- इथे 'viewsets' ॲड करा
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import IsAdminUser
import random # फाईलच्या वरती इंपोर्ट करा
from django.core.mail import send_mail
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from rest_framework.parsers import JSONParser
from .models import CustomUser, Counsellor, UserSetting  # ✅ 'UserSetting' ॲड करा

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
                        "user_id": user.id,  # React ला थेट आयडी मिळण्यासाठी ही ओळ सोपी पडते
                        "user": UserSerializer(user).data,
                        "first_time": first_time
                    })
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )


# -------------------------------
# Save Preferred Language (FIXED)
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
            # इथे User ऐवजी CustomUser वापरा
            user = CustomUser.objects.get(id=user_id)

            user.preferred_language = language
            user.save()

            return Response(
                {"message": "Language saved successfully!", "language": language},
                status=status.HTTP_200_OK
            )
        except CustomUser.DoesNotExist: # इथेही CustomUser करा
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
# -------------------------------
# Notes API
# -------------------------------

# -------------------------------
# Depression Scan API
# -------------------------------
from datetime import date
class DepressionScanView(APIView):
    def get(self, request):
        user_id = request.query_params.get('user_id')

        if user_id:
            # १. जर URL मध्ये ?user_id= असेल तर फक्त त्या युजरचा डेटा द्या (User App साठी)
            scans = DepressionScan.objects.filter(user_id=user_id).order_by('-created_at')
        else:
            # २. जर user_id नसेल, तर सर्व स्कॅन्स द्या (Counsellor Dashboard साठी) ✅
            scans = DepressionScan.objects.all().order_by('-created_at')

        serializer = DepressionScanSerializer(scans, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    # २. डेटा सेव्ह करण्यासाठी (POST) - तुझा जुना कोड ✅
    def post(self, request):
        serializer = DepressionScanSerializer(data=request.data)

        if serializer.is_valid():
            scan = serializer.save()
            user = scan.user

            # ClientInformation अपडेट किंवा तयार करा
            client_info, created = ClientInformation.objects.get_or_create(
                user=user,
                defaults={
                    'first_name': user.username,
                    'last_name': 'Pending',
                    'age': 0,
                    'dob': date(2000, 1, 1),
                    'email': user.email or "example@mail.com",
                    'mobile': '0000000000',
                    'marital_status': 'Single',
                    'address': 'Pending',
                    'pin_code': '000000',
                    'state': 'Pending',
                    'district': 'Pending',
                    'marks': {}
                }
            )

            # स्कोअर टक्केवारी कॅल्क्युलेशन (१२ पैकी)
            percentage = round((scan.total_score / 12) * 100)

            # JSONField मधील 'marks' अपडेट करा
            marks = dict(client_info.marks) if client_info.marks else {}
            marks["Depression"] = percentage
            client_info.marks = marks
            client_info.save()

            return Response({
                "message": "Assessment saved successfully",
                "total_score": scan.total_score,
                "percentage": percentage
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# -------------------------------
# Client Information API
# -------------------------------
class ClientInformationView(APIView):
    # १. नवीन माहिती सेव्ह करण्यासाठी (POST)
    def post(self, request):
        serializer = ClientInformationSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.save()
            return Response({
                "message": "Client information saved successfully",
                "data": ClientInformationSerializer(data).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # २. माहिती मिळवण्यासाठी (GET) - डॅशबोर्ड आणि प्रोफाइल दोन्हीसाठी ✅
    def get(self, request):
        user_id = request.query_params.get("user_id")

        if user_id:
            # जर URL मध्ये ?user_id= असेल तर एका युजरचा डेटा द्या
            try:
                info = ClientInformation.objects.filter(user_id=user_id).first()
                if not info:
                    return Response({"message": "No data found for this user"}, status=404)
                return Response(ClientInformationSerializer(info).data, status=200)
            except Exception as e:
                return Response({"error": str(e)}, status=400)
        else:
            # जर user_id नसेल तर सर्व क्लायंटची लिस्ट द्या (डॅशबोर्डसाठी) ✅
            all_clients = ClientInformation.objects.all().order_by('-created_at')
            serializer = ClientInformationSerializer(all_clients, many=True)
            return Response(serializer.data, status=200)


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
    # जर तुम्ही URL मध्ये ID वापरत असाल, तर इथे user_id अनिवार्य आहे
    def post(self, request, user_id):
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        try:
            # URL मधून आलेल्या ID नुसार युजर शोधा
            user = CustomUser.objects.get(id=user_id)

            # जुना पासवर्ड तपासा
            if not user.check_password(old_password):
                return Response({"error": "Wrong current password"}, status=status.HTTP_400_BAD_REQUEST)

            # नवीन पासवर्ड सेट करा
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)

        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


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
# सुधारित AdminUserListView लॉजिक
class AdminUserListView(APIView):
    # permission_classes = [IsAdminUser]  <-- हे कमेंट करा 🛑
    permission_classes = [] # <-- हे ॲड करा ✅ (सर्वांसाठी खुला करण्यासाठी)

    def get(self, request):
        users = CustomUser.objects.filter(is_staff=False)
        combined_data = []

        for user in users:
            client_entry = Client.objects.filter(email=user.email).first()

            combined_data.append({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "preferred_language": user.preferred_language,
                # खालील बदल करा: str() वापरल्याने ऑब्जेक्ट एरर येणार नाही
                "counsellor": str(client_entry.counsellor) if client_entry and client_entry.counsellor else "Not Assigned",
                "last_session": str(client_entry.last_session) if client_entry and client_entry.last_session else "--",
                "next_session": str(client_entry.next_session) if client_entry and client_entry.next_session else "TBD",
                "status": client_entry.status if client_entry else "Pending",
            })

        return Response(combined_data)
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

class CounsellorSignupView(APIView):
    def post(self, request):
        data = request.data
        try:
            # १. आधीच युजर आहे का तपासा
            if CustomUser.objects.filter(username=data.get('username')).exists():
                return Response({"error": "हे युजरनेम आधीच वापरले आहे."}, status=400)

            # २. आधी 'CustomUser' तयार करा (हा लॉगिनसाठी लागतोच)
            user = CustomUser.objects.create_user(
                username=data.get('username'),
                email=data.get('email'),
                password=data.get('password'),
                first_name=data.get('name', '').split(' ')[0],
                is_staff=True # जेणेकरून तो कौन्सिलर पोर्टल वापरू शकेल
            )

            # ३. कौन्सिलर आयडी तयार करा
            random_id = f"CNSL{random.randint(100, 999)}"

            # ४. ✅ सर्वात महत्त्वाचे: 'Counsellor' टेबलमध्ये डेटा साठवा
            counsellor_profile = Counsellor.objects.create(
                user=user,                     # हा युजरला कौन्सिलरशी जोडतो
                counsellor_id=random_id,
                name=data.get('name'),         # React मधून आलेले Full Name
                email=data.get('email'),
                specialization=data.get('specialization', 'General')
            )

            # ५. कौन्सिलरसाठी सेटिंग्स तयार करा (Settings पेज चालण्यासाठी)
            UserSetting.objects.get_or_create(counsellor=counsellor_profile)

            return Response({
                "message": "Counsellor registered successfully! 🎉",
                "counsellor_name": counsellor_profile.name
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": f"डेटा सेव्ह करताना चूक झाली: {str(e)}"}, status=400)
class UserSettingView(APIView):
    permission_classes = [IsAuthenticated]
    # ✅ 415 एरर टाळण्यासाठी JSONParser अत्यंत आवश्यक आहे
    parser_classes = [JSONParser]

    def get(self, request):
        try:
            # लॉगिन असलेल्या युजरची काउन्सेलर प्रोफाइल मिळवा
            counsellor = Counsellor.objects.get(user=request.user)
            # त्या काउन्सेलरचे सेटिंग्स मिळवा (नसतील तर तयार करा)
            setting, created = UserSetting.objects.get_or_create(counsellor=counsellor)

            data = {
                "fullName": counsellor.name,
                "email": counsellor.email,
                "phone": getattr(counsellor, 'phone', ""),
                "specialization": counsellor.specialization,
                "language": setting.language,
                "theme": setting.theme,
                "timezone": setting.timezone,
                "dateFormat": setting.date_format
            }
            return Response(data, status=200)
        except Counsellor.DoesNotExist:
            return Response({"error": "Counsellor profile not found"}, status=404)

    def patch(self, request):
        data = request.data
        try:
            counsellor = Counsellor.objects.get(user=request.user)
            setting = UserSetting.objects.get(counsellor=counsellor)

            # १. Counsellor प्रोफाइल अपडेट (React च्या 'fullName' मधून)
            if 'fullName' in data:
                counsellor.name = data.get('fullName')
                # CustomUser मधील नाव पण अपडेट करायचे असेल तर:
                request.user.first_name = data.get('fullName').split(' ')[0]
                request.user.save()

            counsellor.specialization = data.get('specialization', counsellor.specialization)
            counsellor.phone = data.get('phone', counsellor.phone)
            counsellor.save()

            # २. User Preferences अपडेट
            setting.language = data.get('language', setting.language)
            setting.theme = data.get('theme', setting.theme)
            setting.timezone = data.get('timezone', setting.timezone)
            setting.save()

            return Response({"message": "Settings updated successfully! ✅"}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)