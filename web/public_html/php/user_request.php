<?php

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

   function get_profile_info($userid)
   {
      
      $client = new rabbitMQClient("testRabbitMQ.ini","testServer");
      $request = array();
      $request['type'] = "get_user_data";
      $request['user_id'] = $userid;

      $response = $client->send_request($request);
      return $response;
   }

   function get_username_from_id($userid){

      $client = new rabbitMQClient("testRabbitMQ.ini","testServer");
      $request = array();
      $request['type'] = "get_username_from_id";
      $request['user_id'] = $userid;

      $response = $client ->send_request($request);
      return $response;

   }
   
   function friend_request($user_id, $friend_name)
   {

      $client = new rabbitMQClient("testRabbitMQ.ini","testServer");
      $request = array();
      $request['type'] = "add_friend";
      $request['user_id'] = $user_id;
      $request['friend_name'] = $friend_name;

      $response = $client->send_request($request);
      $response = json_decode($response);
      //echo $response;
      return $response->{'status'};

   }
   
   function get_friends_list($userid)
   {

      $client = new rabbitMQClient("testRabbitMQ.ini","testServer");
      $request = array();
      $request['type'] = "get_friends";
      $request['user_id'] = $userid;

      $response = $client ->send_request($request);
      return $response;

   }

   function get_achievements($userid)
   {

      $client = new rabbitMQClient("testRabbitMQ.ini","testServer");
      $request = array();
      $request['type'] = "get_achievements";
      $request['user_id'] = $userid;

      $response = $client ->send_request($request);
      return $response;

   }

   function true_false_to_1_0($bool)
   {
      if($bool)
      {
         return 1;
      }
      else
      {
         return 0;
      }
   }

   function update_settings($profile_privacy, $friend_privacy, $achievement_privacy)
   {
      $client = new rabbitMQClient("testRabbitMQ.ini","testServer");
      
      //Update profile privacy
      $request = array();
      $request['type'] = "user_update_profile_privacy";
      $request['user_id'] = $_SESSION['userid'];
      $request['public'] = true_false_to_1_0($profile_privacy);
      $response = $client ->send_request($request);

      //Update friend privacy
      $request = array();
      $request['type'] = "user_update_friends_public";
      $request['user_id'] = $_SESSION['userid'];
      $request['public'] = true_false_to_1_0($friend_privacy);
      $response = $client ->send_request($request);

      //Update achievements privacy
      $request = array();
      $request['type'] = "user_update_achievements_public";
      $request['user_id'] = $_SESSION['userid'];
      $request['public'] = true_false_to_1_0($achievement_privacy);
      $response = $client ->send_request($request);

   }

   $request = $_POST;
   $response = "Unsupported type";
   //Switch statement handles all user requests from here

   switch ($request["type"]){

      case "all":
         $response = get_profile_info($request["user_id"]);
         break;

      case "username":
         $response = get_username_from_id($request["user_id"]);
         break;

      case "friends_list":
         $response = get_friends_list($request["user_id"]);
         break;

      case "friend_req":
         $response = friend_request($request["user_id"], $request["friend_name"]);
         break;

      case "achievements":
         $response = get_achievements($request["user_id"]);
         break;

      case "settings":
         $response = update_settings($request["profile_privacy"], $request["friend_privacy"], $request["achievement_privacy"]);
         break;
   }

   echo $response;
   exit(0);

?>