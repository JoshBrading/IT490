#!/usr/bin/php

<?php
$dbVars = parse_ini_file('database.ini');
$dbIP = $dbVars['dbIP'];
$dbUser = $dbVars['dbUser'];
$dbPassword = $dbVars['dbPassword'];
$dbName = $dbVars['dbName'];
echo $dbName;
$db = new mysqli($dbIP,$dbUser,$dbPassword,$dbName);
if ($db->errno != 0)
{
  echo "failed to connect to database: ". $db->error . PHP_EOL;
  exit(0);
}
echo "successfully connected to database".PHP_EOL;

function getFriends($user_id)
{
  global $db;
  $query = "SELECT friendID FROM friends WHERE accID=" . $user_id . ";";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }

  return mysqli_fetch_all($response)[0];
}

function getAchievements($user_id)
{
  global $db;
  $query = "SELECT achievement FROM playerAchievements WHERE accID=" . $user_id . ";";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }

  return mysqli_fetch_all($response)[0];
}

function getUserData($user_id)
{
  global $db;
  $query = "SELECT accid, name, lifetimePoints, gamesWon, publicProfile, publicFriends, publicAchievements, highestScore, gamesPlayed FROM accounts WHERE accID=" . $user_id . ";";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }

  return mysqli_fetch_row($response);
}

function getUsername($user_id)
{
  global $db;
  $query = "SELECT name FROM accounts WHERE accID=" . $user_id . ";";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }

  return mysqli_fetch_row($response);
}

function getID($username)
{
  global $db;
  $query = "SELECT accID FROM accounts WHERE accID=" . $username . ";";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }

  return mysqli_fetch_row($response);
}

function newUser($username, $password, $email)
{
  global $db;
  $query = "INSERT INTO accounts (name, lifetimePoints, gamesWon, publicProfile, publicFriends, publicAchievements, email, password, highestScore, gamesPlayed) VALUES ('" . $username . "', 0, 0, 0, 0, 0, '" . $email . "', '" . $password . "', 0, 0);";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }

  return "User created";
}

function newSteamGame($steam_game)
{
  global $db;
  $query = "INSERT INTO steamGames (steamID, type, name, detailedDescription, shortDescription, headerImage, website, genres, categories, releaseDate, background, mature) VALUES
   (" . $steam_game['steam_appid'] . ", '" . $steam_game['type'] . "', '" . $steam_game['name'] . "', '" . $steam_game['detailed_description'] . "', '" . $steam_game['short_description'] . "', '"
   . $steam_game['header_image'] . "', '" . $steam_game['website'] . "', '" . $steam_game['genres'] . "', '" . $steam_game['categories'] . "', '" . $steam_game['release_date'] . "', '" 
   . $steam_game['background'] . "', " . $steam_game['mature'] . ");";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }

  return "Steam Game Data created";
}

function addFriend($username, $friendUsername)
{
  global $db;
  $query = "INSERT INTO friends (username, friendUsername) VALUES ('" . $username . "', '" . $friendUsername . "');";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }

  return "Friend Added";
}

function addLobby()
{
  global $db;
  $lobby_id = rand(1000, 9999);
  $query = "INSERT INTO lobbies (lobbyID, status) VALUES (" . $lobby_id . ", 0);";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }

  return $lobby_id;
}

function removeLobby($lobby_id)
{
  global $db;
  $query = "DELETE FROM lobbies WHERE lobbyID = " . $lobby_id . ";";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }

  return "" . $lobby_id . " successfully deleted";
}

function addAchievement($username, $achievement)
{
  global $db;
  $query = "INSERT INTO playerAchievements (username, achievement) VALUES ('" . $username . "', '" . $achievement . "');";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }

  return "Achievement Added";
}

function getSteamGame($steam_id)
{
  global $db;
  $query = "SELECT * FROM steamGames WHERE steamID=" . $steam_id . ";";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }

  return mysqli_fetch_row($response);
}

function updateStatus($lobby_id, $status)
{
  global $db;
  $query = "UPDATE lobbies SET status = " . $status . " WHERE lobbyID = " . $lobby_id . ";";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }

  return "" . $lobby_id . " successfully changed to status " . $status . "";
}

error_reporting(E_ALL);
ini_set('display_errors', 'On');
require_once('path.inc');
require_once('get_host_info.inc');
require_once('rabbitMQLib.inc');

function doLogin($username,$password)
{
    global $db;
    
    echo "successfully connected to database".PHP_EOL;
    
    $query = "SELECT * FROM users WHERE username='$username' AND password='$password';";
    
    $response = $db->query($query);
    if ($db->errno != 0)
    {
            echo "failed to execute query:".PHP_EOL;
            echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
            exit(0);
    }
    
    $numrows = mysqli_num_rows($response);
    
    if($numrows != 0)
    {
    echo "Auth";
        return "Auth";
    }else{
      return 0;
    }
    // lookup username in databas
    // check password
    echo "doLogin()";
    return true;
    //return false if not valid
}

function requestProcessor($request)
{

  echo "received request".PHP_EOL;
  var_dump($request);
  if(!isset($request['type']))
  {
    return "ERROR: unsupported message type";
  }
  switch ($request['type'])
  {
    case "login":
      return doLogin($request['username'],$request['password']);
      break;
    case "validate_session":
      return doValidate($request['sessionId']);
      break;
    case "get_friends":
      return getFriends($request['user_id']);
      break;
    case "get_user_data":
      return getUserData($request['user_id']);
      break;
    case "get_username_from_id":
      return getUsername($request['user_id']);
      break;
    case "get_account_id":
      return getID($request['username']);
      break;
    case "new_user":
      return newUser($request['username'], $request['password'], $request['email']);
      break;
    case "new_steam_game":
      return newSteamGame($request['steam_game']);
      break;
    case "get_steam_game":
      return getSteamGame($request['steam_id']);
      break;
    case "add_friend":
      return addFriend($request['username'], $request['friendUsername']);
      break;
    case "add_achievement":
      return addAchievement($request['username'], $request['achievement']);
      break;
    case "get_achievements":
      return getAchievements($request['user_id']);
      break;
    case "lobby_add":
      return addLobby();
      break;
    case "lobby_remove":
      return removeLobby($request['lobby_id']);
      break;
    case "lobby_update_status":
      return updateStatus($request['lobby_id'], $request['status']);
      break;
  }
  return array("returnCode" => '0', 'message'=>"Server received request and processed");
}

$server = new rabbitMQServer("testRabbitMQ.ini","testServer");

echo "testRabbitMQServer BEGIN".PHP_EOL;
$server->process_requests('requestProcessor');
echo "testRabbitMQServer END".PHP_EOL;
exit();
?>
