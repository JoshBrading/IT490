
<?php
require_once('../../path.inc');
require_once('../../get_host_info.inc');
require_once('../../rabbitMQLib.inc');

//Session Check/Creation
if (isset($_SESSION['username'])){

	if (!session_validate()){
		session_destroy();
		header("Location: index.html");
		exit();
	}
}
else 
{

	session_start();
	$id = session_id();

}

//Session Validate
function session_validate(){
	
	$client = new rabbitMQClient("../testRabbitMQ.ini","testserver");
	$request = array();
	$request['type'] = "session_validate";
	$request['session_id'] = session_id();
	$response = $client->send_request($request);
	return $response;

}

//Login
function login($username, $password){
	$client = new rabbitMQClient("../testRabbitMQ.ini","testServer");
    $request = array();
    $request['type'] ='login';
    $request['username'] = $username;
    $request['password'] = password_hash($password, PASSWORD_DEFAULT);
    $response = $client->send_request($request);

	//Session Exists? Send to lobby_home.html
	if($response){

		$_SESSION['username'] = 'username';

		$request['type'] = 'get_account_id';
		
		$response = $client->send_request($request);
		$_SESSION['userid'] = $response;
		header("Location: lobby_home.html");

	} 
	else 
	{
		return "Username or password does not exist.";
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

//New User
function new_user($username, $password){
	$client = new rabbitMQClient("../testRabbitMQ.ini","testServer");
	$request = array();
    $request['type'] = 'new_user';
    $request['username'] = $username;
	$request['password'] = password_hash($password, PASSWORD_DEFAULT);
    $response = $client->send_request($request);

	if(true){
		header("Location: index.html");
	} else {
		return "Registration failed.";
	}
}

//Handles login requests
if (!isset($_POST))
{
	$msg = "NO POST MESSAGE SET, POLITELY FUCK OFF";
	echo json_encode($msg);
	exit(0);
}
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
		$reponse = new_user($request["uname"], $request["password"]);

		break;

}
echo json_encode($response);
exit(0);

?>
