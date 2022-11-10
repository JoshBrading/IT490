import re

def get_values_from_json_object_array( json, key ):
    """
    Returns any values matching the provided key inside a json object array.

    Parameters
    ----------
    json : str
        A json array
    key  : str
        The key to match

    Returns
    -------
    list
        A list of the top 100+ current and daily played games
    """
    values = []
    for x in range( len( json ) ):
        values.append( json[x][key] )
    return values

def regex_extract_all(regex, str):
    """
    Extract all regex matches from the a string

    Parameters
    ----------
    regex : str
        A regular expression
    str   : str
        The string to parse
        
    Returns
    -------
    list
        A list of all matches
    """
    matches = re.findall(regex, str)
    return [*set(matches)] # Remove duplicates if any


# Copied from https://www.geeksforgeeks.org/break-list-chunks-size-n-python/
def divide_chunks(l, n):
    # looping till length l
    for i in range(0, len(l), n):
        yield l[i:i + n]