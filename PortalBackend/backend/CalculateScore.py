



def generate_boxplot(score, bucket):
        #key = "[1.75, 1.75]"
        key = "[4.33, 4.33]"
        newKey = "["+str(score)+", "+str(score)+"]"
        boxplot = "boxplotnew.html"
        if(bucket == "genz"):
                boxplot = "boxplotgenz.html"
        elif(bucket == "millenial"):
                boxplot = "boxplotmillenial.html"
        elif(bucket == "genx"):
                boxplot = "boxplotgenx.html"
        elif(bucket == "boomer"):
                boxplot = "boxplotboomer.html"
        elif(bucket == "silent"):
                boxplot = "boxplotsilent.html"

        f = open("backend/Boxplots/"+boxplot, "r")
        #f = open("backend/Boxplots/boxplotnew.html", "r")
        #w = open("backend/Boxplots/boxplotguy.html","w")

        original = f.read()

        new = original.replace(key,newKey)
        #w.write(new)
        f.close()
        #w.close()
        return new

#use this guy
def calc_score(attributes):
    score = 0
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
                attributes["phoneNumber"] = attributes["phoneNum"].split('-')[0]+'-***-****'
                attributes["phoneNum"] = True
        else:
                attributes["phoneNumber"] = False
        if(not 'none' in str(attributes["birthday"]).lower()):
                score+= sc["birthdate"]
               # print("adding score for birthday")
                bday = str(attributes["birthday"])
                attributes["birthday"] = True
                
                age = -1
                if("-" in bday):
                        splitt = bday.split("-")
                        age1 = int(splitt[0])
                        age2 = int(splitt[1])
                        age = int(round((age1+age2)/2, 0))
                elif(len(bday)) == 4:
                        #this bday is a year
                        print("this bday is a year")
                        age = 2020 - int(bday)
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
    return score


def combine(crawlerResponse, dbResponse):
        comboResponse = {}
        sources = {}
        
        for key, value in dbResponse.items():
                try:
                        found = False
                        sources[key] = []
                        if(not 'none' in str(value).lower()):
                                sources[key].append(dbResponse["platform"])
                                comboResponse[key] = value
                                found = True
                        if(not 'none' in str(crawlerResponse[key])):
                                sources[key].append(crawlerResponse["platform"])
                                if(not key in comboResponse):
                                        comboResponse[key] = crawlerResponse[key]
                                found = True
                        if(not found):
                                comboResponse[key] = 'none'
                except Exception as e:
                        #print("exception occurred when trying key: "+str(key))
                        print("exception: "+str(e))

        for key, value in sources.items():
                curr = ""
                for each in value:
                        curr+=each+', '
                sources[key] = curr[0:-2]

        return comboResponse, sources