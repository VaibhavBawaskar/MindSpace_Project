from django.contrib import admin

from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Counsellor, DepressionScan, ClientInformation, Appointment, Client, Note

# 1. CustomUser Register kara (UserAdmin sobat jene karun password hashing disel)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'first_name', 'last_name', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('country', 'bio', 'preferred_language', 'profile_image')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)

# 2. Baki sagle Models Register kara
admin.site.register(Counsellor)
admin.site.register(DepressionScan)
admin.site.register(ClientInformation)
admin.site.register(Appointment)
admin.site.register(Client)
admin.site.register(Note)
# Register your models here.
