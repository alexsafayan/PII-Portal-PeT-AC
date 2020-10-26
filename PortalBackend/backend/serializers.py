from rest_framework import serializers 
from backend.models import EmailModel
 
 
class EmailSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = EmailModel
        fields = ('id',
                  'email',
                  'name',
                  'zip',
                  'phoneNumber')