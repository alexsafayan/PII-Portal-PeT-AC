import scrapy
from bs4 import BeautifulSoup


class MydomainSpider(scrapy.Spider):
    name = 'mydomain'

    # def __init__(self, **kwargs):
    #     super(MydomainSpider, self).__init__(**kwargs)
    #     self.base_url = 'https://thatsthem.com/email'

    # def start_requests(self):
    #     # list_of_emails = open(r'/Users/ajayulagappa/pii/aptoide_test.txt', 'r')

    #     with open('./email_list.txt', 'r') as file:
    #         for emails in file:
    #             clean_emaill = emails.strip()
    #     print(clean_emaill)
    #     base_url = self.base_url

    #     yield scrapy.Request(url=base_url + "/" + clean_email, callback=self.parse)
    #     # time.sleep(10)

    #     # for i in range(0, 30):
    #     #    yield scrapy.Request(url="http://icanhazip.com/", callback=self.parse)

    def parse(self, response):
        soup = BeautifulSoup(str(response.body), "html.parser")
        data_structure = {}
        email_id = soup.title.string.split('|')[0].strip()

        header = soup.find(name='span', attrs={'class': 'ThatsThem-results-preheader'})

        if 'We did not find any results' in header:
            data_structure[email_id] = 'N/A'
        else:
            data_structure[email_id] = {}

            result_list = soup.find_all(name='div', attrs={'class': 'ThatsThem-record'})

            for each_result in result_list:
                overview_records = each_result.find(name='div', attrs={'class': 'ThatsThem-record-overview col-md-5'})
                meta_records = each_result.find(name='div', attrs={'class': 'ThatsThem-record-meta col-md-7'})
                details_records = each_result.find(name='div', attrs={'class': 'ThatsThem-record-details row'})

                full_names = overview_records.find(name="span", attrs={'itemprop': 'name'}).string.strip()
                gender_raw_data_var = overview_records.find(name="span", attrs={'itemprop': 'gender'})
                gender = 'none'
                address_raw_data_var = overview_records.find_all(name="a")
                full_address = 'none'

                age_range_raw_data_var = meta_records.find(name='div', attrs={'class': 'ThatsThem-record-age'})
                age = 'none'

                phone_number_raw_data_var = details_records.find_all(name="span", attrs={'itemprop': 'telephone'})
                phone_number_string = 'none'

                ip_address_raw_data_var = details_records.find_all(name="a")

                data_structure[email_id][full_names] = []

                if gender_raw_data_var is not None:
                    try:
                        # print(gender_raw_data_var)
                        gender = gender_raw_data_var['data-original-title'].strip()
                    except KeyError:
                        gender = 'none'
                    data_structure[email_id][full_names].append(gender)
                else:
                    data_structure[email_id][full_names].append('N/A')

                for tags in address_raw_data_var:
                    if 'address' in tags['href']:
                        full_address = tags['href'].split('/')[-1].strip()
                        data_structure[email_id][full_names].append(full_address)
                        break
                data_structure[email_id][full_names].append('N/A')

                for spans in age_range_raw_data_var.find_all(name='span'):
                    # print(spans)
                    try:
                        if spans['class'] == ['active']:
                            age = spans.string
                            data_structure[email_id][full_names].append(spans.string)
                            break
                    except KeyError:
                        pass

                phone_number_string = ''
                for numbers in phone_number_raw_data_var:
                    # print(numbers)
                    phone_number_string = phone_number_string + numbers.string + ' | '
                    phone_number_string = phone_number_string.strip('| ')
                data_structure[email_id][full_names].append(phone_number_string.strip('| '))

                for ips in ip_address_raw_data_var:
                    if 'ip' in ips['href']:
                        full_ip_address = ips['href'].split('/')[-1].strip()
                        data_structure[email_id][full_names].append(full_ip_address)
                        break
                data_structure[email_id][full_names].append('N/A')

                yield {'name': full_names, 'birthday': age, 'currentTown': 'none', 'address': full_address,
                        'gender': gender, 'relationshipStatus': 'none', 'phoneNum': phone_number_string,
                        'zip': full_address,
                        'hometown': full_address, 'jobDetails': 'none', 'interests': 'none', 'religiousViews': 'none',
                        'politicalViews': 'none'}
