<?php

    function create_room(){
        $client = new rabbitMQClient("../testRabbitMQ.ini","testserver");
        $request = array();
        $request['type'] = 'lobby_add';
        $_SESSION['lobby_host'] = true;
        return $client->send_request($request);
    }

    function join_room($lobbyid){
        $client = new rabbitMQClient("../testRabbitMQ.ini","testserver");
        $request = array();
        $_SESSION['lobby_host'] = false;
        header("Location: lobby_game.html");
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

   }

   echo json_encode($response);
   exit(0);

?>