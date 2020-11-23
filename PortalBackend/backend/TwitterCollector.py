import sys
import os

from bs4 import BeautifulSoup

from time import sleep, time
from datetime import datetime as date

import twitter
import json


class TwitterCollector(object):

    def __init__(self, userDepth=3, maxTweets=6):
        self.userDepth = userDepth
        self.maxTweets = maxTweets

        self.api = twitter.Api(consumer_key="VgLiVJeN9rnnTV59yPfGKdPNt",
                               consumer_secret="rBJcpBzenVgSr8tVnN13rXWAohonAt94tkLiIYELwRvt0OoRZM",
                               access_token_key="1239411940213977089-7bSnkAgpcEUmpHmfskxkx6SB8RoBlz",
                               access_token_secret="KP19iyNealQ2dsLxudSEf20stbz8LN5c9UWmfGktrI1Wu")


    def getUsernames(self, input):
        output = []
        print("[" + str(date.now()) + "]", "Converting input into username. Input:", input)

        results = self.api.GetUsersSearch(term=input, count=self.userDepth)

        for i in results:
            output.append(i.AsDict()["screen_name"])

        return list(set(output))


    def getProfiles(self, input):
        print("[" + str(date.now()) + "]", "Converting input into profiles. Input:", input)

        return [x.AsDict() for x in self.api.GetUsersSearch(term= input, count= self.userDepth)]


    def crawl(self, inputDict):
        startTime = time()

        input = inputDict["fullname"]

        print("[" + str(date.now()) + "]", "Crawling Name:", input)

        profiles = self.getProfiles(input)

        sleep(20)
        if len(profiles) == 0:
            print("[" + str(date.now()) + "]", "No profiles found for", input)
            print("Total Time Elapsed(seconds):", str(time() - startTime))
            return None
        else:
            print("[" + str(date.now()) + "]", "Total profiles found for", input, ":", len(profiles), "Parsing Profiles.")
            print("Total Time Elapsed(seconds):", str(time() - startTime))
            return self.parseProfiles(profiles)


    def parseProfiles(self, data):
        output = []

        for profile in data:
            parsedValues = {}

            parsedValues["username"] = profile["screen_name"].replace("\n", " ")
            parsedValues["profilename"] = profile["name"].replace("\n", " ")
            parsedValues["id"] = profile["id"]

            try:
                parsedValues["description"] = profile['description'].replace("\n", " ")
            except:
                parsedValues["description"] = "-"
            try:
                parsedValues["following_count"] = profile['friends_count']
            except:
                parsedValues["following_count"] = "-"
            try:
                parsedValues["followers_count"] = profile['followers_count']
            except:
                parsedValues["followers_count"] = "-"
            try:
                parsedValues["profile_picture"] = profile['profile_image_url'].replace("\n", " ")
            except:
                parsedValues["profile_picture"] = "-"

            output.append(parsedValues)

        return output

