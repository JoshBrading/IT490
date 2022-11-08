import grequests
import requests
import json

import util

def request_app_list_all():
    """
    Makes a request to the Steam API for the list of ALL applications on Steam

    Returns
    -------
    list
        A list of application ID's (appid's)
    """

    URL = "https://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=STEAMKEY&format=json" 
    r = requests.get( URL )

    r_json = r.json()   # Data example: {"applist":{"apps":[{"appid":1897482,"name":""},{"appid":2112761,"name":""},{"appid":1829051,"name":""}]}}
    
    applist = r_json["applist"]    # Access the "applist" object
    apps = applist["apps"]         # Access the "apps" object

    appids = []
    for app in apps:  # Get appid for every app in the list
        appids.append( app["appid"] )
    return appids

def request_player_count( appid ):
    """
    Requests the current player count from the Steam API for a given application ID

    Parameters
    ----------
    appid   :  int
        The application ID (appid)

    Returns
    -------
    int
        The current player count
    """
    URL = "https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?format=json&appid=" + str( appid )
    r = requests.get( URL )

    r_json = r.json()

    response = r_json["response"]
    if( len(response) < 2 ): # For some games the player_count variable is missing, return these as 0
        return 0

    player_count = response["player_count"]
    return player_count


def request_app_details( appid ):
    """
    Requests app details from the Steam API for a given application ID

    Sometimes responds in Russian?

    Parameters
    ----------
    appid   :  int
        The application ID (appid)

    Returns
    -------
    Failure : None

    Success : dict
        A dictionary of an applications details

        Example:
            {
            "data":{
                "type": str,
                "name": str,
                "steam_appid": int,
                "detailed_description": str,
                "short_description": str,
                "supported_languages": list,
                "header_image": str,
                "website":str,
                "metacritic":{"score": int,"url":str},
                "genres": list,
                "release_date": str,
                "background":str,
                "mature": bool
                }
            }
    """
    URL = "https://store.steampowered.com/api/appdetails?appids=" + str( appid ) # Example appid: 252950 ( Rocket League )
    r = requests.get( URL )

    if r.text == "null":
        return "rate_limited"

    r_json = r.json()

    #remove all apostrophes from r_json
    r_json = json.loads(json.dumps(r_json).replace("'", ""))

    if r_json is None:
        return {}

    data = r_json[appid]
    
    success = data["success"]
    if( success == False ):
        return {}

    data = data["data"]

    if data["type"] != "game":
        return {}

    if "genres" not in data:
        return {}
    
    if "categories" not in data:
        return {}

    
    type = data["type"]
    name = data["name"]
    steam_appid = appid
    detailed_description = data["detailed_description"]
    short_description = data["short_description"]
    #supported_languages = data["supported_languages"].split(', ') # Split supported languages into a list
    header_image = data["header_image"]
    website = data["website"]
    #metacritic = data["metacritic"]
    genres = util.get_values_from_json_object_array(data["genres"], "description") # Remove all unimportant information
    categories = util.get_values_from_json_object_array(data["categories"], "description")
    release_date = data["release_date"]["date"]
    background = data["background_raw"]
    mature = 1 if len(data["content_descriptors"]["ids"]) > 0 else 0 # Expression: Check if content_descriptors ids are present, if they are then its mature. I think...

    data = {
        "type" : type,
        "name" : name,
        "steam_appid" : steam_appid,
        "detailed_description" : detailed_description,
        "short_description" : short_description,
       # "supported_languages" : supported_languages,
        "header_image" : header_image,
        "website" : website,
       # "metacritic" : metacritic,
        "genres" : ','.join(genres),
        "categories" : ','.join(categories),
        "release_date" : release_date,
        "background" : background,
        "mature" : mature
    }
    return data

async def request_app_details_multi(app_list):
    URLs = []
    for x in range(len(app_list)):
        URLs.append("https://store.steampowered.com/api/appdetails?appids=" + str( app_list[x] ))

    rs = (grequests.get(u) for u in URLs)

    detail_list = grequests.map(rs)

    app_details = {}

    for details in detail_list:
        #print(details.text)

        r_json = details.json()
        data = r_json[next(iter(r_json))]
        
        success = data["success"]
        if( success == False ):
            return {}

        data = data["data"]

        if data["type"] != "game":
            return {}

        if "genres" not in data:
            return {}

        
        type = data["type"]
        name = data["name"]
        steam_appid = data["steam_appid"]
        detailed_description = data["detailed_description"]
        short_description = data["short_description"]
        #supported_languages = data["supported_languages"].split(', ') # Split supported languages into a list
        header_image = data["header_image"]
        website = data["website"]
        #metacritic = data["metacritic"]
        genres = util.get_values_from_json_object_array(data["genres"], "description") # Remove all unimportant information
        release_date = data["release_date"]["date"]
        background = data["background_raw"]
        mature = True if len(data["content_descriptors"]["ids"]) > 0 else False # Expression: Check if content_descriptors ids are present, if they are then its mature. I think...

        print(name)

        data = {
            "type" : type,
            "name" : name,
            "steam_appid" : steam_appid,
            "detailed_description" : detailed_description,
            "short_description" : short_description,
        # "supported_languages" : supported_languages,
            "header_image" : header_image,
            "website" : website,
        # "metacritic" : metacritic,
            "genres" : genres,
            "release_date" : release_date,
            "background" : background,
            "mature" : mature
        }

        app_details[str(steam_appid)] = data
    return app_details

def request_current_top_100():
    """
    Requests the top 100 current and daily games by player count.

    Warning: This uses an unofficial API and may not always work, update accordingly.

    Note*: The list includes both current and daily most played games

    This means it can be >100

    Returns
    -------
    list
        A list of the top 100+ current and daily played games
    """
    endpoint = "https://api.steampowered.com/ISteamChartsService/GetGamesByConcurrentPlayers/v1?input_protobuf_encoded=Cg8KB2VuZ2xpc2gaAlVTIAESEAgBEAEYASgBMAFAFEgBUAE%3D"
    header = { "authority": "api.steampowered.com" ,
        "accept": "application/json, text/plain, */*" ,
        "accept-language": "en-US,en;q=0.7" ,
        "origin": "https://store.steampowered.com" ,
        "referer": "https://store.steampowered.com/" ,
        "sec-fetch-dest": "empty" ,
        "sec-fetch-mode": "cors" ,
        "sec-fetch-site": "same-site" ,
        "sec-gpc": "1" ,
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36" ,
    }


    r = requests.get(endpoint, headers=header)
    regex = '(?<=steam\/apps\/)(\d{1,8})(?=\/\$\{FILENAME\}\?)'
    appids = util.regex_extract_all(regex, str(r.text.encode('ascii', 'ignore')))
    print("Found " + str(len(appids)) + " appids")
    return appids