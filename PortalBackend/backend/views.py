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
    if request.method == 'POST':
        req = request.body.decode()
        dic = eval(req)
        entities = []
        sourceList = []
        datesCollected = []
        if 'email' in dic:
            email = dic.get('email')
            print("email is : {}".format(email))
            try: 
                item = EmailModel.objects.filter(email=email)[0]
                email_serializer = EmailSerializer(item)
                dbResponse = {}
                dbResponse.update(email_serializer.data)
                for key in dbResponse:
                    val = dbResponse[key]
                    if val == None:
                        dbResponse[key] = str(val)
                print("dbresponse is ")
                print(dbResponse)
            except Exception as e: 
                print(str(e))
                return JsonResponse({'error_message': str(e)}, status=status.HTTP_204_NO_CONTENT)
                 
            
            return JsonResponse({"dbResponse":dbResponse},status=status.HTTP_202_ACCEPTED)
                
@api_view(['GET', 'POST', 'DELETE'])
def searchSurfaceWebEmail(request):
    start_time = time.time()
    if request.method == 'POST':
        req = request.body.decode()
        dic = eval(req)

        email = dic.get('email')
        surfaceWebResponse = []
        try: 
            # item = EmailModel.objects.get(name=name, zip=zip)
            
            spider_url = 'https://thatsthem.com/email/' + email
            scrapyrt_url = 'http://localhost:9080/crawl.json?spider_name=mydomain&url='
            final_url = scrapyrt_url + spider_url
            print(final_url)
            results = requests.get(url=final_url)
            #print(results.json()['items'][0])
            res = results.json()['items']
            print("total amount of results is {}".format(len(res)))
            crawlerResponse = results.json()['items'][0]
            crawlerResponse["email"] = email
            crawlerResponse["platform"] = "that's them"
            crawlerResponse["zip"] = crawlerResponse["hometown"].split('-')[-1]
            print("crawlerresponse is ")
            print(crawlerResponse)

            elapsed_time = time.time() - start_time
            print("it took this long --- " + str(elapsed_time))
            return JsonResponse({"surfaceWebResponse":crawlerResponse},status=status.HTTP_202_ACCEPTED)


        except Exception as e: 
            print("ran into error : "+str(e))
            return JsonResponse({'message': 'This name and zip does not exist'}, status=status.HTTP_204_NO_CONTENT) 

@api_view(['GET', 'POST', 'DELETE'])
def resolve_entitiesEmail(request):
    print("in resolve_entities EMAILLL")
    start_time = time.time()
    if request.method == 'POST':
        req = request.body.decode()
        dic = eval(req)
        dbResponse = dic.get("dbResponse")
        surfaceWebVals = []
        surfaceWebVals.append(dic.get("surfaceWebResponse"))
        entities = []
        sourceList = []
        datesCollected = []
        try: 
            left_input = []
            right_input = []
            left_input.append(dbResponse)
            right_input.append(surfaceWebVals)
            # print("running ER on \n left \n{0} \n and \nright \n{1}".format(left_input, right_input))
            predictions = runEntityResolution(left_input, right_input) 
            # print("predictions")
            # print(predictions)
            # for each in all_vals:
            ind = 0
            for dbResponse in left_input:
                nonMatches = []
                matches = []
                for each in surfaceWebVals:
                    
                    prediction = predictions[ind][1]
                    #print("comparing db guy {0} with surface web guy {1}. prediction says {2}".format(dbResponse,each,prediction))
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

            elapsed_time = time.time() - start_time
            print("it took this long --- " + str(elapsed_time))
            return JsonResponse({"entities":entities, "sources": sourceList, "dates":datesCollected},status=status.HTTP_202_ACCEPTED)


        except Exception as e: 
            print("error occurred on resolve email entities :")
            print(e)
            return JsonResponse({'message': 'This name and zip does not exist'}, status=status.HTTP_204_NO_CONTENT)

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
            dbResponses = []
            items = EmailModel.objects.filter(name=name, zip=zip)
            for item in items:
                email_serializer = EmailSerializer(item)
                dbResponses.append(email_serializer.data)
            if len(dbResponses) == 0:
                return JsonResponse({'message': 'This name and zip does not exist'}, status=status.HTTP_204_NO_CONTENT) 
            print("db response: ")
            print(dbResponses)
            elapsed_time = time.time() - start_time
            print("it took this long --- " + str(elapsed_time))
            return JsonResponse({"dbResponse":dbResponses},status=status.HTTP_202_ACCEPTED)


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
            # print("crawlers response: ")
            # print(all_vals)
            
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
    print("in resolve_entities")
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
            dbResponses = []
            items = EmailModel.objects.filter(name=name, zip=zip)
            for item in items:
                email_serializer = EmailSerializer(item)
                dbResponses.append(email_serializer.data)
            
            right_input = []
            left_input = dbResponses
            # left_input = []
            # left_input.append(dbResponses[1])
            right_input.append(surfaceWebVals)
            print("running ER on \n left \n{0} \n and \nright \n{1}".format(left_input, right_input))
            predictions = runEntityResolution(left_input, right_input) 
            print("predictions")
            print(predictions)
            # for each in all_vals:
            ind = 0
            for dbResponse in left_input:
                nonMatches = []
                matches = []
                for each in surfaceWebVals:
                    
                    prediction = predictions[ind][1]
                    #print("comparing db guy {0} with surface web guy {1}. prediction says {2}".format(dbResponse,each,prediction))
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
            print("error occurred : {0}".format(str(e)))
            return JsonResponse({'message': 'This name and zip does not exist'}, status=status.HTTP_204_NO_CONTENT)