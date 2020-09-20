from time import sleep, time
from pymongo import MongoClient
import mysql.connector


def connectToMongo():
    global client
    client = MongoClient("mongodb+srv://mike:b2EfzmjTvun36Hg@mikeycluster.sjrcu.mongodb.net/sample_airbnb?retryWrites=true&w=majority")

def connectToMySQL():
    global cnx
    global cursor
    cnx = mysql.connector.connect(user='mpesce', password='R*s7EyEOFw7N',
                                  host='10.128.227.11')
    cursor = cnx.cursor()

def main():
    start_time = time()
    connectToMongo()
    connectToMySQL()
    initiateNameArrays()
    addname()
    addfull_name()
    addfname()
    addFN()
    elapsed_time = time() - start_time
    print('this process took ' + str(elapsed_time) + ' seconds')


def initiateNameArrays():
    global name, full_name, fname, FN

    name = ['pid_2019.tormarket_cvv_init_backup', 'pid_2019.tormarket_10k',
     'pid_2019.diamondumps_cc_dedup',
     'cardingshop.goldenshopcvv', 'cardingshop.buybestcvv', 'cardingshop.diamond_cc',
     'pid_2019.isellz_nocvv_init', 'cardingshop.l33tcc',
     'pid_2019.diamondumps_cc_init', 'pid_2019.moneyteam_cc_dedup',
     'cardingshop.ebincvv', 'pid_2019.moneyteam_cc_init', 'pid_2019.geo_states', 'pid_2019.tormarket_cvv_init',
     'cardingshop.jokerstash_cvv', 'pid_2019.cyverse', 'pid_2019.tormarket_cvv_dedup', 'cardingshop.getcc']

    full_name = ['pii_2020.arrests', 'cardingshop.buyssn', 'pid_2019.isellz_nocvv_dedup', 'pid_2019.tormarket_full_name_zip']

    fname = ['pid_2019.rescator_ssn']

    FN = ['pii_2020.wt1_ssn']


def addname():

    db = client.pii
    collection = db.dark_net_data

    #add records from tables using 'name'
    for table in name:
        finalResult = []
        mysqltable = table.split('.')[1]
        describeQuery = "DESCRIBE "+table
        cursor.execute(describeQuery)
        describeResults = cursor.fetchall()
        columnNames = []
        for res in describeResults:
            columnNames.append(res[0])
        #print(columnNames)
        query = "SELECT * FROM "+table+" LIMIT 5;"
        cursor.execute(query)
        results = cursor.fetchall()
        for res in results:
            ind = 0
            record = {}
            for col in columnNames:
                if col == "name":
                    if not str(res[ind]) == 'None':
                        nm = res[ind].lower()
                    else:
                        nm = ''
                    record[col] = nm
                else:
                    record[col] = str(res[ind])
                ind += 1
            record["mysqltable"] = mysqltable
            finalResult.append(record)
        print(finalResult)
        collection.insert_many(finalResult)



def addfull_name():

    db = client.pii
    collection = db.dark_net_data

    for table in full_name:
        finalResult = []
        mysqltable = table.split('.')[1]
        describeQuery = "DESCRIBE "+table
        cursor.execute(describeQuery)
        describeResults = cursor.fetchall()
        columnNames = []
        for res in describeResults:
            columnNames.append(res[0])
        #print(columnNames)
        query = "SELECT * FROM "+table+" LIMIT 5;"
        cursor.execute(query)
        results = cursor.fetchall()

        for res in results:
            ind = 0
            record = {}
            for col in columnNames:
                if col == "full_name":
                    col = "name"
                    if not str(res[ind]) == 'None':
                        nm = res[ind].lower()
                    else:
                        nm = ''
                    record[col] = nm
                else:
                    record[col] = res[ind]
                ind += 1
            record["mysqltable"] = mysqltable
            finalResult.append(record)
        print(finalResult)
        collection.insert_many(finalResult)


def addfname():

    db = client.pii
    collection = db.dark_net_data

    for table in fname:
        finalResult = []
        mysqltable = table.split('.')[1]
        describeQuery = "DESCRIBE "+table
        cursor.execute(describeQuery)
        describeResults = cursor.fetchall()
        columnNames = []
        for res in describeResults:
            columnNames.append(res[0])
        #print(columnNames)
        query = "SELECT * FROM "+table+" LIMIT 5;"
        cursor.execute(query)
        results = cursor.fetchall()

        for res in results:
            ind = 0
            record = {}
            fn = ''
            ln = ''
            mn = ''
            for col in columnNames:
                if col == "fname":
                    fn = str(res[ind])
                elif col =="lname":
                    ln = str(res[ind])
                elif col == "mname":
                    mn = str(res[ind])
                    nm = ''
                    if(mn == "None" or mn == ''):
                        nm = nm + fn + ' ' + ln
                    else:
                        nm = nm + fn + ' ' + ' ' + mn + ' ' + ln
                    record['name'] = nm


                else:
                    record[col] = res[ind]
                ind += 1
            record["mysqltable"] = mysqltable
            finalResult.append(record)
        print(finalResult)
        collection.insert_many(finalResult)


def addFN():

    db = client.pii
    collection = db.dark_net_data

    for table in FN:
        finalResult = []
        mysqltable = table.split('.')[1]
        describeQuery = "DESCRIBE " + table
        cursor.execute(describeQuery)
        describeResults = cursor.fetchall()
        columnNames = []
        for res in describeResults:
            columnNames.append(res[0])
        # print(columnNames)
        query = "SELECT * FROM " + table + " LIMIT 5;"
        cursor.execute(query)
        results = cursor.fetchall()
        for res in results:
            ind = 0
            record = {}
            fn = ''
            ln = ''
            nm = ''
            for col in columnNames:
                if col == "FN":
                    fn = str(res[ind])
                elif col == "LN":
                    ln = str(res[ind])
                    nm = nm + fn + ' ' + ln
                    record['name'] = nm
                else:
                    record[col] = res[ind]
                ind += 1
            record["mysqltable"] = mysqltable
            finalResult.append(record)
        print(finalResult)
        collection.insert_many(finalResult)
main()