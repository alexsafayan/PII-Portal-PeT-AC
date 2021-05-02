from datetime import datetime
import json


#use this guy
def calc_score(attributes):
    score = 0 
#     print("\ncalculating score of:")
#     print(attributes)
    if not "zip" in attributes:
            print("setting zip")
            attributes['zip'] = "none"
    sc = {"phoneNumber": 1.434, "email": 0.438, "address": 2.032, "birthdate": 0.279, 
    "hometown": 0.359, "currentTown": 0.279, "jobDetails": 0.478, "relationshipStatus": 0.996, 
    "interests": 0.717, "religiousViews": 1.355, "politicalViews": 1.633}

#     sc = {"phoneNumber": 0.6, "email": 0.1833, "address": 0.85, "birthdate": 0.1166, 
#     "hometown": 0.15, "currentTown": 0.1166, "jobDetails": 0.2, "relationshipStatus": 0.4166, 
#     "interests": 0.3, "religiousViews": 0.5666, "politicalViews": 0.6833}

    try:
        attributes["agebucket"] = "none"
        attributes["medianscore"] = "tot"
        if(not 'none' in str(attributes["email"]).lower()):
            score+= sc["email"]
            #print("adding score for email")
            attributes["email"] = True
        else:
                attributes["email"] = False
        if(not 'none' in str(attributes["address"]).lower()):
                score+= sc["address"]
             #   print("adding score for address")
                attributes["address"] = True
        else:
                attributes["address"] = False
        if(not 'none' in str(attributes["phoneNum"]).lower()):
                score+= sc["phoneNumber"]
              #  print("adding score for phoneNumber")
                pn = ''
                if(isinstance(attributes["phoneNum"],list)):
                        print("phone numbers are a list")
                        pn = attributes["phoneNum"][0]
                else:
                        print("phone numbers are NOT a list")
                        pn = attributes["phoneNum"]
                numberPrefix = ''
                for character in pn:
                        if character.isdigit():
                                numberPrefix += character
                                if(len(numberPrefix)>=3):
                                        break
                if(len(numberPrefix)==3):
                        #attributes["phoneNumber"] = pn.split('-')[0]+'-***-****'
                        attributes["phoneNumber"] = numberPrefix+'-***-****'
                        attributes["phoneNum"] = True
                else:
                        attributes["phoneNum"] = False
                        attributes["phoneNumber"] = "unknown"
        else:
                attributes["phoneNum"] = False
                attributes["phoneNumber"] = "unknown"
        if(not 'none' in str(attributes["birthday"]).lower()):
                score+= sc["birthdate"]
               # print("adding score for birthday")
                bday = str(attributes["birthday"])
                attributes["birthday"] = True
                today = datetime.today()
                curryear = today.year
                age = -1
                if("-" in bday):
                        splitt = bday.split("-")
                        age1 = int(splitt[0])
                        age2 = int(splitt[1])
                        age = int(round((age1+age2)/2, 0))
                elif('/' in bday):
                        print("this bday is complete")
                        splitt = bday.split("/")
                        mn = splitt[0]
                        day = splitt[1]
                        year = splitt[2]
                        print("birthyear is: "+str(year))
                        attributes["birthyear"] = year
                        age = curryear - int(year)
                elif(len(bday)) == 4:
                        #this bday is a year
                        attributes["birthyear"] = bday
                        print("this bday is a year")
                        age = curryear - int(bday)
                elif(len(bday) < 4 and len(bday) > 0):
                        #this bday is anage
                        print("this bday is an age")
                        age = int(bday)
                attributes["age"] = age
                if(age > 7 and age < 24):
                        attributes["agebucket"] = "generation z"
                        attributes["medianscore"] = 1.9
                elif(age > 23 and age < 40):
                        attributes["agebucket"] = "the milennial generation"
                        attributes["medianscore"] = 2.4
                elif(age > 39 and age < 56):
                        attributes["agebucket"] = "generation x"
                        attributes["medianscore"] = 3.3
                elif(age > 55 and age < 75):
                        attributes["agebucket"] = "the baby boomer generation"
                        attributes["medianscore"] = 3.6
                elif(age > 74):
                        attributes["agebucket"] = "the silent generation"
                        attributes["medianscore"] = 3.6

        else:
                attributes["birthday"] = False
                attributes["birthyear"] = "unknown"
        if(not 'none' in str(attributes["hometown"]).lower() or not 'none' in str(attributes["zip"]).lower()):
                score+= sc["hometown"]
                #print("adding score for hometown")
                attributes["hometown"] = True
                if(not 'none' in str(attributes["zip"]).lower()):
                        attributes["zip"] = attributes["zip"][0:2]+'***'
        else:
                attributes["hometown"] = False
                attributes["zip"] = False
        if(not 'none' in str(attributes["currentTown"]).lower()):
                score+= sc["currentTown"]
                #print("adding score for currentTown")
                attributes["currentTown"] = True
        else:
                attributes["currentTown"] = False
        if(not 'none' in str(attributes["jobDetails"]).lower()):
                score+= sc["jobDetails"]
                #print("adding score for jobDetails")
                attributes["jobDetails"] = True
        else:
                attributes["jobDetails"] = False
        if(not 'none' in str(attributes["relationshipStatus"]).lower()):
                score+= sc["relationshipStatus"]
                #print("adding score for relationshipStatus")
                attributes["relationshipStatus"] = True
        else:
                attributes["relationshipStatus"] = False
        if(not 'none' in str(attributes["interests"]).lower()):
                score+= sc["interests"]
                #print("adding score for interests")
                attributes["interests"] = True
        else:
                attributes["interests"] = False
        if(not 'none' in str(attributes["politicalViews"]).lower()):
                score+= sc["politicalViews"]
                #print("adding score for politicalViews")
                attributes["politicalViews"] = True
        else:
                attributes["politicalViews"] = False
        if(not 'none' in str(attributes["religiousViews"]).lower()):
                score+= sc["religiousViews"]
                #print("adding score for religiousViews")
                attributes["religiousViews"] = True
        else:
                attributes["religiousViews"] = False
    except Exception as e:
        print(e)

    score = round(score,1)
    print("score is: "+str(score))
    return score


