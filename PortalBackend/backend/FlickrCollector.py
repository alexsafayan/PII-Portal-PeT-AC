import sys
import os
sys.path.append("/".join(os.path.realpath(__file__).replace("\\", "/").split("/")[:-2]))

from bs4 import BeautifulSoup

from time import sleep, time
import random
import csv
from datetime import datetime as date

#Web Scrapping Libraries
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from bs4 import BeautifulSoup


class FlickrCollector(object):

    def __init__(self, userDepth= 3, executablePath= ""):
        self.userDepth = userDepth
        self.browserSetup(executable_path= executablePath)


    def getPages(self, input):
        print("[" + str(date.now()) + "]", "Retrieving Page Links")

        searchURL = "https://www.flickr.com/search/people/?username=" + input

        self.browser.get(searchURL)
        soup = BeautifulSoup(self.browser.page_source, 'html.parser')

        try:
            results = soup.find("div", {"id" : "content"})
            results = results.find("div", {"class" : "all-people"})
            results = results.find("div")

            output = []
            for result in results.findAll("div", {"class" : "result-card linked reboot-restyle"})[:self.userDepth]:
                link = result.find("a", {"class" : "click-anywhere"})['href']
                output.append("https://www.flickr.com/" + link)

        except Exception as e:
            output = None
            pass

        return output


    def restartTor(self):
        os.system('taskkill /IM firefox.exe')
        os.system('taskkill /IM tor.exe')
        sleep(3)
        os.popen('''"C:/Users/ajula/Desktop/Tor Browser/Browser/firefox.exe"''')
        sleep(5)
        self.browserSetup()


    def browserSetup(self, executable_path= None):
        print("[" + str(date.now()) + "]", "Initializing Browser")

        fp = webdriver.FirefoxProfile()
        fp.set_preference("dom.webnotifications.enabled", False);

        PROXY_HOST = "127.0.0.1"
        PROXY_PORT = 9150
        fp.set_preference("network.proxy.type", 1)
        fp.set_preference("network.proxy.socks", PROXY_HOST)
        fp.set_preference("network.proxy.socks_port", PROXY_PORT)
        fp.set_preference("network.proxy.socks_remote_dns", True)
        fp.accept_untrusted_certs = True
        firefox_capabilities = DesiredCapabilities.FIREFOX
        firefox_capabilities['marionette'] = True
        # executable_path would add geckodriver.exe to your environment so that you could run it
        # Linux Executable path: /home/hcfu_kaksi/geckodriver
        # Windows Executable Path: E:/AI LAB DOC/geckodriver.exe

        if executable_path is not None:
            self.executable_path = executable_path

        self.browser = webdriver.Firefox(firefox_profile=fp, capabilities=firefox_capabilities,
                                         executable_path=self.executable_path)

        print("[" + str(date.now()) + "]", "Tor Initialized, Browser Setup")


    def waitForPageLoad(self, timeout = 10):
        basewait = 5
        sleep(basewait)
        for i in range(timeout - basewait):
            page_state = self.browser.execute_script('return document.readyState;')
            if page_state == 'complete':
                break
            else:
                sleep(1)


    def crawl(self, inputDict):
        startTime = time()

        self.restartTor()

        input = inputDict['fullname']

        pageLinks = []
        pages = self.getPages(input)

        if pages is None:
            pass
        else:
            for page in pages:
                pageLinks.append(page)
                self.waitForPageLoad()
        sleep(5)

        if len(pageLinks) == 0:
            print("[" + str(date.now()) + "]", "No profiles found for", input)
            print("Total Time Elapsed(seconds):", str(time() - startTime))
            return None

        else:
            print("[" + str(date.now()) + "]", "Collection for", input, "complete. Parsing Profiles")
            print("Total Time Elapsed(seconds):", str(time() - startTime))
            output = []
            for link in pageLinks:
                result = self.parsePage(link)
                if result is not None:
                    output.append(result)

            return output


    def parsePage(self, link):
        output = {}

        self.browser.get(link)
        soup = BeautifulSoup(self.browser.page_source, "html")

        try:
            banner = soup.find("div", {"class": "subnav-middle"})
            names = banner.find("div", {"class": "person"})
        except:
            return None

        try:
            output["username"] = names.find("h2").text.strip()
        except:
            output["username"] = "-"

        try:
            output["profile_name"] = names.find("h1").text.strip()
        except:
            output["profile_name"] = "-"

        try:
            output["profile_picture"] = banner.find("img", {"class": "sn-avatar-mask"}).get("src")
        except:
            output["profile_picture"] = "-"


        try:
            output["posts"] = []
            postGrid = soup.find("div", {"id": "photo-display-container"})
            posts = postGrid.findAll("div", {"class": "photo-display-item"})
            for post in posts[:10]:
                output["posts"].append(post.find("img").get("src"))
        except:
            output["posts"] = "-"


        return output


if __name__ == "__main__":
    fc = FlickrCollector(executablePath= r"C:\Users\ajula\Desktop\AI Lab On-Site\geckodriver.exe")
    result = fc.crawl(inputDict={"fullname": "KENNETH HALL",
                         "zip": "33610"})
    print(type(result), result)