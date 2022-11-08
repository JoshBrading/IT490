<?php
session_start();

// error_reporting(E_ALL);
// ini_set("display_errors", 1);

require_once('../../path.inc');
require_once('../../get_host_info.inc');
require_once('../../rabbitMQLib.inc');

function create_room(){
    $client = new rabbitMQClient("testRabbitMQ.ini","testServer");
    $request = array();
    $request['type'] = 'lobby_add';
    
    $response = json_decode($client->send_request($request));
    
    $_SESSION['lobby_host'] = true;
    $_SESSION['lobby_id'] = $response->{"lobby_id"};
    return $_SESSION['lobby_id'];
}

function join_room($lobbyid){
    $client = new rabbitMQClient("testRabbitMQ.ini","testServer");
    $request = array();
    $_SESSION['lobby_host'] = false;
    $_SESSION['lobby_id'] = $lobbyid;
    return $client->send_request($request);
}

function list_rooms(){
    $client = new rabbitMQClient("testRabbitMQ.ini","testServer");
    $request = array();
    $request['type'] = "get_lobbies";
    return $client->send_request($request);
}

$request = $_POST;

//Switch statement handles all user requests from here

switch ($request["type"]){

    case "create":
        $response = create_room();
        break;

    case "join":
        $response = join_room($request["lobbyid"]);
        break;

    case "list":
        $response = list_rooms();
}

echo $response;
exit(0);

?>