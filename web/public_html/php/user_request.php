<?php

   function get_profile_info($userid)
   {

      $client = new rabbitMQClient("../testRabbitMQ.ini","testserver");
      $request = array();
      $request['type'] = "get_user_data";
      $request['user_id'] = $userid;
      echo json_encode($request);

      $response = $client ->send_request($request);

      if($response)
      {
         echo $response;
         return $response;
      }

      return "No response.";

   }

   function get_friends_list($userid)
   {

      $client = new rabbitMQClient("../testRabbitMQ.ini","testserver");
      $request = array();
      $request['type'] = "get_friends_list";
      $request['user_id'] = $userid;
      echo json_encode($request);

      $response = $client ->send_request($request);

      if($response)
      {
         echo $response;
         return $response;
      }

      return "No response.";

   }

   $request = $_POST;

   //Switch statement handles all user requests from here

   switch ($request["type"]){

      case "all":
         $response = get_profile_info($request["userid"]);
         break;

      case "friends_list":
         $response = get_friends_list($request["userid"]);
         break;
   }

   echo json_encode($response);
   exit(0);

?>