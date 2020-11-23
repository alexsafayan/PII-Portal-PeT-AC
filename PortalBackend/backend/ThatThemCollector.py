import os
from selenium import webdriver
from time import sleep
import datetime
import random
from random import shuffle
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from bs4 import BeautifulSoup
from torrequest import TorRequest

class ThatThemCollector(object):

    def __init__(self, executablePath):
        self.fp = webdriver.FirefoxProfile()
        PROXY_HOST = "127.0.0.1"
        PROXY_PORT =9150
        self.fp.set_preference("network.proxy.type", 1)
        self.fp.set_preference( "network.proxy.socks", PROXY_HOST)
        self.fp.set_preference( "network.proxy.socks_port", PROXY_PORT)
        self.fp.set_preference( "network.proxy.socks_remote_dns", True)
        self.fp.accept_untrusted_certs = True
        self.firefox_capabilities = DesiredCapabilities.FIREFOX
        self.firefox_capabilities['marionette'] = True
        self.executablePath = executablePath

        self.restartTor()

    def setTor(self):
        self.browser = webdriver.Firefox(firefox_profile=self.fp,executable_path= self.executablePath)

    def restartTor(self):
        os.system('taskkill /IM tor.exe /F')
        os.system('taskkill /IM firefox.exe')
        sleep(3)
        os.popen('''"C:/Users/ajula/Desktop/Tor Browser/Browser/firefox.exe"''')
        # os.popen('firefox.exe | more')
        sleep(3)

    def crawl(self, inputDict):
        self.setTor()
        self.browser.get('http://ipecho.net/plain')

        NAME = inputDict["fullname"].capitalize().replace(" ", "-")
        ZIP = str(inputDict["zip"])
        # Delete cookies in case the website track you activities.
        self.browser.delete_all_cookies()
        try:
            #----------------------Step 4: Enter personal information and search result in URL.  ---------------------------------
            #----------------------Step 5: Redirect crawler to next object. ---------------------------------
            print("Entering URL:", 'https://thatsthem.com/name/'+NAME+'/'+ZIP)
            self.browser.get('https://thatsthem.com/name/'+NAME+'/'+ZIP)
            curPageSource = BeautifulSoup(self.browser.page_source, 'html.parser')
            result = curPageSource.find('span',{'class':'ThatsThem-results-preheader'}).get_text()
            if('We did not find any results for your query:' in result):
                pass
            elif('404' in curPageSource.find('title').get_text()):
                pass
            elif('Showing' in result):
                return self.parsePage(self.browser.page_source)
        # For the exceptions, we refresh web and switch IP by restarting tor browser.
        except:
            print('Get in Exception')
            self.restartTor()
            sleep(2)
            self.setTor()
            try:
                print("Entering URL:", 'https://thatsthem.com/name/'+NAME+'/'+ZIP)
                self.browser.get('https://thatsthem.com/name/'+NAME+'/'+ZIP)
                curPageSource = BeautifulSoup(self.browser.page_source, 'html.parser')
                result = curPageSource.find('span',{'class':'ThatsThem-results-preheader'})
            except:
                result = None
                pass

            tempc = 0
            while result ==None:
                self.restartTor()
                self.setTor()
                try:
                    print("Entering URL:", 'https://thatsthem.com/name/'+NAME+'/'+ZIP)
                    self.browser.get('https://thatsthem.com/name/'+NAME+'/'+ZIP)
                    curPageSource = BeautifulSoup(self.browser.page_source, 'html.parser')
                    result = curPageSource.find('span',{'class':'ThatsThem-well ThatsThem-people-record row'})
                    break
                except:
                    tempc+=1
                    if(tempc >10):
                        break
            if(result is None or 'We did not find any results for your query:' in result.get_text()):
                pass
            elif('Showing' in result.get_text()):
                return self.parsePage(self.browser.page_source)

        print(datetime.datetime.now())
        return None


    def parsePage(self, htmlContent):
        output = []
        # initialize BeautifulSoup Object
        soup = BeautifulSoup(htmlContent, 'html.parser', from_encoding='utf8')
        try:
            section = soup.find('div', {'class': 'ThatsThem-records'}).findAll('div', {'class': 'ThatsThem-record'})
        except:
            return output

        for eachitem in section:
            extractedValues = {'email': '-', 'full_name': '-', 'street': '-', 'city': '-', 'state': '-', 'zip': '-',
                               'phone': '-', 'ip': '-', 'age': '-'}
            try:
                extractedValues['email'] = eachitem.find('span', {'itemprop': 'email'}).get_text().strip()
            except:
                pass
            try:
                extractedValues['full_name'] = eachitem.find('h2').get_text().strip()
            except:
                pass
            try:
                extractedValues['street'] = eachitem.find('span', {'itemprop': 'streetAddress'}).get_text().strip()
            except:
                pass
            try:
                extractedValues['city'] = eachitem.find('span', {'itemprop': 'addressLocality'}).get_text().strip()
            except:
                pass
            try:
                extractedValues['state'] = eachitem.find('span', {'itemprop': 'addressRegion'}).get_text().strip()
            except:
                pass
            try:
                extractedValues['zip'] = eachitem.find('span', {'itemprop': 'postalCode'}).get_text().strip()
            except:
                pass
            try:
                extractedValues['phone'] = eachitem.find('span', {'itemprop': 'telephone'}).get_text().strip()
            except:
                pass
            try:
                extractedValues['ip'] = eachitem.find('dl').findAll('dd')[4].get_text().strip()
            except:
                pass
            try:
                extractedValues['age'] = eachitem.find('div', {'class': 'ThatsThem-record-age'}).find('span', {
                    'class': 'active'}).get_text().strip()
            except:
                extractedValues['age'] = '-'

            output.append(extractedValues)
        return output

if __name__ == "__main__":
    ttc = ThatThemCollector(executablePath= r"C:\Users\ajula\Desktop\AI Lab On-Site\geckodriver.exe")
    print("created ttc")
    result = ttc.crawl(inputDict={"fullname": "KENNETH HALL",
                         "zip": "33610"})
    print(type(result), result)