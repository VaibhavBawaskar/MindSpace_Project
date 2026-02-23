from django.contrib import admin
from django.urls import path, include
# ✅ हे दोन इम्पॉर्ट्स ॲड करा
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]

# ✅ डेव्हलपमेंट मोडमध्ये मीडिया फाइल्स सर्व्ह करण्यासाठी हे जोडा
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)