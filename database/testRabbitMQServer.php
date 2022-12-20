#!/usr/bin/php

<?php
logMsg("started testRabbitMQServer");
error_log(date("Y-m-d H:i:s"));
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

function logMsg($msg)
{
  file_put_contents("log.log", date("Y-m-d H:i:s")." ".$msg.PHP_EOL, FILE_APPEND);
}

function getGamePack($username, $packName)
{
  global $db;
  $query = "SELECT appID, gameName FROM gamePacks WHERE username = ? AND packName = ?";

  $stmt = mysqli_prepare($db, $query);
  mysqli_stmt_bind_param($stmt, "ss", $username, $packName);
  mysqli_stmt_execute($stmt);
  $result = mysqli_stmt_get_result($stmt);

  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }

  $games = [];
  while ($row = mysqli_fetch_assoc($result))
  {
    $games[] = $row;
  }

  return json_encode($games);
}


function addGamePack($username, $packName, $appID, $gameName)
{
  global $db;
  $query = "INSERT INTO gamePacks (username, packName, appID, gameName) VALUES (?, ?, ?, ?)";

  $stmt = mysqli_prepare($db, $query);
  mysqli_stmt_bind_param($stmt, "ssis", $username, $packName, $appID, $gameName);
  mysqli_stmt_execute($stmt);

  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }

  echo json_encode(["status" => "success"]) . PHP_EOL;
  return json_encode(["status" => "success"]);
}


function addImportedGame($username, $appID, $gameName)
{
  global $db;
  $query = "INSERT INTO importedGames (username, appID, gameName) VALUES (?, ?, ?)";

  $stmt = mysqli_prepare($db, $query);
  mysqli_stmt_bind_param($stmt, "sis", $username, $appID, $gameName);
  mysqli_stmt_execute($stmt);

  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }

  echo json_encode(["status" => "success"]) . PHP_EOL;
  return json_encode(["status" => "success"]);
}

function getGamePacks($username, $packName)
{
  global $db;
  $query = "SELECT appID, gameName FROM gamePacks WHERE username=" . $username . " AND packName=". $packName .";";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }
  while ($row = $response->fetch_assoc())
  {
    $returnArray[] = ["app_id" => $row['appID'], "game_name" => $row['gameName']];
  }
  echo $returnArray;
  return $returnArray;
}

function getImportedGames($username)
{
  global $db;
  $query = "SELECT appID, gameName FROM importedGames WHERE username=" . $username . ";";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }
  while ($row = $response->fetch_assoc())
  {
    $returnArray[] = ["app_id" => $row['appID'], "game_name" => $row['gameName']];
  }
  echo $returnArray;
  return $returnArray;
}


function getFriends($user_id)
{
  global $db;
  $query = "SELECT friendID, friendUsername FROM friends WHERE accID=" . $user_id . ";";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }
  while ($row = $response->fetch_assoc())
  {
    $returnArray[] = ["friend_username" => $row['friendUsername'], "friend_id" => $row['friendID']];
  }
  echo json_encode($returnArray);
  return $returnArray;
}

function getAchievements($user_id)
{
  global $db;
  $query = "SELECT achievement FROM playerAchievements WHERE accID=" . $user_id . ";";
  $returnArray = array();
  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }
  while ($row = $response->fetch_assoc())
  {
    $returnArray[] = $row['achievement'];
  }

  echo json_encode($returnArray);
  return json_encode($returnArray);
}

function getUserData($user_id)
{
  global $db;
  $query = "SELECT accID, name, lifetimePoints, gamesWon, publicProfile, publicFriends, publicAchievements, highestScore, gamesPlayed FROM accounts WHERE accid=" . $user_id . ";";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }

  $response = $response->fetch_assoc();

  $response = ["id" => $response["accID"], 
              "name" => $response["name"], 
              "lifetimePoints" => $response["lifetimePoints"], 
              "gamesWon" => $response["gamesWon"], 
              "publicProfile" => $response["publicProfile"], 
              "publicFriends" => $response["publicFriends"], 
              "publicAchievements" => $response["publicAchievements"], 
              "highestScore" => $response["highestScore"], 
              "gamesPlayed" => $response["gamesPlayed"]];

  echo json_encode($response);
  return json_encode($response);
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

  $response = $response->fetch_assoc();
  $response = ["username" => $response["name"]];
  return json_encode($response);
}

function getID($username)
{
  global $db;
  $query = "SELECT accID FROM accounts WHERE name='" . $username . "';";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }
  $response = ["id" => mysqli_fetch_row($response)[0]];
  echo json_encode($response);
  return json_encode($response);
}

function newUser($username, $password)
{
  global $db;

  $query = "SELECT COUNT(*) FROM accounts WHERE name='" . $username . "';";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }

  $response = mysqli_fetch_row($response)[0];
  echo $response;
  if ($response == 0)
  {
    echo ("thank god this works");
    $query = "INSERT INTO accounts (name, lifetimePoints, gamesWon, publicProfile, publicFriends, publicAchievements, email, password, highestScore, gamesPlayed) VALUES ('" . $username . "', 0, 0, 0, 0, 0, '" . "placeholder" . "', '" . $password . "', 0, 0);";

    $response = $db->query($query);
    if ($db->errno != 0)
    {
      echo "failed to execute query:".PHP_EOL;
      echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
      exit(0);
    }
  
    return "succ";
  }
  else
  {
    echo "false";
    return "failed";
  }

}

