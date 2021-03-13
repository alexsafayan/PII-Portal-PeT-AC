from django.shortcuts import render

from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser 
from rest_framework import status
 
from backend.models import EmailModel, Subscription
from backend.serializers import EmailSerializer
from rest_framework.decorators import api_view
from script_backend import runEntityResolution

from backend.CalculateScore import calc_score, combine, combineMultiple, getSources

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
                print("crawlerresponse is ")
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
                comboResponse["percentile"] = .75
                entities.append(comboResponse)
                sourceList.append(sources)
                datesCollected.append(dateCollected)
            except Exception as e: 
                print(str(e))
                return JsonResponse({'error_message': str(e)}, status=status.HTTP_204_NO_CONTENT)
                 
            
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
        start_time = time.time()
        req = request.body.decode()
        dic = eval(req)

        name = dic.get('name')
        zip = dic.get('zip')
        entities = []
        sourceList = []
        datesCollected = []
        try: 
            # testItems = EmailModel.objects.filter(name=name, zip=zip)
            # print("testitems length")
            # print(len(testItems))
            # print("each item: ")
            # for testItem in testItems:
            #     email_serializer = EmailSerializer(testItem)
            #     print(email_serializer.data)
            #     print()
            # return
            item = EmailModel.objects.get(name=name, zip=zip)
            email_serializer = EmailSerializer(item)
            dbResponse = {}
            dbResponse.update(email_serializer.data)
            print("db response: ")
            print(dbResponse)
            elapsed_time = time.time() - start_time
            print("it took this long --- " + str(elapsed_time))
            return JsonResponse({"dbResponse":dbResponse},status=status.HTTP_202_ACCEPTED)


        except Exception as e: 
            print("ran into error : "+str(e))
            return JsonResponse({'message': 'This name and zip does not exist'}, status=status.HTTP_204_NO_CONTENT) 

@api_view(['GET', 'POST', 'DELETE'])
def searchSurfaceWeb(request):
    start_time = time.time()
    if request.method == 'POST':
        req = request.body.decode()
        dic = eval(req)

        name = dic.get('name')
        zip = dic.get('zip')
        surfaceWebResponse = []
        try: 
            # item = EmailModel.objects.get(name=name, zip=zip)
            
            data = {"name": name, "zip": zip}
            response = requests.post("http://127.0.0.1:5000/users", data)
            res = response.json()
            all_vals = []
            for values in res['info']:
                if type(values) != dict:
                    print("type not dict!!")
                    continue
                else:
                    if not "none" in str(values['name']).lower():
                        all_vals.append(values)
            print("crawlers response: ")
            print(all_vals)
            
            # for each in all_vals:
            for each in all_vals:
                temp = each.copy()
                score = calc_score(temp)
                temp["score"] = score
                surfaceWebResponse.append(temp)

            elapsed_time = time.time() - start_time
            print("it took this long --- " + str(elapsed_time))
            return JsonResponse({"surfaceWebResponse":surfaceWebResponse, "return":all_vals},status=status.HTTP_202_ACCEPTED)


        except Exception as e: 
            print("ran into error : "+str(e))
            return JsonResponse({'message': 'This name and zip does not exist'}, status=status.HTTP_204_NO_CONTENT) 

@api_view(['GET', 'POST', 'DELETE'])
def resolve_entities(request):
    start_time = time.time()
    if request.method == 'POST':
        req = request.body.decode()
        dic = eval(req)
        name = dic.get('name')
        zip = dic.get('zip')
        surfaceWebVals = dic.get("surfaceWebResponse")
        entities = []
        sourceList = []
        datesCollected = []
        try: 
            
            item = EmailModel.objects.get(name=name, zip=zip)
            email_serializer = EmailSerializer(item)
            dbResponse = {}
            dbResponse.update(email_serializer.data)
            ## gotta do an if statement in the case we have no surface web return

            left_input = []
            right_input = []
            left_input.append(dbResponse)
            right_input.append(surfaceWebVals)
            print("running ER")
            predictions = runEntityResolution(left_input, right_input) 
            print("predictions")
            print(predictions)
            # for each in all_vals:
            ind = 0
            nonMatches = []
            matches = []

            for each in surfaceWebVals:
                prediction = predictions[ind][1]
                if (prediction) > 0.01:
                    matches.append(each)
                else:
                    nonMatches.append(each)

                ind+=1
            if(len(matches)>0):
                comboResponse, sources, dateCollected = combineMultiple(matches,dbResponse)
            else:
                comboResponse = dbResponse
                sources, dateCollected = getSources(dbResponse)
            score = calc_score(comboResponse)
            comboResponse["score"] = score
            entities.append(comboResponse)
            sourceList.append(sources)
            datesCollected.append(dateCollected)

            # for each in nonMatches:
            #     sources, dateCollected = getSources(each)
            #     score = calc_score(each)
            #     each["score"] = score
            #     entities.append(each)
            #     sourceList.append(sources)
            #     datesCollected.append(dateCollected)

            elapsed_time = time.time() - start_time
            print("it took this long --- " + str(elapsed_time))
            return JsonResponse({"entities":entities, "sources": sourceList, "dates":datesCollected},status=status.HTTP_202_ACCEPTED)


        except Exception as e: 
            for each in surfaceWebVals:
                print("nothing found in database")
                sources, dateCollected = getSources(each)
                score = calc_score(each)
                each["score"] = score
                entities.append(each)
                sourceList.append(sources)
                datesCollected.append(dateCollected)
            

            return JsonResponse({"entities":entities, "sources": sourceList, "dates":datesCollected},status=status.HTTP_202_ACCEPTED)