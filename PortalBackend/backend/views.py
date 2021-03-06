from django.shortcuts import render

from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser 
from rest_framework import status
 
from backend.models import EmailModel, Subscription
from backend.serializers import EmailSerializer
from rest_framework.decorators import api_view


from backend.CalculateScore import calc_score, combine

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
        return JsonResponse({"request":str(request), "req": str(req), "body": body},status=status.HTTP_202_ACCEPTED)
    #     emails_serializer = EmailSerializer(emails, many=True)
    #     return JsonResponse(emails_serializer.data, safe=False)
        # 'safe=False' for objects serialization
    

    if request.method == 'POST':
        req = request.body.decode()
        dic = eval(req)
        entities = []
        sourceList = []
        datesCollected = []
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
                crawlerResponse = results.json()['items'][0]
                crawlerResponse["email"] = email
                crawlerResponse["platform"] = "that's them"
                crawlerResponse["zip"] = crawlerResponse["hometown"].split('-')[-1]
                print(crawlerResponse)
                email_serializer = EmailSerializer(item)
                dbResponse = {}
                dbResponse.update(email_serializer.data)
                print("dbresponse is ")
                print(dbResponse)
                # here we would need to do entity resolution; then return either resolved entity or multiple entities


                #in the case the entites are the same, combine them:
                comboResponse, sources, dateCollected = combine(crawlerResponse,dbResponse)


                #then calc score:
                score = calc_score(comboResponse)
                print("score : " + str(score))

                comboResponse["score"] = score
                
            except Exception as e: 
                print(str(e))
                return JsonResponse({'error_message': str(e)}, status=status.HTTP_204_NO_CONTENT)
                 
            comboResponse["percentile"] = .75
            entities.append(comboResponse)
            sourceList.append(sources)
            datesCollected.append(dateCollected)
            return JsonResponse({"entities":entities, "sources": sourceList, "dates":datesCollected},status=status.HTTP_202_ACCEPTED)


        elif 'val' in dic:
            val = dic.get('val')
            response = {}
            if val == 'val1':
                response['score'] = 3.6
                #plot = generate_boxplot(3.6, 'millenial')
                #response['plot'] = plot
            else:
                response['score'] = 5.4
                #plot = generate_boxplot(5.4, 'boomer')
                #response['plot'] = plot
            return JsonResponse(response,status=status.HTTP_202_ACCEPTED)
                
# @api_view(['GET', 'PUT', 'DELETE'])
# def email_detail(request, email):
#     # find email
#     try: 
#         item = EmailModel.objects.get(email=email) 
#     except EmailModel.DoesNotExist: 
#         return JsonResponse({'message': 'The email does not exist'}, status=status.HTTP_204_NO_CONTENT) 
#     # GET email
#     if request.method == 'GET': 
#         email_serializer = EmailSerializer(item) 
#         return JsonResponse(email_serializer.data)

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

@api_view(['GET', 'POST', 'DELETE']) #not used ?
def name_detail(request):
    
    if request.method == 'POST':
        req = request.body.decode()
        dic = eval(req)

        name = dic.get('name')
        zip = dic.get('zip')
        entities = []
        sourceList = []
        datesCollected = []
        try: 
            item = EmailModel.objects.get(name=name, zip=zip)
            start_time = time.time()
            data = {"name": name, "zip": zip}
            response = requests.post("http://127.0.0.1:5000/users", data)
            res = response.json()
            all_vals = []
            for values in res['info']:
                if type(values) != dict:
                    print("type not dict!!")
                    continue
                else:
                    all_vals.append(values)
                    # print("value:")
                    # print(values)
            # print("all vals")
            # print(all_vals)

            ## HERE WE NEED TO DO ER MATCHING OF EACH RETURNED RESULT WITH THE DB RESPONSE, THEN COMBINE DIFF MATCHING RESULTS INTO ENTITIES


            ## IN THE CASE THAT WE HAVE MATCHING RECORDS, COMBINE:
            email_serializer = EmailSerializer(item)
            dbResponse = {}
            dbResponse.update(email_serializer.data)
            # for each in all_vals:
            for each in all_vals:
                comboResponse, sources, dateCollected = combine(each,dbResponse)
                score = calc_score(comboResponse)
                comboResponse["score"] = score
                entities.append(comboResponse)
                sourceList.append(sources)
                datesCollected.append(dateCollected)

            # each = all_vals[0]
            # comboResponse, sources, dateCollected = combine(each,dbResponse)
            #then calc score:
            # score = calc_score(comboResponse)
            # comboResponse["score"] = score
            # entities.append(comboResponse)
            # sourceList.append(sources)
            # datesCollected.append(dateCollected)
            elapsed_time = time.time() - start_time
            print("it took this long --- " + str(elapsed_time))
            return JsonResponse({"entities":entities, "sources": sourceList, "dates":datesCollected},status=status.HTTP_202_ACCEPTED)


        except Exception as e: 
            print("ran into error : "+str(e))
            return JsonResponse({'message': 'This name and zip does not exist'}, status=status.HTTP_204_NO_CONTENT) 
        # email_serializer = EmailSerializer(item)
        # print("email_serializer below")
        # print(email_serializer.data)
        # return JsonResponse(email_serializer.data)

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

            re2 = '%'+str(zip)+'%'
            print(namesplit[0].strip())

            #item = EmailModel.objects.filter(name__startswith=namesplit[0].strip(), zip__contains=zip)[0]

            #return all entries with matching first name and zip
            item = None
            items = EmailModel.objects.filter(name__startswith=namesplit[0].strip(), zip__contains=zip)
            lname = namesplit[-1].lower()
            for i in items:
                ilname = i.name.split(' ')[-1].lower()
                if lname == ilname:
                    item = i
                    break

            start_time = time.time()

            elapsed_time = time.time() - start_time
            print("it took this long --- " + str(elapsed_time))


        except Exception as e: 
            print("error!!!: "+str(e))
            return JsonResponse({'message': 'This name and zip does not exist'}, status=status.HTTP_204_NO_CONTENT) 

        if item == None:
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
        #plot = generate_boxplot(score, response["agebucket"])
        response["score"] = score
        #response["plot"] = plot
        response["platform"] = response["platform"].replace("_",", ")
        return JsonResponse(response,status=status.HTTP_202_ACCEPTED)
        #return JsonResponse(name_serializer.data)