
#accepts a json object of attributes to calculate and return privacy score
#use calc_score, not this function
def calculate_score(attributes):
    score = 0
    sc = {"Contact Number": 0.6, "E-mail": 0.1833, "Address": 0.85, "Birthdate": 0.1166, 
    "Hometown": 0.15, "Current Town": 0.1166, "Job Details": 0.2, "Relationship Status": 0.4166, 
    "Interests": 0.3, "Religious Views": 0.5666, "Political Views": 0.6833}

        #example response
    response = {"email": True, "address": True, "password": False, "phoneNumber": True, "zip": True, 
    "ssn": False, "birthday": True, "hometown": False, "currenttown": True, "jobdetails": False, 
    "relationshipstatus": False, "interests": False, "political": False, "religious": False}

    try:

        if(attributes["email"] == True):
            score+= sc["E-mail"]
        if(attributes["address"] == True or attributes["zip"] == True):
                score+= sc["Address"]
        # if(attributes["password"] == True):
        #         score+= sc["Email"]
        if(attributes["phoneNumber"] == True):
                score+= sc["Contact Number"]
        # if(attributes["zip"] == True):
        #         score+= sc["address"]
        # if(attributes["ssn"] == True):
        #         score+= sc["ssn"]
        if(attributes["birthday"] == True):
                score+= sc["Birthdate"]
        if(attributes["hometown"] == True):
                score+= sc["Hometown"]
        if(attributes["currenttown"] == True):
                score+= sc["Current Town"]
        if(attributes["jobdetails"] == True):
                score+= sc["Job Details"]
        if(attributes["relationshipstatus"] == True):
                score+= sc["Relationship Status"]
        if(attributes["interests"] == True):
                score+= sc["Interests"]
        if(attributes["political"] == True):
                score+= sc["Political Views"]
        if(attributes["religious"] == True):
                score+= sc["Religious Views"]
    except Exception as e:
        print(e)

    score = round(score,1)
    return score



def generate_boxplot(score):
    key = "[1.75, 1.75]"
    newKey = "["+str(score)+", "+str(score)+"]"
    f = open("backend/Boxplots/boxplot1.html", "r")
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
    sc = {"phoneNumber": 0.6, "email": 0.1833, "address": 0.85, "birthdate": 0.1166, 
    "hometown": 0.15, "currentTown": 0.1166, "jobDetails": 0.2, "relationshipStatus": 0.4166, 
    "interests": 0.3, "religiousViews": 0.5666, "politicalViews": 0.6833}

    try:
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
                attributes["phoneNumber"] = True
        else:
                attributes["phoneNumber"] = False
        if(not 'none' in str(attributes["birthday"]).lower()):
                score+= sc["birthdate"]
               # print("adding score for birthday")
                attributes["birthday"] = True
        else:
                attributes["birthday"] = False
        if(not 'none' in str(attributes["hometown"]).lower()):
                score+= sc["hometown"]
                #print("adding score for hometown")
                attributes["hometown"] = True
        else:
                attributes["hometown"] = False
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
