# Steam-Tag Quiz - API

This is the API section of Steam-Tag Quiz. The API is responsible for gathering information from an outside data source, in this case: [Steam](https://steampowered.com/)

## app.py
App.py handles making all requests to steam_api.py and forwarding this responses to RabbitMQ where it is then added to our database.

## steam_api.py

This package gives easy to use access to steams official and slightly unofficial API endpoints, rate limits apply.

### Usage

```python
import steam_api

# returns a list of every appid on steam
request_app_list_all()

# returns the current player count for the given appid
request_player_count( appid : int )

# returns the application details for the given appid
request_app_details( appid : int )

# returns a list of appid's for the top 100 steam games using steams unofficial API
appids = steam_api.request_current_top_100()

# returns a dictionary of application details for the provided appid's (asynchronous)
apps = await steam_api.request_app_details_multi( appids : list )

```

## util.py

An assortment of utility functions used by steam_api.py

### Usage

```python
import steam_api

# returns any values matching the provided key inside a json object array.
get_values_from_json_object_array( json : str, key : str )

# returns a list of all matches extracted from the given string
regex_extract_all(regex : str, str)

```

## License
[MIT](https://choosealicense.com/licenses/mit/)