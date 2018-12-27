import json
import twitter
import pymongo
from pymongo import MongoClient
from bson import json_util

client = MongoClient('mongodb://manpreet:manpreet1@ds257808.mlab.com:57808/heroku_bb9z6l3j')
CONSUMER_KEY = 'd0Mh9g4lxTEEEXd3NV0y3Tvo8'
CONSUMER_SECRET = 'RbRkDg1EMdU45dX9bMCgg2ecsAG2hcEjIUpc388YhaWARaEzsW'
#ACCESS_TOKEN = '1478790870-dW36ujNkJiQpHVJatXsDwFFNDHoKPe941CI1PYK'
#ACCESS_TOKEN_SECRET = 'skcLxRmDEbGRbiZ3vpRofLpBg745WaqqOCMZsS1wnOvxn'

# Get the sampleDB database
db = client.heroku_bb9z6l3j

# Previous Users list to not populate mutualconnections again.
previousUsers = ["Melanie", "JavierGrullon6", "Sabiha_5273", "eliassalazar262", "krishnakaranam3", "pyt_xxh1", "NicsNation", "fortunejones6", "ThetruthYells", "BlaPatrol", "AriannaSeykia", "Manpree17078273"]

def Remove(duplicate):
    final_list = []
    for user in duplicate:
        if any(x.screen_name == user.screen_name for x in final_list):
            final_list.append(user)

    return final_list

# gives the top 10 followers with highest followers of the screenName
def topFollowers(screenName,ACCESS_TOKEN,ACCESS_TOKEN_SECRET):
    # get the api for twitter
    api = twitter.Api(consumer_key=CONSUMER_KEY,
                      consumer_secret=CONSUMER_SECRET,
                      access_token_key=ACCESS_TOKEN,
                      access_token_secret=ACCESS_TOKEN_SECRET,
                      sleep_on_rate_limit=True)
    theFollowers = api.GetFollowers(screen_name=screenName, include_user_entities=True)
    print("this is iteration:")
    print(len(theFollowers))
    returnList = []
    for each in theFollowers:
        each._json['mutual_connection'] = screenName
        returnList = returnList + [each]

    newlist = sorted(returnList, key=lambda x: x.followers_count, reverse=True)
    newlist = newlist[0:10]
    newlist2 = sorted(returnList, key=lambda x: x.followers_count, reverse=False)
    newlist2 = newlist2[0:10]
    return newlist + newlist2

# gives the top connections and mututal friends for a single user
def getFinalMutualConnections(followers, ACCESS_TOKEN, ACCESS_TOKEN_SECRET):
    finalList = []

    for each in followers:
        finalList = finalList + topFollowers(each['screen_name'], ACCESS_TOKEN, ACCESS_TOKEN_SECRET)

    finalList = sorted(finalList, key=lambda x: x.followers_count, reverse=True)
    finalList = finalList[0:5]
    finalList2 = sorted(finalList, key=lambda x: x.followers_count, reverse=False)
    finalList2 = finalList2[0:5]
    return finalList+finalList2

# saves the top connections to the mongo db database
def saveFinalMutualConnections(finalList, screenName):
    db.User.update({ 'twitter.screenname': screenName }, {'$set': {'twitter.mutualconnections': [{}]}})
    for item in finalList:
        item._json['record_of'] = screenName
        item = json.dumps(item, default=lambda o: o._json)
        item = json_util.loads(item)
        db.User.update({ 'twitter.screenname': screenName }, {'$push': {'twitter.mutualconnections': item}})

# function to read followers from mongo db
def read():
    try:
        user = db.User.find()

        for singleUser in user:
            if (singleUser['twitter']['screenname'] not in previousUsers):
                print(singleUser['twitter']['screenname'])
                followerConnection = getFinalMutualConnections(singleUser['twitter']['followers'],singleUser['twitter']['token'],singleUser['twitter']['tokensecret'])
                print("done with FollowerConnections")
                saveFinalMutualConnections(followerConnection,singleUser['twitter']['screenname'])
                print("done for")
                print(singleUser['twitter']['screenname'])

    except Exception as e:
        print("Exception")
        print (e)

read()
