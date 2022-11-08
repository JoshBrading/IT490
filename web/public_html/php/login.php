<?php

session_start();

// error_reporting(E_ALL);
// ini_set("display_errors", 1);

require_once('../../path.inc');
require_once('../../get_host_info.inc');
require_once('../../rabbitMQLib.inc');


function get_dir(){

	//https://www.positioniseverything.net/php-header-location/

	// getting hostname
	$hostname = $_SERVER[“HTTP_HOST”];
	// getting the current directory preceded by a forward “/” slash
	$current_directory = rtrim(dirname($_SERVER[‘PHP_SELF’]));
	return $current_directory;
}

//Session Validate
function session_validate(){
	
	$client = new rabbitMQClient("testRabbitMQ.ini","testServer");
	$request = array();
	$request['type'] = "session_validate";
	$request['session_id'] = session_id();
	$response = $client->send_request($request);

	// if (isset($_SESSION['username'])){

	// 	if (!session_validate()){
	// 		session_destroy();
	// 		header("Location: http://"+get_dir()+"/index.html");
	// 		exit();
	// 	}
	// }
	// else 
	// {
	
	// 	session_start();
	// 	$id = session_id();
	
	// }

	return $response;

}

//Login
function login($username, $password){
	$client = new rabbitMQClient("testRabbitMQ.ini","testServer");
    $request = array();
    $request['type'] ='login';
    $request['username'] = $username;
    $response = $client->send_request($request);

	$response = json_decode($response);

	//Password Verification
	if(password_verify($password, $response->{'hash'})){

		$_SESSION['userid'] = $response->{'id'};
		$_SESSION['username'] = $username;

		return $_SESSION['userid'];

	} 
	else 
	{
		return "Failed";
	}
}

//New User
function new_user($username, $password){
	$client = new rabbitMQClient("testRabbitMQ.ini","testServer");
	$request = array();
    $request['type'] = 'new_user';
    $request['username'] = $username;
	$request['password'] = password_hash($password, PASSWORD_DEFAULT);

	$response = $client->send_request($request);

	echo PHP_EOL . $response . PHP_EOL;
	echo "se12nd";
	exit(0);

	if(strcmp($response, 'succ') == 0){

		echo "in the succ";
		header("Location: http://"+get_dir()+"/index.html");
		return "Registration successful.";

	} else {
		return "Username already exists.";
	}
}

//Logout
function logout(){
    if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
  }
  
  session_destroy();

  return "Session destroyed";
}

//Handles login requests
if (!isset($_POST))
{
	$msg = "NO POST MESSAGE SET, POLITELY FUCK OFF";
	echo json_encode($msg);
	exit(0);
}

//Receive response from HTML
$request = $_POST;

$response = "unsupported request type, politely FUCK OFF";

switch ($request["type"])
{
	case "login":
     	$response = login($request["uname"], $request["password"]);

		break;

	case "logout":
		$response = logout();

		break;
	
	case "new_user":
		$response = new_user($request["uname"], $request["password"]);

		break;

}

echo $response;
exit(0);

?>
