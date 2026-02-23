from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid # फाईलच्या सर्वात वरती ॲड करा
# --------------------------
# Custom User Model
# --------------------------
class CustomUser(AbstractUser):
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    country = models.CharField(max_length=50, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    preferred_language = models.CharField(max_length=10, blank=True, null=True)
    profile_image = models.ImageField(upload_to="profiles/", blank=True, null=True)

    def __str__(self):
        return self.username

# --------------------------
# 🔥 Counsellor Model (आता बरोबर आहे!)
# --------------------------
class Counsellor(models.Model):
    PRIORITY_CHOICES = [
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low'),
    ]

    # १. युजरसोबत संबंध (लॉगिनसाठी अत्यंत आवश्यक)
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="counsellor_profile",
        null=True, blank=True
    )

    # २. युनिक आयडी (हा आपण आपोआप तयार करू)
    counsellor_id = models.CharField(max_length=20, unique=True, editable=False)

    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    specialization = models.CharField(max_length=255)
    total_sessions = models.IntegerField(default=0)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='Medium')

    # ३. काही अतिरिक्त उपयुक्त फील्ड्स
    phone = models.CharField(max_length=15, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # जर counsellor_id नसेल, तर तो आपोआप तयार होईल (उदा: CNSL-A1B2)
        if not self.counsellor_id:
            self.counsellor_id = f"CNSL-{str(uuid.uuid4())[:4].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.specialization})"

# --------------------------
# Depression Scanning Model
# --------------------------
class DepressionScan(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="depression_scans")
    q1 = models.IntegerField()
    q2 = models.IntegerField()
    q3 = models.IntegerField()
    q4 = models.IntegerField()
    total_score = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - Score: {self.total_score}"

# --------------------------
# Client Information Model
# --------------------------
class ClientInformation(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="client_info")
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    age = models.IntegerField()
    dob = models.DateField()
    email = models.EmailField()
    mobile = models.CharField(max_length=15)
    marital_status = models.CharField(max_length=20)
    address = models.CharField(max_length=200)
    pin_code = models.CharField(max_length=6)
    state = models.CharField(max_length=50)
    district = models.CharField(max_length=50)
    job = models.CharField(max_length=100, blank=True, null=True)
    company = models.CharField(max_length=100, blank=True, null=True)
    stress_reason = models.JSONField(default=list, blank=True)
    father = models.CharField(max_length=50, blank=True, null=True)
    mother = models.CharField(max_length=50, blank=True, null=True)
    spouse = models.CharField(max_length=50, blank=True, null=True)
    children = models.CharField(max_length=100, blank=True, null=True)
    grandfather = models.CharField(max_length=50, blank=True, null=True)
    grandmother = models.CharField(max_length=50, blank=True, null=True)
    sister = models.CharField(max_length=50, blank=True, null=True)
    brother = models.CharField(max_length=50, blank=True, null=True)
    marks = models.JSONField(default=dict, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.first_name} {self.last_name}"

# --------------------------
# Appointment Model
# --------------------------
class Appointment(models.Model):
    # React ला लागणारी सर्व फील्ड्स इथे ॲड केली आहेत
    client_id = models.CharField(max_length=50, blank=True, null=True)
    name = models.CharField(max_length=255) # patient_name ऐवजी 'name' ठेवा म्हणजे मॅपिंग सोपे जाईल
    appointment_spec = models.TextField(blank=True, null=True)
    date = models.DateField()
    time = models.TimeField()
    mode = models.CharField(max_length=50, default='Audio')
    status = models.CharField(max_length=50, default='Pending')
    set_by = models.CharField(max_length=100, default='Counselor')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.date}"

class Client(models.Model):
    STATUS_CHOICES = [
        ('Confirmed', 'Confirmed'),
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
    ]

    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    counsellor = models.CharField(max_length=255, default='On Hold')
    last_session = models.CharField(max_length=100, default='--')
    next_session = models.CharField(max_length=100, default='Today')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')

    def __str__(self):
        return self.name


# --------------------------
#  Note Model
# --------------------------
class Note(models.Model):
    # 'null=True, blank=True' मुळे React मधून 'user' न पाठवताही नोट सेव्ह होईल.
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="user_notes",
        null=True,
        blank=True
    )
    title = models.CharField(max_length=255)
    content = models.TextField()
    tag = models.CharField(max_length=50, default="General")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class UserSetting(models.Model):
    # Counsellor sobat link kela mhanje data manage karne sope jaate
    counsellor = models.OneToOneField('Counsellor', on_delete=models.CASCADE, related_name='settings')
    language = models.CharField(max_length=50, default="English")
    theme = models.CharField(max_length=20, default="Light")
    timezone = models.CharField(max_length=100, default="IST (UTC+5:30)")
    date_format = models.CharField(max_length=50, default="DD/MM/YYYY")

    def __str__(self):
        return f"Settings for {self.counsellor.name}"