import mcan
import os
import pandas as pd

"""
1. Load Data
Input Data: from our database
Output Data: aggregated from the crawlers
Both are list of dicts, can also come from json.
"""
def runEntityResolution(dbResponse, surfaceWebResponse):
    input_test = [{"username": "Kenneth1", "profilename": "Kenneth Hall", "id": 12811523,
            "description": "Independent producer, writer, actor, FX artist. Founder and President of Total Fabrication, "
                            "The Fright Film Factory", "following_count": 157, "followers_count": 224}]

    output_test =[[{"username": "KennethJHall1", "profilename": "Kenneth J. Hall", "id": 1281152394,
            "description": "Independent director, producer, writer, actor, designer, FX artist. Founder and President of Total Fabrication, "
                            "The Fright Film Factory, and Tiki-Monster", "following_count": 357, "followers_count": 424},
            {"username": "KHall_HDU", "profilename": "Kenneth Hall", "id": 760602590900023297,
            "description": "Leadership Training Manager with Home Depot University. Faith, Family & FSU Football The postings on this site are my own.",
            "following_count": 796, "followers_count": 1846},
            {"username": "khall1987", "profilename": "Kenneth Hall", "id": 389713557,
            "description": "Denturist. Dryden, ON.  Realistic fan of Jays, Leafs, Raps, and mostly all sports!",
            "following_count": 1729, "followers_count": 279}]]

    """
    2. Organize the data
    into organized dataframe for the ease of processing.
    """
    # print("ER left input: ")
    # print(dbResponse)
    # print("ER right input: ")
    # print(surfaceWebResponse)
    def organize_data2(left_data, right_data):
        df = pd.DataFrame(columns=['left_', 'right_','id'])

        for i in left_data:
            if isinstance(i, list):
                for j in i:
                    test = ''.join(str(x) for x in j.values())
                    df = df.append({'left_': test}, ignore_index=True)

            elif isinstance(i, dict):
                test = ''.join(str(x) for x in i.values())
                df = df.append({'left_': test}, ignore_index=True)
            else:
                print("Left Type Error: Input is not list/dict.")
                continue
            num = 0
            for m in right_data:
                if isinstance(m, list):
                    for n in m:
                        num += 1
                        test2 = ''.join(str(x) for x in n.values())
                        df = df.append({'right_': test2,'id': num}, ignore_index=True)
                elif isinstance(m, dict):
                    test2 = ''.join(str(x) for x in m.values())
                    df = df.append({'right_': test2}, ignore_index=True)
                else:
                    print("Right Type Error: Input is not list/dict.")
                    continue
        #df = df.dropna()

        return df

    df = organize_data2(dbResponse, surfaceWebResponse)

    for i in dbResponse:
        input_content = ''.join(str(x) for x in i.values())

    df = df.assign(left_=input_content)
    df2 = df.dropna()
    del df
    df2['label'] = '1'

    # Save the test file in local for documentation. Can delete later.
    cwd = os.getcwd()
    df2.to_csv('test_processed.csv',index=False)
    len = df2.shape[0]

    """
    3. Start entity resolution
    The suspected leaked data to warn the users.
    """
    print(str(len) + " suspected records retrieved from surface web, computing if they are your data...")

    train, validation, test = mcan.data.process(path= cwd , train='test_processed.csv',
        validation='test_processed.csv',
        test='test_processed.csv')
    model = mcan.MCANModel()
    print("initialized mcanmodel")
    #No necessary to train the model.
    #model.run_train(train, validation, epochs=35, batch_size= 16, best_save_path='best_model3.pth')
    #best_model_PATH = 'D:/first/PII/MCA/best_model2.pth'
    #best_model_PATH = 'MCA/best_model2.pth' 
    best_model_PATH = './best_model.pth'
    model.load_state(best_model_PATH)
    print("load state completed, going to run prediction now")
    #eval and predict are actually identical in our case.
    #model.run_eval(test)
    return1, return2 = model.run_prediction(test)
    print("prediction successful")
    #df.loc[df['_right'] == ID_of_PII]

    #Remove the documentation if we want.
    os.remove("test_processed.csv")
    return return2
