
# --------------------------
# User Serializer
# --------------------------
from rest_framework import serializers
from .models import CustomUser, DepressionScan, ClientInformation, Appointment,Counsellor,Client,Note

# --------------------------
# User Serializer ✅ (Profile Image Fix सह)
# --------------------------
class UserSerializer(serializers.ModelSerializer):
    # इमेजचा पूर्ण URL मिळवण्यासाठी हे उपयुक्त ठरू शकते
    profile_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = CustomUser
        fields = [
            'id',
            'username',
            'email',
            'password',
            'first_name',
            'last_name',
            'country',
            'bio',
            'preferred_language',
            'profile_image',
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        # युजर बनवताना password hashing महत्त्वाचे आहे
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            country=validated_data.get('country', ''),
            bio=validated_data.get('bio', ''),
            preferred_language=validated_data.get('preferred_language', ''),
            profile_image=validated_data.get('profile_image', None) # फोटो इथेही ॲड केला
        )
        return user

    # टीप: update() मेथड इथे लिहिण्याची गरज नाही,
    # कारण ModelSerializer ती आपोआप हाताळतो.

# --------------------------
# 🔥 Counsellor Serializer (हे असं डाव्या बाजूला चिकटवून लिहा)
# --------------------------
class CounsellorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Counsellor
        fields = '__all__'

# --------------------------
# Depression Scan Serializer ✅
# --------------------------
class DepressionScanSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepressionScan
        fields = ['id', 'user', 'q1', 'q2', 'q3', 'q4', 'total_score', 'created_at']
        read_only_fields = ['total_score', 'created_at']

    def create(self, validated_data):
        # बेरीज करताना चुका होऊ नयेत म्हणून हे लॉजिक वापरा
        q1 = validated_data.get('q1', 0)
        q2 = validated_data.get('q2', 0)
        q3 = validated_data.get('q3', 0)
        q4 = validated_data.get('q4', 0)

        validated_data['total_score'] = q1 + q2 + q3 + q4
        return super().create(validated_data)

# --------------------------
# Client Information Serializer ✅
# --------------------------
class ClientInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientInformation
        fields = '__all__'  # include all fields from model
        read_only_fields = ['created_at']  # auto-managed timestamp


# ==========================
# 🔥 Appointment Serializer ✅ (नवीन जोडले)
# ==========================
class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ['created_at']

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'


# --------------------------
# Note Serializer
# --------------------------
class NoteSerializer(serializers.ModelSerializer):
    # खालील दोन ओळींच्या मागे बरोबर ४ 'Spaces' किंवा १ 'Tab' असावा
    created_at = serializers.DateTimeField(format="%b %d, %Y", read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True, required=False)

    class Meta:
        # या दोन ओळी Class Meta च्या आत आहेत, म्हणून तिथे अजून जास्त स्पेस असावी
        model = Note
        fields = ['id', 'user', 'title', 'content', 'tag', 'created_at']