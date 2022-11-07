<?php
//  error_reporting(E_ALL);
//  ini_set('display_errors', 1);

require_once('../../path.inc');
require_once('../../get_host_info.inc');
require_once('../../rabbitMQLib.inc');

session_start();
$_SESSION["name"] = "bob";
$_SESSION["lobby_id"] = "1234";
//echo '{"reply":"12"}';
//exit(0);

function get_session_var($var)
{
    if(isset($_SESSION[$var])){
        return $_SESSION[$var];
    }
}
function get_all_games()
{
    $client = new rabbitMQClient("testRabbitMQ.ini","testServer");
    $request = array();
    $request['type'] = 'get_all_steam_games';
    return $client->send_request($request);
}

function update_user_stats($user_id, $win, $points)
{
    $client = new rabbitMQClient("testRabbitMQ.ini","testServer");
    $request = array();
    $request['type'] = 'update_stats';
    $request['user_id'] = $user_id;
    $request['win'] = $win;
    $request['points'] = $points;
    return $client->send_request($request);
}
//Switch statement handles all user requests from here

if (!isset($_POST))
{
	$msg = "NO POST MESSAGE SET, POLITELY FUCK OFF";
	echo json_encode($msg);
	exit(0);
}
$request = $_POST;
//echo $request["type"];
$response = "unsupported request type";
switch ($request["type"])
{
	case "get_all_steam_games":
     	$response = get_all_games();
        break;
    case "update_user_stats":
        $response = update_user_stats( $request["user_id"], $request["win"], $request["points"]);
        break;
    case "get_session_var":
        $response = get_session_var($request["var"]);
        break;
}
echo json_encode($response);
exit(0);
?>