def combine(crawlerResponse, dbResponse):
        comboResponse = {"email": "none"}
        sources = {}
        dateCollected = {}
        currDate = datetime.today().strftime('%Y-%m-%d')
        
        for key, value in dbResponse.items():
                try:
                        found = False
                        sources[key] = []
                        if(not 'none' in str(value).lower()):
                                sources[key].append(dbResponse["platform"])
                                dateCollected[key] = dbResponse["dateCollected"].split(' ')[0]
                                comboResponse[key] = value
                                found = True
                        
                        if(not 'none' in str(crawlerResponse[key]).lower()):
                                sources[key].append(crawlerResponse["platform"])
                                # if(not key in comboResponse):
                                comboResponse[key] = crawlerResponse[key]
                                dateCollected[key] = currDate
                                found = True
                        if(not found):
                                comboResponse[key] = 'none'
                except Exception as e:
                        #print("exception occurred when trying key: "+str(key))
                        #print("exception: "+str(e))
                        pass

        for key, value in sources.items():
                curr = ""
                for each in value:
                        curr+=each+', '
                sources[key] = curr[0:-2]
        comboResponse['name'] = crawlerResponse['name']
        return comboResponse, sources, dateCollected

def combineMultiple(crawlerResponses, dbResponse):
        comboResponse = {"email": "none"}
        sources = {}
        dateCollected = {}
        currDate = datetime.today().strftime('%Y-%m-%d')
        
        #add db response items first
        for key, value in dbResponse.items():
                try:
                        sources[key] = []
                        #print(" combining {} from db response".format(key))
                        if(not 'none' in str(value).lower()):
                                sources[key].append(dbResponse["platform"])
                                dateCollected[key] = dbResponse["dateCollected"].split(' ')[0]
                        comboResponse[key] = value
                except Exception as e:
                        #print("exception occurred when trying key: "+str(key))
                        #print("exception: "+str(e))
                        pass
        for crawlerResponse in crawlerResponses:
                for key, value in comboResponse.items():
                        try:
                                if(not 'none' in str(crawlerResponse[key]).lower()):
                                        sources[key].append(crawlerResponse["platform"])
                                        dateCollected[key] = currDate = datetime.today().strftime('%Y-%m-%d')
                                        comboResponse[key] = crawlerResponse[key]
                        except Exception as e:
                                #print("exception occurred when trying key: "+str(key))
                                #print("exception: "+str(e))
                                pass
        
        for key, value in sources.items():
                curr = ""
                sourceSet = set()
                for each in value:
                        if not each in sourceSet:
                                curr+=each+', '
                        sourceSet.add(each)
                sources[key] = curr[0:-2]
        # comboResponse['name'] = crawlerResponses['name']
        return comboResponse, sources, dateCollected

