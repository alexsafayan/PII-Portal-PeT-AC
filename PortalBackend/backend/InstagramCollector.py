import json

from time import sleep, time
from datetime import datetime as date

from InstagramAPI import InstagramAPI

class InstagramCollector(object):

    def __init__(self, waittime=18, profileDepth=3, postDepth=6):
        self.profileDepth = profileDepth
        self.postDepth = postDepth

        self.api = InstagramAPI("HummusHu", "Herpaderpa1!0")
        self.api.login()
        self.waittime = waittime


    def getProfiles(self, input):
        self.api.searchUsers(input)
        output = self.api.LastJson["users"][:self.profileDepth]
        sleep(self.waittime)

        return output


    def getPosts(self, profile):
        self.api.getUserFeed(usernameId=profile["pk"])
        output = self.api.LastJson["items"][:self.postDepth]
        sleep(self.waittime)

        return output


    def saveProfiles(self, name, profiles):
        with open(self.saveDir + name + '.json', 'w') as writefile:
            json.dump(profiles, writefile)


    def crawl(self, inputDict):
        startTime = time()

        input = inputDict["fullname"]

        print("[" + str(date.now()) + "]", "Crawling", self.profileDepth, "profiles for", input)
        profiles = []

        for profile in self.getProfiles(input):
            if profile["is_private"]:
                print("[" + str(date.now()) + "]", "Private profile encountered, not collecting posts")
                pass
            else:
                print("[" + str(date.now()) + "]", "Public profile encountered, collecting", self.postDepth,
                      "most recent posts")
                profile["POSTS"] = self.getPosts(profile)

            profiles.append(profile)

        if len(profiles) == 0:
            print("[" + str(date.now()) + "]", "No profiles found for", input)
            print("Total Time Elapsed(seconds):", str(time() - startTime))
            return None

        else:
            print("[" + str(date.now()) + "]", "Collection for", input, "complete. Parsing Profiles")
            print("Total Time Elapsed(seconds):", str(time() - startTime))
            return self.parsePage(profiles)




    def parsePage(self, data):
        output = []

        for profile in data:
            parsedValues = {}

            parsedValues["username"] = profile["username"].replace("\n", " ")
            parsedValues["full_name"] = profile["full_name"].replace("\n", " ")
            parsedValues["id"] = profile["pk"]

            try:
                parsedValues["profile_picture"] = profile['profile_pic_url'].replace("\n", " ")
            except:
                parsedValues["profile_picture"] = "-"

            locations = []

            if not profile["is_private"]:
                posts = []
                for post in profile["POSTS"]:
                    postData = {"caption" : "-", "images": []}
                    try:
                        postData["caption"] = post["caption"]["text"].replace("\n", " ")
                    except:
                        pass

                    if post["media_type"] == 1:
                        try:
                            postData["images"].append(post["image_version2"]["candidates"][0]["url"])
                        except:
                            try:
                                postData["images"].append(post["image_versions2"]["candidates"][0]["url"])
                            except:
                                pass
                    elif post["media_type"] == 8:
                        try:
                            postData["images"] = [image["image_versions2"]["candidates"][0]["url"]
                                                  for image in post["carousel_media"]
                                                  if image["media_type"] == 1]
                        except:
                            pass

                    try:
                        location = post["location"]
                        locations.append({"place" : location["name"],
                                          "longitude" : location["lng"],
                                          "latitude" : location["lat"]})
                    except:
                        pass

                    if postData["caption"] == "-" and postData["images"] == []:
                        pass
                    else:
                        posts.append(postData)

                parsedValues["locations"] = locations
                parsedValues["posts"] = posts
            else:
                parsedValues["locations"] = "-"
                parsedValues["posts"] = "-"

            output.append(parsedValues)

        return output


