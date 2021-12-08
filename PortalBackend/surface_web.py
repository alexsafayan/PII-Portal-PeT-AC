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
parser_put.add_argument("platform", type=str, required=True, help="assign surface web platform")
ua = UserAgent()
# proxyAPI = "https://api.scrapestack.com/scrape?access_key=8e3fe586244f275ff3b1b6da59b97bc9&url="

us_states = {
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


def initial_hearder():
    header = ua.random
    headers = {'User-Agent': header}
    return headers


def distribution(name, zip, platform):
    result_list = []
    zip_info = zipcodes.matching(str(zip))[0]
    state = zip_info["state"]
    state_name = ''
    for state_full, state_short in us_states.items():
        if state_short == state:
            state_name = state_full
    if "mylife" in platform:
        try:
            result_list = mylife(name, state)
            return result_list
        except:
            pass

    if "peekyou" in platform:
        try:
            result_list = peekyou(name, state)
            return result_list
        except:
            pass

    if "spokeo" in platform:
        try:
            result_list = spokeo(name, state_name)
            return result_list
        except:
            pass

    if "zabasearch" in platform:
        try:
            result_list = zabasearch(name, state_name)
            return result_list
        except:
            pass

    if "anywho" in platform:
        try:
            result_list = anywho(name, state_name)
            return result_list
        except:
            pass
    return result_list


def anywho(name, state):
    result_list = []
    header = initial_hearder()
    try:
        for i in range(1, 2000):
            url = 'https://www.anywho.com/people/{0}/{1}/?page={2}'.format(name.replace(" ", "+"), state, i)
            try:
                response = requests.get(url, headers=header, timeout=(10, 10))
                soup = BeautifulSoup(response.text, 'lxml', from_encoding='utf8')
                title = soup.find('title')
                if "None" in str(title):
                    break
                result_list.append(save_info_anywho(soup))
            except Exception as err:
                header = initial_hearder()
                print(str(err))
        return result_list
    except Exception as err:
        print(str(err))


def save_info_anywho(soup):
    print('searching anywho')
    result_list = []
    try:
        records_soup = soup.find_all("div", {"class": 'person result-item'})
        for record in records_soup:

            extractedValues = {'name': 'None', 'platform': 'Anywho', 'birthday': 'None', 'currentTown': 'None', 'gender': 'none',
                       'state': 'None', 'address': 'None', 'phoneNum': 'None', 'Relatives': 'None',
                       'email': 'None', 'jobDetails': 'None', 'Alias': 'None', 'politicalViews': 'none',
                       'Ethnicity': 'None', 'religiousViews': 'None', 'relationshipStatus': 'none', 'AnnualIncome': 'None',
                       'NetWorth': 'none', 'hometown': 'none', 'interests': 'none', 'zip': 'None'}
            try:
                extractedValues["Name"] = record.find('a').text.strip()
            except:
                pass

            try:
                plain_text = record.text.lower()
                if "age" in plain_text:
                    extractedValues["birthday"] = plain_text.split("age ")[1].split("\t")[0]
            except:
                pass

            try:
                for p in soup.find_all("div", {"class": 'person result-item'})[4].find_all('p'):
                    if ", " in p.text:
                        extractedValues["address"] = p.text
                    if "(" in p.text and "-" in p.text:
                        extractedValues["phoneNum"] = p.text
            except:
                pass
            result_list.append(extractedValues)
        # print('returning from anywho: {}'.format(result_list))
        if len(result_list) > 5:
            return result_list[0:5]
        return result_list
    except:
        pass


def zabasearch(name, state):
    header = initial_hearder()
    result_list = []
    url = 'https://www.zabasearch.com/people/{0}/{1}/'.format(name.replace(" ", "+"), state)
    try:
        response = requests.get(url, headers=header, timeout=(10, 10))
        soup = BeautifulSoup(response.text, 'lxml', from_encoding='utf8')
        result_list += save_info_zabasearch(soup)
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
            return result_list
        except Exception as err:
            print(str(err))

    except Exception as err:
        print(str(err))
        return


def save_info_zabasearch(soup):
    print('searching zabasearch')
    result_list = []
    records_html = soup.find_all("section", {"class": "person"})
    for record in records_html:
        extractedValues = {'name': None, 'platform': 'Zabasearch', 'birthday': 'None', 'currentTown': 'None', 'gender': 'none',
                       'state': 'None', 'address': 'None', 'phoneNum': 'None', 'Relatives': 'None',
                       'email': 'None', 'jobDetails': 'None', 'Alias': 'None', 'politicalViews': 'none',
                       'Ethnicity': 'None', 'religiousViews': 'None', 'relationshipStatus': 'none', 'AnnualIncome': 'None',
                       'NetWorth': 'none', 'hometown': 'none', 'interests': 'none', 'zip': 'None'}
        try:
            extractedValues["name"] = record.find("a", {"class": "name-link"}).text.strip()
        except:
            pass

        try:
            for p in record.find_all('p'):
                try:
                    if "age" in p.text.lower():
                        extractedValues["birthday"] = p.text.strip().lower().split("Age: ")[1]
                    if "," in p.text and "-" in p.text:
                        extractedValues["address"] = p.text.strip()
                    if "(" in p.text and "-" in p.text:
                        extractedValues["phoneNum"] = p.text.strip()
                    result_list.append(extractedValues)
                except:
                    continue
        except:
            pass
    # print('returning from zabasearch: {}'.format(result_list))
    if len(result_list) > 5:
        return result_list[0:5]
    return result_list


def spokeo(name, state):
    result_list = []
    url = 'https://www.spokeo.com/{0}/{1}'.format(name.replace(" ", "-"), state.replace(" ", "-"))
    header = initial_hearder()
    soups = []
    try:
        response = requests.get(url, headers=header, timeout=(10, 10))
        soup = BeautifulSoup(response.text, 'lxml')
        soups.append(soup)

        page_section = soup.findAll('a', {'class': "pagination_item element css-1psizrf ezqomm60"})[-1]
        last_page = int(page_section.text)
        if last_page > 1:
            for i in range(1, last_page + 1):
                following_link = url + '/' + str(last_page)
                following_response = requests.get(following_link, headers=header, timeout=(10, 10))
                folloing_soup = BeautifulSoup(following_response.text, 'lxml')
                soups.append(folloing_soup)
    except Exception as err:
        print(str(err))
        pass
    try:
        for soup in soups:
            result_list.append(save_info_spokeo(soup))
        return result_list
    except:
        pass


def save_info_spokeo(soup):
    print('searching spokeo')
    result_list = []
    results = soup.find_all("div", {"aria-label": "Search Results"})
    for result in results:
        extractedValues = {'name': None, 'platform': 'Spokeo', 'birthday': 'None', 'currentTown': 'None', 'gender': 'none',
                       'state': 'None', 'address': 'None', 'phoneNum': 'None', 'Relatives': 'None',
                       'email': 'None', 'jobDetails': 'None', 'Alias': 'None', 'politicalViews': 'none',
                       'Ethnicity': 'None', 'religiousViews': 'None', 'relationshipStatus': 'none', 'AnnualIncome': 'None',
                       'NetWorth': 'none', 'hometown': 'none', 'interests': 'none', 'zip': 'None'}

        name_age = result.find("a", {"class": 'single-column-list-item'}).find_all('div')[1].text.strip()
        try:
            if ", " in name_age:
                extractedValues["name"] = name_age.split(", ")[0].strip()
                extractedValues["birthday"] = name_age.split(", ")[1].strip()
            else:
                extractedValues["Name"] = name_age
        except:
            pass

        for record in result.find("a", {"class": 'single-column-list-item'}).find_all('div')[2:]:
            if "Resides in " in record.text:
                extractedValues["address"] = record.text.strip()
            if "address" in record.text:
                extractedValues["Relatives"] = record.text.strip()
        result_list.append(extractedValues)
    # print('returning from spokeo: {}'.format(result_list))
    if len(result_list) > 5:
        return result_list[0:5]
    return result_list


def peekyou(name, state):
    result_list = []
    url_temp = "https://www.peekyou.com/{}/".format(name.replace(" ", "_"))
    url = "https://www.peekyou.com/usa/{1}/{0}".format(name.replace(" ", "_"), state.replace(" ", "_"))
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
            if len(result_list) > 5:
                return result_list[0:5]
            return result_list
        except:
            pass
    except Exception as err:
        print(str(err))
        pass


def peekyou_fetch(url, soup, header):
    print('searching peekyou')
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
        # print('returning from peekyou: {}'.format(pages))
        if len(pages) > 5:
            return pages[0:5]
        return pages
    except:
        pass


def save_info_peekyou(soup):
    extractedValues = {'name': None, 'platform': 'Peekyou', 'birthday': 'None', 'currentTown': 'None', 'gender': 'none',
                       'state': 'None', 'address': 'None', 'phoneNum': 'None', 'Relatives': 'None',
                       'email': 'None', 'jobDetails': 'None', 'Alias': 'None', 'politicalViews': 'none',
                       'Ethnicity': 'None', 'religiousViews': 'None', 'relationshipStatus': 'none', 'AnnualIncome': 'None',
                       'NetWorth': 'none', 'hometown': 'none', 'interests': 'none', 'zip': 'None'}
    try:
        extractedValues["name"] = soup.find("div", {"class": "profileName"}).find("div",
                                                                                  {"id": "nameProfCont"}).text.strip(
            '\n').strip('0').strip()
    except:
        pass
    try:
        extractedValues["gender"] = \
        soup.find("div", {"id": "genderAgeSection"}).text.strip('\n').strip('0').strip().split(",")[0].strip()
    except:
        pass
    try:
        extractedValues["birthday"] = \
        soup.find("div", {"id": "genderAgeSection"}).text.strip('\n').strip('0').strip().split(",")[1].strip().split(
            " ")[0].strip()
    except:
        pass
    # try:
    #     extractedValues["description"] = soup.find("span", {"id": "prof_bio_s"}).text.strip()
    # except:
    #     pass
    try:
        for tag in soup.find_all("ul", {"id": "profile_tags"}):
            for li_class in tag.find("li"):
                if "school" in li_class['href']:
                    extractedValues["School"] = li_class.text
                if "work" in li_class['href']:
                    extractedValues["Job"] = li_class.text
    except:
        pass

    if extractedValues["name"] is not None:
        return extractedValues
    return


def mylife(name, state):
    print('searching mylife')
    for i in range(10):
        result_list = []
        url = 'https://www.mylife.com/{}/'.format(name.replace(" ", "-"))
        header = initial_hearder()
        try:
            response = requests.get(url, headers=header, timeout=(3, 3))
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
            # print('returning from mylife: {}'.format(result_list))
            if len(result_list) > 5:
                return result_list[0:5]
            return result_list
        except:
            continue


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
            extractedValues = {'name': None, 'platform': 'Mylife', 'birthday': 'None', 'currentTown': 'None', 'gender': 'none',
                       'state': 'None', 'address': 'None', 'phoneNum': 'None', 'Relatives': 'None',
                       'email': 'None', 'jobDetails': 'None', 'Alias': 'None', 'politicalViews': 'none',
                       'Ethnicity': 'None', 'religiousViews': 'None', 'relationshipStatus': 'none', 'AnnualIncome': 'None',
                       'NetWorth': 'none', 'hometown': 'none', 'interests': 'none', 'zip': 'None'}
            for i in range(10):
                try:
                    response = requests.get(link, headers=header, timeout=(3, 3))
                    new_soup = BeautifulSoup(response.text, "html.parser")
                    mylife_record = json.loads(
                        "".join(new_soup.find("script", {"type": "application/ld+json"}).contents))
                    try:
                        extractedValues["name"] = mylife_record["name"]
                    except:
                        pass
                    # try:
                    #     extractedValues["description"] = mylife_record["description"]
                    # except:
                    #     pass
                    try:
                        extractedValues["Alias"] = mylife_record["alternateName"]
                    except:
                        pass
                    try:
                        if len(mylife_record["relatedTo"]) > 0:
                            extractedValues["Relatives"] = []
                            for person in mylife_record["relatedTo"]:
                                person_name = person["name"]
                                extractedValues["Relatives"].append(person_name)
                    except:
                        pass
                    try:
                        extractedValues["email"] = mylife_record["email"]
                    except:
                        pass
                    try:
                        extractedValues["birthday"] = mylife_record["birthDate"]
                    except:
                        pass
                    try:
                        extractedValues["NetWorth"] = mylife_record["netWorth"]
                    except:
                        pass
                    try:
                        extractedValues["gender"] = mylife_record["gender"]
                    except:
                        pass
                    try:
                        extractedValues["phoneNum"] = mylife_record["telephone"]
                    except:
                        pass
                    if extractedValues["name"] is not None:
                        result_list.append(extractedValues)
                    break
                except:
                    continue
        return result_list
    except Exception as err:
        print(str(err))


def to_do(name, zip, platform):
    return distribution(name, zip, platform)


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
        platform = args['platform']
        info = {"info": to_do(name, zip, platform)}
        return info, 201


api.add_resource(TodoList, "/users")

if __name__ == "__main__":
    app.run(debug=True)