def getSources(response):
        sources = {}
        dateCollected = {}
        for key, value in response.items():
                try:
                        sources[key] = []
                        if(not 'none' in str(value).lower()):
                                sources[key].append(response["platform"])
                                if("dateCollected") in response:
                                        dateCollected[key] = response["dateCollected"].split(' ')[0]
                                else:
                                        dateCollected[key] = datetime.today().strftime('%Y-%m-%d')
                        #comboResponse[key] = value
                except Exception as e:
                        #print("exception occurred when trying key: "+str(key))
                        #print("exception: "+str(e))
                        pass
        return sources, dateCollected

def normalizeAge(attributes):
        if(not 'none' in str(attributes["birthday"]).lower()):
               # print("adding score for birthday")
                bday = str(attributes["birthday"])
                today = datetime.today()
                curryear = today.year
                age = -1
                if("-" in bday):
                        splitt = bday.split("-")
                        age1 = int(splitt[0])
                        age2 = int(splitt[1])
                        age = int(round((age1+age2)/2, 0))
                elif('/' in bday):
                        print("this bday is complete")
                        splitt = bday.split("/")
                        mn = splitt[0]
                        day = splitt[1]
                        year = splitt[2]
                        attributes["birthyear"] = year
                        age = curryear - int(year)
                elif(len(bday)) == 4:
                        print("this bday is a year")
                        attributes["birthyear"] = bday
                        age = curryear - int(bday)
                elif(len(bday) < 4 and len(bday) > 0):
                        print("this bday is an age")
                        age = int(bday)
                attributes["age"] = age

def checkPhone(attributes):
        if(not 'none' in str(attributes["phoneNum"]).lower()):
              #  print("adding score for phoneNumber")
                pn = ''
                if(isinstance(attributes["phoneNum"],list)):
                        print("phone numbers are a list")
                        pn = attributes["phoneNum"][0]
                else:
                        print("phone numbers are NOT a list")
                        pn = attributes["phoneNum"]
                numberPrefix = ''
                for character in pn:
                        if character.isdigit():
                                numberPrefix += character
                                if(len(numberPrefix)>=3):
                                        break
                if(len(numberPrefix)==3):
                        #attributes["phoneNumber"] = pn.split('-')[0]+'-***-****'
                        attributes["phoneNumber"] = numberPrefix+'-***-****'
                        attributes["phoneNum"] = True
                else:
                        attributes["phoneNum"] = False
                        attributes["phoneNumber"] = "unknown"
        else:
                attributes["phoneNum"] = False
                attributes["phoneNumber"] = "unknown"

def clean_address(response):
        # clean zip
        try: 
                if(not 'none' in str(response['zip']).lower()):
                        zipcode = response['zip']
                        zipcode_clean = "{}***".format(zipcode[0:2])
                        response['zip'] = zipcode_clean
        except:
                print('error cleaning zip')
        try:
                if(not 'none' in str(response['address']).lower()):
                        address = response['address']
                        address_split = address.split(' ')
                        address_clean = str(address_split[0]) + ' ' + str(address_split[1][0:2]) + '**********'
                        response['address'] = address_clean
        except:
                print('error cleaning address')
        
        try:
                if(not 'none' in str(response['currentTown']).lower()):
                        currentTown = response['currentTown']
                        currentTown_clean = str(currentTown[0:2]) + '******'
                        response['city'] = currentTown_clean
                        del response['currentTown']
        except:
                print('error cleaning current town')

        try:
                if(not 'none' in str(response['hometown']).lower()):
                        hometown = response['hometown']
                        hometown_clean = str(hometown[0:2]) + '******'
                        response['city'] = hometown_clean
                        del response['hometown']
        except:
                print('error cleaning home town')

        try:
                if(not 'none' in str(response['city']).lower()):
                        city = response['city']
                        city_clean = str(city[0:2]) + '******'
                        response['city'] = city_clean
        except:
                print('error cleaning home town')



def clean_response(response):
        normalizeAge(response)
        checkPhone(response)
        clean_address(response)
        delete_cols = []
        for each in response:
                if('none' in str(response[each]).lower()):
                        delete_cols.append(each)
        for col in delete_cols:
                del response[col]
        try:
                if(response['birthday'] == response['birthyear']):
                        del response['birthday']
        except:
                pass

        #create attribute for easy printing on frontend
        allAttributes = response.copy()
        try:
                del allAttributes['platform']
        except:
                pass
        try:
                del allAttributes['dateCollected']
        except:
                pass
        try: 
                del allAttributes['age']
        except:
                pass
        try: 
                del allAttributes['phoneNum']
        except:
                pass
        attributes = ""
        for each in allAttributes:
                attributes += "{0}: {1}, ".format(each,allAttributes[each])

        response['attributes'] = attributes[0:-2]


        
