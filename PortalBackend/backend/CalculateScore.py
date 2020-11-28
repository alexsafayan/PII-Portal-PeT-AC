
#accepts a json object of attributes to calculate and return privacy score
def calculate_score(attributes):
    score = 0
    sc = {"Contact Number": 0.6, "E-mail": 0.1833, "Address": 0.85, "Birthdate": 0.1166, 
    "Hometown": 0.15, "Current Town": 0.1166, "Job Details": 0.2, "Relationship Status": 0.4166, 
    "Interests": 0.3, "Religious Views": 0.5666, "Political Views": 0.6833}

    response = {"email": True, "address": True, "password": False, "phoneNumber": True, "zip": True, 
    "ssn": False, "birthday": True, "hometown": False, "currenttown": True, "jobdetails": False, 
    "relationshipstatus": False, "interests": False, "political": False, "religious": False, "score": score}

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