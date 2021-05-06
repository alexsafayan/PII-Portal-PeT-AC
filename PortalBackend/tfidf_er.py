import pandas as pd
import numpy as np
import json
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import csr_matrix
from sklearn.metrics import accuracy_score
from sklearn.metrics import classification_report

def run_tfidf(left, right):

    # make copies of the lists and dicionaries so the original data is not modified
    left_input = []
    left_input.append(left[0].copy())
    right_input = [[]]
    for guy in right[0]:
        right_input[0].append(guy.copy())

    delete_cols = []
    for each in left_input[0]:
        if('none' in str(left_input[0][each]).lower()):
            delete_cols.append(each)
    for col in delete_cols:
        del left_input[0][col]
    for item in right_input[0]:
        delete_cols=[]
        for each in item:
            if('none' in str(item[each]).lower()):
                delete_cols.append(each)
        for col in delete_cols:
            del item[col]

    """
    2. Organize the data
    into organized dataframe for the ease of processing.
    """

    def organize_data(left_data, right_data):
        print("left_data")
        print(left_data)
        print("right_data")
        print(right_data)
        df = pd.DataFrame(columns=['left', 'right','id'])

        for i in left_data:
            if isinstance(i, list):
                for j in i:
                    test = ''.join(str(x) for x in j.values())
                    df = df.append({'left': test}, ignore_index=True)

            elif isinstance(i, dict):
                test = ''.join(str(x) for x in i.values())
                df = df.append({'left': test}, ignore_index=True)
            else:
                print("Left Type Error: Input is not list/dict.")
                continue
            num = 0
            for m in right_data:
                if isinstance(m, list):
                    for n in m:
                        num += 1
                        test2 = ''.join(str(x) for x in n.values())
                        df = df.append({'right': test2,'id': num}, ignore_index=True)
                elif isinstance(m, dict):
                    test2 = ''.join(str(x) for x in m.values())
                    df = df.append({'right': test2}, ignore_index=True)
                else:
                    print("Right Type Error: Input is not list/dict.")
                    continue
        #df = df.dropna()

        return df
    df = organize_data(left_input, right_input)

    for i in left_input:
        input_content = ''.join(str(x) for x in i.values())

    df = df.assign(left=input_content)
    df2 = df.dropna()
    df2.to_csv('tfidf_df.csv')

    """
    3. Start entity resolution
    """
    vectorizer = TfidfVectorizer()
    m1 = vectorizer.fit_transform(df2['left'])
    m2 = vectorizer.transform(df2['right'])
    id_number = df2['id']
    surface_web_content = df2['right']

    length = m1.shape[0]

    """
    4. Print out the suspected leaked data to warn the users.
    """
    results = []
    for i in range(length):
        score = cosine_similarity(m1[i:i+1], m2[i:i+1])

        #mikey addition
        results.append(score[0][0])
    return results