function newSteamGame($steam_game)
{
  global $db;
  $query = "INSERT INTO steamGames (steamID, type, name, shortDescription, headerImage, website, genres, categories, releaseDate, background, mature) VALUES
   (" . $steam_game['steam_appid'] . ", '" . $steam_game['type'] . "', '" . $steam_game['name'] . "', '" . $steam_game['short_description'] . "', '"
   . $steam_game['header_image'] . "', '" . $steam_game['website'] . "', '" . $steam_game['genres'] . "', '" . $steam_game['categories'] . "', '" . $steam_game['release_date'] . "', '" 
   . $steam_game['background'] . "', " . $steam_game['mature'] . ")
   ON DUPLICATE KEY UPDATE type = '" . $steam_game['type'] . "', name = '" . $steam_game['name'] . "', shortDescription = '" . $steam_game['short_description'] . "', headerImage = '"
   . $steam_game['header_image'] . "', website = '" . $steam_game['website'] . "', genres = '" . $steam_game['genres'] . "', categories = '" . $steam_game['categories'] . "', releaseDate = '" . $steam_game['release_date'] . "', background = '" 
   . $steam_game['background'] . "', mature = " . $steam_game['mature'] . ";";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }

  return "Steam Game Data created";
}

function addFriend($user_id, $friendUsername)
{
  global $db;
  $query = "SELECT accID FROM accounts WHERE name = '". $friendUsername . "';";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }
  if ($response->num_rows == 0)
  {
    echo json_encode(["status" => "failed"]) . PHP_EOL;
    return json_encode(["status" => "failed"]);
  }
  $friend_id = mysqli_fetch_row($response)[0];

  $query = "INSERT INTO friends (accID, friendID, friendUsername) VALUES (" . $user_id . ", " . $friend_id . ", '" . $friendUsername . "') ON DUPLICATE KEY UPDATE friendUsername = '" . $friendUsername . "';";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }
  echo json_encode(["status" => "success"]) . PHP_EOL;
  return json_encode(["status" => "success"]);
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
  $response = ["lobby_id" => $lobby_id];
  echo json_encode($response);
  return json_encode($response);
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

function addAchievement($user_id, $achievement)
{
  global $db;
  $query = "INSERT INTO playerAchievements (accID, achievement) VALUES (" . $user_id . ", '" . $achievement . "')
            ON DUPLICATE KEY UPDATE accID = accID;";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }
  logMsg("Achievement added for user with the ID " . $user_id . ": " . $achievement);
  return "Achievement Added";
}

function getSteamGame($steam_id)
{
  global $db;
  $query = "SELECT * FROM steamGames WHERE steamID=" . $steam_id . ";";
  $returnArray = array();
  //make an array called tempArray
  $tempArray = array();

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

function updateProfilePublicity($user_id, $public)
{
  global $db;
  $query = "UPDATE accounts SET publicProfile = " . $public . " WHERE accID = " . $user_id . ";";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }

  return "" . $user_id . " successfully changed profile publicity to status " . $public . "";
}

function updateAchievementsPublicity($user_id, $public)
{
  global $db;
  $query = "UPDATE accounts SET publicAchievements = " . $public . " WHERE accID = " . $user_id . ";";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }

  return "" . $user_id . " successfully changed achievement publicity to status " . $public . "";
}

function updateFriendsPublicity($user_id, $public)
{
  global $db;
  $query = "UPDATE accounts SET publicFriends = " . $public . " WHERE accID = " . $user_id . ";";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }

  return "" . $user_id . " successfully changed friends publicity to status " . $public . "";
}

function newSessionID($username, $session_id)
{
  global $db;
  $query = "UPDATE accounts SET sessionID= '" . $session_id . "', lastLogin= NOW() WHERE username = '" . $username . "';";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }

  return "Session ID updated";
}

function getLobbies()
{
  global $db;
  $query = "SELECT * FROM lobbies;";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }
  while ($row = mysqli_fetch_row($response))
  {
    $returnArray[] = $row;
  }
  echo json_encode($returnArray);
  return json_encode($returnArray);
}

error_reporting(E_ALL);
ini_set('display_errors', 'On');
require_once('path.inc');
require_once('get_host_info.inc');
require_once('rabbitMQLib.inc');

function doLogin($username)
{
    global $db;
    
    echo "successfully connected to database".PHP_EOL;
    
    $query = "SELECT password, accID FROM accounts WHERE name='$username';";
    
    $response = $db->query($query);
    if ($db->errno != 0)
    {
            echo "failed to execute query:".PHP_EOL;
            echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
            exit(0);
    }
    
    
    
    // if($numrows != 0)
    // {
    // echo "Auth";
    //     return "Auth";
    // }else{
    //   return 0;
    // }
    // lookup username in databas
    // check password
    echo "doLogin()";
    $response = $response->fetch_assoc();
    $response =["hash" => $response["password"], "id" => $response["accID"]];
    echo json_encode($response);
    return $response;

    
    //return false if not valid
}

