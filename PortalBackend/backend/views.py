from django.shortcuts import render

from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser 
from rest_framework import status
 
from backend.models import EmailModel
from backend.serializers import EmailSerializer
from rest_framework.decorators import api_view

# Create your views here.
@api_view(['GET', 'POST', 'DELETE'])
def email_list(request):
    # GET list of emails, POST a new email, DELETE all emails
    if request.method == 'GET':
        emails = EmailModel.objects.all()
        
        title = request.GET.get('email', None)
        if title is not None:
            emails = emails.filter(title__icontains=title)
        
        emails_serializer = EmailSerializer(emails, many=True)
        return JsonResponse(emails_serializer.data, safe=False)
        # 'safe=False' for objects serialization

    if request.method == 'POST':
        req = request.body.decode()
        dic = eval(req)
        email = dic.get('email')
        try: 
            item = EmailModel.objects.filter(email=email)[0]
            #print("\n\n\n\n\n\n\n\n\n"+str(item)+"\n\n\n\n\n\n\n\n\n\n")
        except EmailModel.DoesNotExist: 
            return JsonResponse({'message': 'The email does not exist'}, status=status.HTTP_404_NOT_FOUND) 
        email_serializer = EmailSerializer(item)
        return JsonResponse(email_serializer.data)
@api_view(['GET', 'PUT', 'DELETE'])
def email_detail(request, email):
    # find email
    try: 
        item = EmailModel.objects.get(email=email) 
    except EmailModel.DoesNotExist: 
        return JsonResponse({'message': 'The email does not exist'}, status=status.HTTP_404_NOT_FOUND) 
    # GET email
    if request.method == 'GET': 
        email_serializer = EmailSerializer(item) 
        return JsonResponse(email_serializer.data)