from django.urls import path, include  # ✅ 'include' ॲड केले आहे
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter  # ✅ हे इंपोर्ट करणे गरजेचे आहे

from .views import (
    ProfileView,
    ChangePasswordView,
    SignupView,
    LoginView,
    SaveLanguageView,
    DepressionScanView,
    ClientInformationView,
    AdminLoginView,
    AdminRegisterView,
    ForgotPasswordView,
    ResetPasswordConfirmView,
    AppointmentViewSet,
    DashboardSummaryView,
    CounsellorViewSet,
    ClientViewSet,
    NoteViewSet
)

# १. ViewSet साठी Router सेटअप करा
router = DefaultRouter()
router.register(r'counsellors', CounsellorViewSet, basename='counsellor')
router.register(r'clients', ClientViewSet, basename='client')
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'notes', NoteViewSet, basename='notes') # ✅ हे बरोबर आहे

urlpatterns = [
    # ---------------- Router URLs ----------------
    path('', include(router.urls)),  # ✅ हे विसरू नका, यामुळे /api/counsellors/ चालू होईल



    # ---------------- User ----------------
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),

    # पासवर्ड रिसेट APIs
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset-password-confirm/<str:uidb64>/<str:token>/', ResetPasswordConfirmView.as_view(), name='reset_password_confirm'),

    path('save-language/', SaveLanguageView.as_view(), name='save_language'),
    path('depression-scan/', DepressionScanView.as_view(), name='depression_scan'),
    path('client-information/', ClientInformationView.as_view(), name='client_information'),

    # ---------------- Admin & Dashboard ----------------
    path('admin-register/', AdminRegisterView.as_view(), name='admin_register'),
    path('admin-login/', AdminLoginView.as_view(), name='admin_login'),
    path("profile/<int:user_id>/", ProfileView.as_view(), name='profile'),
    path("change-password/<int:user_id>/", ChangePasswordView.as_view(), name='change_password'),

    path('dashboard-summary/', DashboardSummaryView.as_view(), name='dashboard_summary'),
]

# ✅ MEDIA FILES (profile images)
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )