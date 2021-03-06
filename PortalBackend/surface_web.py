import json
from flask import Flask, g
from flask_restful import reqparse, Api, Resource
from bs4 import BeautifulSoup
import requests
from fake_useragent import UserAgent
import zipcodes
import re

app = Flask(__name__)
api = Api(app)
parser_put = reqparse.RequestParser()
parser_put.add_argument("name", type=str, required=True, help="need full name data")
parser_put.add_argument("zip", type=str, required=True, help="need zip data")
ua = UserAgent()

us_statesO = {
    'Alabama': 'AL',
    'Alaska': 'AK',
    'American Samoa': 'AS',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'District of Columbia': 'DC',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Guam': 'GU',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Northern Mariana Islands': 'MP',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Pennsylvania': 'PA',
    'Puerto Rico': 'PR',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virgin Islands': 'VI',
    'Virginia': 'VA',
    'Washington': 'WA',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY'
}

us_states = {
    'AL': 'Alabama',
    'AK': 'Alaska',
    'AS': 'American Samoa',
    'AZ': 'Arizona',
    'AR': 'Arkansas',
    'CA': 'California',
    'CO': 'Colorado',
    'CT': 'Connecticut',
    'DE': 'Delaware',
    'DC': 'District of Columbia',
    'FL': 'Florida',
    'GA': 'Georgia',
    'GU': 'Guam',
    'HI': 'Hawaii',
    'ID': 'Idaho',
    'IL': 'Illinois',
    'IN': 'Indiana',
    'IA': 'Iowa',
    'KS': 'Kansas',
    'KY': 'Kentucky',
    'LA': 'Louisiana',
    'ME': 'Maine',
    'MD': 'Maryland',
    'MA': 'Massachusetts',
    'MI': 'Michigan',
    'MN': 'Minnesota',
    'MS': 'Mississippi',
    'MO': 'Missouri',
    'MT': 'Montana',
    'NE': 'Nebraska',
    'NV': 'Nevada',
    'NH': 'New Hampshire',
    'NJ': 'New Jersey',
    'NM': 'New Mexico',
    'NY': 'New York',
    'NC': 'North Carolina',
    'ND': 'North Dakota',
    'MP': 'Northern Mariana Islands',
    'OH': 'Ohio',
    'OK': 'Oklahoma',
    'OR': 'Oregon',
    'PA': 'Pennsylvania',
    'PR': 'Puerto Rico',
    'RI': 'Rhode Island',
    'SC': 'South Carolina',
    'SD': 'South Dakota',
    'TN': 'Tennessee',
    'TX': 'Texas',
    'UT': 'Utah',
    'VT': 'Vermont',
    'VI': 'Virgin Islands',
    'VA': 'Virginia',
    'WA': 'Washington',
    'WV': 'West Virginia',
    'WI': 'Wisconsin',
    'WY': 'Wyoming',
}



def initial_hearder():
    header = ua.random
    headers = {'User-Agent': header}
    return headers


def distribution(name, zip):
    result_list = []
    zip_info = zipcodes.matching(str(zip))[0]
    st = zip_info["state"]
    city = zip_info["city"]
    state = us_states[st]
    try:
        peekyoures = peekyou(name, state, city)
        # print("peekyoures : ")
        # print(peekyoures)
        result_list += peekyoures
    except Exception as e:
        print("error on peekyou")
    try:
        spokeores = spokeo(name, st, city)
        # print("spokeores : ")
        # print(spokeores)
        result_list += spokeores
    except Exception as e:
        print("error on spokeo")
    try:
        zabares = zabasearch(name, st, city)
        anywhores = anywho(name, st, city)
        # print("zabares : ")
        # print(zabares)
        # print("anywhores : ")
        # print(anywhores)
        result_list += zabares + anywhores
    except:
        print("error on zaba")
    # print("result_list : ")
    # print(result_list)
    return result_list


def anywho(name, state, city):
    result_list = []
    header = initial_hearder()
    try:
        
        for i in range(1, 2000):
            url = 'https://www.anywho.com/people/{0}/{1}+{2}/?page={3}'.format(name.replace(" ", "+"), city.replace(" ", "+"), state,i)
            try:
                response = requests.get(url, headers=header, timeout=(10, 10))
                soup = BeautifulSoup(response.text, 'lxml', from_encoding='utf8')
                title = soup.find('title')
                if "None" in str(title):
                    break
                info = save_info_anywho(soup)
                result_list.append(info)
            except Exception as err:
                header = initial_hearder()
                print(str(err))
        return result_list
    except Exception as err:
        print(str(err))


def save_info_anywho(soup):
    result_list = []
    extractedValues = {'name': 'None', 'platform': 'Anywho', 'birthday': 'None', 'currentTown': 'None', 'gender': 'none',
                       'state': 'None', 'address': 'None', 'phoneNum': 'None', 'Relatives': 'None',
                       'email': 'None', 'jobDetails': 'None', 'Alias': 'None', 'politicalViews': 'none',
                       'Ethnicity': 'None', 'religiousViews': 'None', 'relationshipStatus': 'none', 'AnnualIncome': 'None',
                       'NetWorth': 'none', 'hometown': 'none', 'interests': 'none'}

    try:
        cards_list = soup.findAll('div', {'class': "person-info"})
        try:
            for card in cards_list:
                name = card.find('a', {'class': 'name-link'}).text.strip()
                address = card.findAll('p')[0].text
                phone = card.findAll('p')[1].text.replace("", "")
                text = card.text.strip().replace("\n", '').replace("View profile", "").replace(name, "").replace(
                    address, "").replace(phone, "").strip()
                if "Age" in text:
                    extractedValues['Age'] = text.replace(", Age ", "")
                extractedValues['name'] = name
                extractedValues['address'] = address
                extractedValues['phoneNum'] = phone
                try:
                    city_state = address.split(", ")
                    city = city_state[1]
                    state = city_state[2][:2]
                    extractedValues['city'] = city
                    extractedValues['state'] = state
                except:
                    pass
                print(extractedValues)
                result_list.append(extractedValues)
            return extractedValues
        except:
            pass
    except:
        return


def zabasearch(name, state, city):
    header = initial_hearder()
    result_list = []
    url = 'https://www.zabasearch.com/people/{0}/{1}+{2}/'.format(name.replace(" ", "+"), city.replace(" ", "+"), state)
    try:
        response = requests.get(url, headers=header, timeout=(10, 10))
        soup = BeautifulSoup(response.text, 'lxml', from_encoding='utf8')
        result_list.append(save_info_zabasearch(soup))
        try:
            pages = len(soup.find('div', {'id': "pagination"}).findAll('a', {'class': "a-pag"})) - 1
            for page in range(2, pages + 1):
                following_url = url + str(page)
                try:
                    following_response = requests.get(following_url, headers=header, timeout=(10, 10))
                    following_soup = BeautifulSoup(following_response.text, 'lxml', from_encoding='utf8')
                    result_list.append(save_info_zabasearch(following_soup))
                except Exception as err:
                    print(str(err))
        except Exception as err:
            print(str(err))
        return result_list
    except Exception as err:
        print(str(err))
        return


def save_info_zabasearch(soup):
    extractedValues = {'name': 'None', 'platform': 'Zabasearch', 'birthday': 'None', 'currentTown': 'None', 'gender': 'none',
                       'state': 'None', 'address': 'None', 'phoneNum': 'None', 'Relatives': 'None',
                       'email': 'None', 'jobDetails': 'None', 'Alias': 'None', 'politicalViews': 'none',
                       'Ethnicity': 'None', 'religiousViews': 'None', 'relationshipStatus': 'none', 'AnnualIncome': 'None',
                       'NetWorth': 'none', 'hometown': 'none', 'interests': 'none'}

    ppl_list = soup.findAll('div', {'class': "person-info"})
    for ppl in ppl_list:
        ppl_info = json.loads("".join(ppl.find("script", {"type": "application/ld+json"}).contents))
        try:
            extractedValues['name'] = ppl_info['name']
        except:
            pass

        try:
            extractedValues['currentTown'] = ppl_info['address']['addressLocality']
        except:
            pass

        try:
            extractedValues['state'] = ppl_info['address']['addressRegion']
        except:
            pass

        try:
            extractedValues['address'] = ppl_info['address']['streetAddress']
        except:
            pass

        try:
            extractedValues['birthday'] = ppl_info['birthDate']
        except:
            pass

        try:
            extractedValues['phoneNum'] = ppl_info['telephone'].replace(" ", '')
        except:
            pass
        print(extractedValues)
        return extractedValues


def spokeo(name, state, city):
    result_list = []
    links_list = []

    spokeo_url = 'https://www.spokeo.com'
    url = 'https://www.spokeo.com/{0}/{1}/{2}'.format(name.replace(" ", "-"), state, city)
    header = initial_hearder()

    try:
        response = requests.get(url, headers=header, timeout=(10, 10))
        soup = BeautifulSoup(response.text, 'lxml')
        links_list += spokeo_fetchLinks(soup, spokeo_url)

        page_section = soup.findAll('a', {'class': "pagination_item element css-1psizrf ezqomm60"})[-1]
        last_page = int(page_section.text)
        if last_page > 1:
            for i in range(1, last_page + 1):
                following_link = url + '/' + str(last_page)
                following_response = requests.get(following_link, headers=header, timeout=(10, 10))
                folloing_soup = BeautifulSoup(following_response.text, 'lxml')
                links_list += spokeo_fetchLinks(folloing_soup, spokeo_url)
    except Exception as err:
        print(str(err))
        pass

    try:
        for link in links_list:
            header = initial_hearder()
            response = requests.get(link, headers=header, timeout=(10, 10))
            soup = BeautifulSoup(response.text, 'lxml')
            result_list += save_info_spokeo(soup)

        return result_list
    except:
        pass


def save_info_spokeo(soup):
    extractedValues = {'name': 'None', 'platform': 'Spokeo', 'Age': 'None', 'birthday': 'None'
        , 'city': 'None', 'gender': 'none', 'state': 'None', 'address': 'None', 'phoneNum': 'None', 'Relatives': 'None',
                       'email': 'None', 'jobDetails': 'None', 'Alias': 'None', 'politicalViews': 'none', 'Ethnicity': 'None'
        , 'religiousViews': 'None', 'relationshipStatus': 'none', 'AnnualIncome': 'None', 'NetWorth': 'none', 'Summary': 'None', 'hometown': 'none', 'interests': 'none'}
    try:
        name_age = soup.find('h1', {'class': "css-l57yqd e10s3cm55"}).text
        if ", Age " in name_age:
            name_ageList = name_age.split("g, Age ")
            extractedValues['name'] = name_ageList[0]
            extractedValues['Age'] = name_ageList[1]
        else:
            extractedValues['Name'] = name_age
    except Exception as err:
        print(str(err))
        return

    try:
        phone_email = soup.findAll("p", {'class': "css-7azg4n e1rmlu1j2"})
        emails = []
        phones = []
        for i in phone_email:
            text = i.text
            if "@" in text:
                text = text[0] + "****" + text[5:]
                emails.append(text)
            else:
                text = text.replace(" ", "")
                text = text[:-4] + "***"
                phones.append(text)
        extractedValues['email'] = emails
        extractedValues['phoneNum'] = phones
    except:
        pass

    try:
        address_cards = soup.find("div", {'id': "location-card"}).findAll("div", {'class': "mini-card"})
        addresses = set()
        cities = set()
        states = set()

        for card in address_cards:
            text = card.findAll("a")[1].text
            text = "**** " + text[5:]
            addresses.add(text)

            city_state = card.find('span', {'class': "bold bluePurple"}).text.split(', ')
            city = city_state[0]
            state = city_state[1]
            cities.add(city)
            states.add(state)

        extractedValues['address'] = list(addresses)
        extractedValues['city'] = list(cities)
        extractedValues['state'] = list(states)
    except:
        pass

    try:
        members = []
        family_members = soup.find('div', {'id': "family-card"}).findAll(
            'div', {"class": "mini-card"})
        for member in family_members:
            text = member.findAll('a')[0].text
            if text != "":
                members.append(text)
            extractedValues['Relatives'] = members
    except:
        pass
    print(extractedValues)
    return extractedValues


def spokeo_fetchLinks(soup, url):
    try:
        result_links = []
        column_list = soup.find('div', {'class': 'single-column-list'})
        records = column_list.findAll('a', href=True)
        for record in records:
            result_links.append(url + str(record['href']))
        return  result_links
    except:
        return


def peekyou(name, state, city):
    result_list = []
    url_temp = "https://www.peekyou.com/{}/".format(name.replace(" ", "_"))
    url = "https://www.peekyou.com/usa/{0}/{1}/{2}".format(state.replace(" ", "_"), city.replace(" ", "_"), name.replace(" ", "_"))
    header = initial_hearder()
    soups = []
    try:
        response = requests.get(url, headers=header, timeout=(10, 10))
        soup = BeautifulSoup(response.text, 'lxml')
        soups += peekyou_fetch(url_temp, soup, header)
        try:
            page_set = set()
            for i in soup.find('div', {'class': "nextPage"}).findAll('a', href=True):
                page_num = re.findall('\d+', i['href'])[0]
                page_set.add(page_num)
            for num in page_set:
                following_page = url + '/page=' + num
                try:
                    following_response = requests.get(following_page, headers=header, timeout=(10, 10))
                    following_soup = BeautifulSoup(following_response.text, 'lxml')
                    soups += peekyou_fetch(url_temp, following_soup, header)
                except Exception as err:
                    print(str(err))
                    pass
            for page in soups:
                result_list.append(save_info_peekyou(page))
            return result_list
        except Exception as err:
            print("error here : "+str(err))

    except Exception as err:
        print(str(err))


def peekyou_fetch(url, soup, header):
    scripts = soup.findAll('script')
    pages = []
    try:
        for script in scripts:
            if "<script>result_set" in str(script):
                ids = str(script).replace('<script>result_set = "', "").replace('"; </script>', '')
                for id in ids.split(","):
                    ppl_url = url + '/' + str(id)
                    try:
                        response = requests.get(ppl_url, headers=header, timeout=(10, 10))
                        soup = BeautifulSoup(response.text, 'lxml')
                        pages.append(soup)
                    except Exception as err:
                        print(str(err))
                        pass
        return pages
    except:
        pass


def save_info_peekyou(soup):
    extractedValues = {'name': 'None', 'platform': 'PeekYou', 'Age': 'None', 'birthday': 'None'
        , 'city': 'None', 'gender': 'none', 'state': 'None', 'address': 'None', 'phoneNum': 'None', 'Relatives': 'None',
                       'email': 'None', 'JobTitle': 'None', 'Alias': 'None', 'politicalViews': 'none', 'Ethnicity': 'None'
        , 'religiousViews': 'None', 'relationshipStatus': 'none', 'AnnualIncome': 'None', 'NetWorth': 'none', 'Summary': 'None', 'hometown': 'none', 'interests': 'none'}

    try:
        profile = soup.find('div', {'class': "profileColumn vcard_new"})
        try:
            extractedValues['name'] = profile.find('div', {'id': "nameProfCont"}).find('a').text
        except:
            return

        try:
            genderAgeSection = profile.find('div', {'id': "genderAgeSection"}).text.replace("\n", "").strip(" ")
            if "Male" in genderAgeSection:
                extractedValues['gender'] = "Male"
            elif "Female" in genderAgeSection:
                extractedValues['gender'] = "Female"

            age = str(re.sub("\D", "", genderAgeSection))
            extractedValues['Age'] = age
        except:
            pass

        try:
            cities = profile.findAll('a', {'class': "locality"})
            for c in cities:
                text = c.text
                temp = text.split(", ")
                if extractedValues['city'] == 'None':
                    extractedValues['city'] = temp[0]
                else:
                    extractedValues['city'] += temp[0]
                if extractedValues['state'] == 'None':
                    extractedValues['state'] = temp[1]
                else:
                    extractedValues['state'] += temp[1]
        except:
            pass

        try:
            extractedValues['Summary'] = profile.find("span", {"id": "prof_bio_s"}).text
        except:
            pass
        print(extractedValues)
        return extractedValues
    except:
        return


def mylife(name, state):
    result_list = []
    url = 'https://www.mylife.com/{}/'.format(name.replace(" ", "-"))
    header = initial_hearder()
    try:
        response = requests.get(url, headers=header, timeout=(10, 10))
        soup = BeautifulSoup(response.text, 'lxml', from_encoding='utf8')
        result_list += save_info_mylife(soup, state)
        try:
            PageSection = soup.find('div', {'class': "pagination"})
            pages = int(PageSection.find_all('a', href=True)[-2].text)
        except Exception as err:
            print(str(err))
            pages = 1
            pass
        if pages >= 2:
            for page in range(2, pages + 1):
                url = 'https://www.mylife.com/{0}/{1}'.format(name.replace(" ", "-"), str(page))
                try:
                    response = requests.get(url, headers=header, timeout=(10, 10))
                    soup = BeautifulSoup(response.text, 'lxml', from_encoding='utf8')
                    result_list += save_info_mylife(soup, state)
                except Exception as err:
                    print(str(err))
                    pass
        return result_list
    except Exception as err:
        print(str(err), "2")
        pass


def save_info_mylife(soup, state):
    try:
        ppl_list = soup.findAll('div', {'class': 'basic-information'})

        url_list = []
        for ppl in ppl_list:
            url_section = ppl.find('h2', {'itemprop': 'name'})
            url = url_section.find('a', href=True)['href']
            url_list.append(url)

        result_list = []
        header = initial_hearder()
        for link in url_list:
            extractedValues = {'name': 'None', 'platform': 'Mylife', 'age': 'None', 'birthday': 'None', 
                                'currentTown': 'None', 'gender': 'none', 'state': 'None', 'address': 'None', 'phoneNum': 'None',
                               'Relatives': 'None', 'email': 'None', 'jobDetails': 'None', 'Alias': 'None', 'politicalViews': 'none',
                               'Ethnicity': 'None', 'religiousViews': 'None', 'relationshipStatus': 'none', 'AnnualIncome': 'None', 'NetWorth': 'none', 
                               'Summary': 'None', 'hometown': 'none', 'interests': 'none'}

            response = requests.get(link, headers=header, timeout=(30, 30))
            try:
                soup = BeautifulSoup(response.text, 'html.parser')
                body = soup.find('div', {'class': 'body-wrapper'})
                ppl_info = json.loads("".join(body.find("script", {"type": "application/ld+json"}).contents))
                try:
                    extractedValues['name'] = ppl_info['name']
                except:
                    pass

                try:
                    extractedValues['Alias'] = ppl_info['alternateName']
                except:
                    pass
                try:
                    about = ppl_info['about']
                    address = about['address']
                except:
                    pass
                try:
                    extractedValues['currentTown'] = address['addressLocality']
                except:
                    pass

                try:
                    extractedValues['state'] = address['addressRegion']
                except:
                    pass

                try:
                    extractedValues['address'] = address['streetAddress']
                except:
                    pass
                try:
                    relatedTo = about['relatedTo']
                    ppl_related = []
                    for related in relatedTo:
                        ppl_related.append(related['name'])
                    try:
                        extractedValues['Relatives'] = ppl_related
                    except:
                        pass
                except:
                    pass

                try:
                    extractedValues['email'] = about['email']
                except:
                    pass

                try:
                    extractedValues['birthday'] = about['birthDate']
                except:
                    pass

                try:
                    extractedValues['NetWorth'] = about['netWorth']
                except:
                    pass

                try:
                    extractedValues['gender'] = about['gender']
                except:
                    pass
                try:
                    extractedValues['phoneNum'] = about['telephone']
                except:
                    pass
                if extractedValues['state'].lower() == state.lower():
                    print(extractedValues)
                    result_list.append(extractedValues)
            except:
                pass
        return result_list
    except Exception as err:
        print(str(err))


def to_do(name, zip):
    return distribution(name, zip)


# (post / get) action,
class TodoList(Resource):
    def post(self):
        """
        add a new user: curl http://127.0.0.1:5000/users -X POST -d "name=Justin&zip=85713" -H "Authorization: token justin"
        """
        args = parser_put.parse_args()
        # create a new user
        name = args['name']
        zip = args['zip']
        info = {"info": to_do(name, zip)}
        return info, 201


api.add_resource(TodoList, "/users")

if __name__ == "__main__":
    app.run(debug=True)