from django.shortcuts import render

from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser 
from rest_framework import status
 
from backend.models import EmailModel, Subscription
from backend.serializers import EmailSerializer
from rest_framework.decorators import api_view

from backend.TwitterCollector import TwitterCollector
from backend.InstagramCollector import InstagramCollector
from backend.ThatThemCollector import ThatThemCollector
from backend.FlickrCollector import FlickrCollector
from backend.CalculateScore import calc_score, generate_boxplot

import json
import time
import requests


# Create your views here.
@api_view(['GET', 'POST', 'DELETE'])
def email_list(request):
    # GET list of emails, POST a new email, DELETE all emails
    if request.method == 'GET':
        req = request.body.decode()
        try: 
            body = json.loads(req)
        except Exception as e:
            body = str(e)
        #content = body['content']
        #dic = eval(req)
        # name = dic.get('name')
        # other = dic.get('other')
        return JsonResponse({"request":str(request), "req": str(req), "body": body},status=status.HTTP_202_ACCEPTED)
    #     emails = EmailModel.objects.all()
        
    #     title = request.GET.get('email', None)
    #     if title is not None:
    #         emails = emails.filter(title__icontains=title)
        
    #     emails_serializer = EmailSerializer(emails, many=True)
    #     return JsonResponse(emails_serializer.data, safe=False)
        # 'safe=False' for objects serialization
    

    if request.method == 'POST':
        req = request.body.decode()
        dic = eval(req)
        if 'email' in dic:

            email = dic.get('email')
            print("email is : " +str(email))
            try: 
                item = EmailModel.objects.filter(email=email)[0]
                spider_url = 'https://thatsthem.com/email/' + email
                scrapyrt_url = 'http://localhost:9080/crawl.json?spider_name=mydomain&url='
                final_url = scrapyrt_url + spider_url
                print(final_url)
                results = requests.get(url=final_url)
                #print(results.json()['items'][0])
                response = results.json()['items'][0]
                print(response)
                response["email"] = email
                score = calc_score(response)
                print("score : " + str(score))
                #plot = generate_boxplot(score)
                plot = generate_boxplot(score, response["agebucket"])
                response["score"] = score
                response["plot"] = plot
                response["platform"] = "that's them"
            except Exception as e: 
                print(str(e))
                return JsonResponse({'error_message': str(e)}, status=status.HTTP_204_NO_CONTENT)
                 
            email_serializer = EmailSerializer(item)
            #return JsonResponse(email_serializer.data)
            return JsonResponse(response,status=status.HTTP_202_ACCEPTED)


        elif 'name' in dic:
            name = dic.get('name').lower()
            other = dic.get('other')
            
            if 'addie' in name and 'jones' in name:
                response = {"email": True, "address": True, "password": False, "phoneNumber": True, "zip": True, "ssn": False, "birthday": True, "hometown": False, "currenttown": True, "jobdetails": False, "relationshipstatus": False, "interests": False, "political": False, "religious": False}
                
            else:
                response = {"email": False, "address": False, "password": False, "phoneNumber": False, "zip": False, "ssn": False, "birthday": False, "hometown": False, "currenttown": False, "jobdetails": False, "relationshipstatus": False, "interests": False, "political": False, "religious": False}
            score = calc_score(response)
            #plot = generate_boxplot(score)
            plot = generate_boxplot(score, response["agebucket"])
            response["score"] = score
            response["plot"] = plot
            
            return JsonResponse(response,status=status.HTTP_202_ACCEPTED)
@api_view(['GET', 'PUT', 'DELETE'])
def email_detail(request, email):
    # find email
    try: 
        item = EmailModel.objects.get(email=email) 
    except EmailModel.DoesNotExist: 
        return JsonResponse({'message': 'The email does not exist'}, status=status.HTTP_204_NO_CONTENT) 
    # GET email
    if request.method == 'GET': 
        email_serializer = EmailSerializer(item) 
        return JsonResponse(email_serializer.data)