function updateStats($user_id, $win, $points)
{
  global $db;
  $query = "UPDATE accounts SET gamesWon = gamesWon + " . $win . ", lifetimePoints = lifetimePoints + " . $points . ", gamesPlayed = gamesPlayed + 1 WHERE accID = " . $user_id . ";";
  //UPDATE accounts SET gamesWon = gamesWon + 0, lifetimePoints = lifetimePoints + 0, gamesPlayed = gamesPlayed + 1 WHERE accID = 1;

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }
  checkForAchievements($user_id);
  return "Stats Updated for " . $user_id . "";
}

function checkForAchievements($user_id)
{
  global $db;
  $query = "SELECT accID, gamesWon, gamesPlayed, lifetimePoints FROM accounts WHERE accID = " . $user_id . ";";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }
  
  $responseArray = mysqli_fetch_row($response);
  if($responseArray[1] >= 1)
  {
    addAchievement($responseArray[0], "Won a Game!");
  }
  if($responseArray[1] >= 5)
  {
    addAchievement($responseArray[0], "Won 5 Games!");
  }
  if($responseArray[2] >= 1)
  {
    addAchievement($responseArray[0], "Played your first game!");
  }
  if($responseArray[2] >= 10)
  {
    addAchievement($responseArray[0], "Played 10 games!");
  }
  if($responseArray[3] >= 1)
  {
    addAchievement($responseArray[0], "Scored your first point!");
  }
  if($responseArray[3] >= 50)
  {
    addAchievement($responseArray[0], "Scored at least 50 points!");
  }
}

function getAllSteamGames()
{
  global $db;
  $query = "SELECT steamID, name, shortDescription, genres, categories, background FROM steamGames;";

  $response = $db->query($query);
  if ($db->errno != 0)
  {
    echo "failed to execute query:".PHP_EOL;
    echo __FILE__.':'.__LINE__.":error: ".$db->error.PHP_EOL;
    exit(0);
  }
  $stuffToReturn = mysqli_fetch_all($response);
  $stuffToReturn = json_encode($stuffToReturn, JSON_FORCE_OBJECT);
  echo $stuffToReturn;
  return $stuffToReturn;
}
//write a function that returns "pong"
function doPing()
{
  echo("pong".PHP_EOL);
  return json_encode("pong");
}
function requestProcessor($request)
{

  echo "received request".PHP_EOL;
  //$request = json_decode($request);
  var_dump($request, true);
  if(!isset($request['type']))
  {
    logMsg("ERROR: unsupported message type");
    return "ERROR: unsupported message type";
  }
  logMsg("received request from client with request type: ".$request['type']);
  echo ("received request from client with request type: ".$request['type'].PHP_EOL);
  echo ($request . PHP_EOL);
  switch ($request['type'])
  {
    case "ping":
      return doPing();
      break;
    case "login":
      return doLogin($request['username']);
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
      return newUser($request['username'], $request['password']);
      break;
    case "new_steam_game":
      return newSteamGame($request);
      break;
    case "get_steam_game":
      return getSteamGame($request['steam_id']);
      break;
    case "get_all_steam_games":
      return getAllSteamGames();
      break;
    case "add_friend":
      return addFriend($request['user_id'], $request['friend_name']);
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
    case "get_lobbies":
      return getLobbies();
      break;
    case "user_update_profile_public":
      return updateProfilePublicity($request['user_id'], $request['public']);
      break;
    case "user_update_achievements_public":
      return updateAchievementsPublicity($request['user_id'], $request['public']);
      break;
    case "user_update_friends_public":
      return updateFriendsPublicity($request['user_id'], $request['public']);
      break;
    case "new_session_id":
      return newSessionID($request['username'], $request['session_id']);
      break;
    case "update_stats":
      return updateStats($request['user_id'], $request['win'], $request['points']);
      break;
    case "get_game_packs":
      return getGamePacks($request['username'], $request['pack_name']);
      break;
    case "get_imported_games":
      return getImportedGames($request['username']);
      break;
    case "add_game_pack":
      return addGamePack($request['username'], $request['name'], $request['id'], $request['game_name']);
      break;
    case "add_imported_game":
      return addImportedGame($request['username'], $request['id'], $request['game_name']);
      break;
    case "get_game_pack":
      return getGamePack($request['username'], $request['pack_name']);
      break;
  }
  return array("returnCode" => '0', 'message'=>"Server received request and processed, no type matched");
  logMsg("No Type Matched");
}

$server = new rabbitMQServer("testRabbitMQ.ini","testServer");

echo "testRabbitMQServer BEGIN".PHP_EOL;
$server->process_requests('requestProcessor');
echo "testRabbitMQServer END".PHP_EOL;
exit();
?>
