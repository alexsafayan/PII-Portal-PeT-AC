from rest_framework import serializers 
from backend.models import EmailModel, dark_net_data
 
 
class EmailSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = EmailModel
        fields = ('id',
                  'email',
                  'name',
                  'zip',
                  'phoneNumber')

class NameSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = dark_net_data
        fields = ('id',
                  'email',
                  'name',
                  'birthday',
                  'currentTown',
                  'gender',
                  'relationshipStatus',
                  'address',
                  'phoneNum',
                  'hometown',
                  'jobDetails',
                  'interests',
                  'politicalViews',
                  'religiousViews')
    