@api_view(['POST'])
def email_subscribe(request):
    if request.method == 'POST':
        req = request.body.decode()
        dic = eval(req)
        email = dic.get('email')
        try: 
            item = Subscription(email=email)
            item.save()
            #print("\n\n\n\n\n\n\n\n\n"+str(item)+"\n\n\n\n\n\n\n\n\n\n")
        except: 
            return JsonResponse({'message': 'There was an error'}, status=status.HTTP_204_NO_CONTENT) 
        return JsonResponse({'message': 'Success'})

@api_view(['GET', 'POST', 'DELETE'])
def name_detail(request):
    
    if request.method == 'POST':
        req = request.body.decode()
        dic = eval(req)
        # print(dic)
        name = dic.get('name')
        zip = dic.get('zip')
        # print(zip)
        try: 
            item = EmailModel.objects.get(name=name, zip=zip)
            # print("item below")
            # print(item)
            # print()
            # item_2 = EmailModel.objects.get(zip=zip)

            start_time = time.time()

            tc = TwitterCollector()
            tc_result = tc.crawl(inputDict={"fullname": name, "zip": zip})

            # ic = InstagramCollector()
            # ic_result = ic.crawl(inputDict={"fullname": name, "zip": zip})

            # thatsthem = ThatThemCollector(executablePath= r"C:\Users\ajula\Desktop\AI Lab On-Site\geckodriver.exe")
            # thatsthem_result = thatsthem.crawl(inputDict={"fullname": name, "zip": zip})

            # flickr = FlickrCollector(executablePath= r"C:\Users\ajula\Desktop\AI Lab On-Site\geckodriver.exe")
            # flickr_result = flickr.crawl(inputDict={"fullname": name, "zip": zip})

            elapsed_time = time.time() - start_time
            print("it took this long --- " + str(elapsed_time))

            print(tc_result)
            # print()
            # print(ic_result)
            # print()
            # print(thatsthem_result)
            # print()
            # print(flickr_result)
            

        except EmailModel.DoesNotExist: 
            return JsonResponse({'message': 'This name and zip does not exist'}, status=status.HTTP_204_NO_CONTENT) 
        email_serializer = EmailSerializer(item)
        print("email_serializer below")
        print(email_serializer.data)
        return JsonResponse(email_serializer.data)

@api_view(['GET', 'POST', 'DELETE'])
def name_detail2(request):
    
    if request.method == 'POST':
        req = request.body.decode()
        dic = eval(req)
        # print(dic)
        name = dic.get('name')
        zip = dic.get('zip')
        # print(zip)
        try: 
            namesplit = name.split(' ')
            re1 = r'%'
            for each in namesplit:
                re1+=each
                re1+='%'
            print("re1 below")
            print(re1)
            #re1 = '%'+name+'%'
            re2 = '%'+str(zip)+'%'
            item = EmailModel.objects.filter(name__contains=namesplit[0], zip__contains=zip)[0]
            #item = dark_net_data.objects.raw('Select name, birthday, currentTown, address, gender, relationshipStatus, phoneNum, email, hometown, jobDetails, interests, religiousViews, politicalViews from backend_dark_net_data where name like \''+re1+'\' and address like \''+re2+'\'')[0]
            #item = dark_net_data.objects.raw('SELECT * FROM backend_dark_net_data')[0]
            # print("item below")
            # print(item)
            # print()
            # item_2 = EmailModel.objects.get(zip=zip)

            start_time = time.time()

            elapsed_time = time.time() - start_time
            print("it took this long --- " + str(elapsed_time))


        except Exception as e: 
            print("error!!!: "+str(e))
            return JsonResponse({'message': 'This name and zip does not exist'}, status=status.HTTP_204_NO_CONTENT) 
        name_serializer = EmailSerializer(item)
        #print("name_serializer below")
        #print(name_serializer.data)
        response = {}
        response.update(name_serializer.data)
        print("response is ")
        print(response)
        #print("calculating score using response")
        score = calc_score(response)
        print("score : " + str(score))
        plot = generate_boxplot(score, response["agebucket"])
        response["score"] = score
        response["plot"] = plot
        response["platform"] = response["platform"].replace("_",", ")
        return JsonResponse(response,status=status.HTTP_202_ACCEPTED)
        #return JsonResponse(name_serializer.data)