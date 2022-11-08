var engine = new Engine();
var correct = false;
var game_list;
var solution_index;
var solution_name = '';

var network_update_interval = 10;

var network_game1_string = '';
var network_game2_string = '';
var network_game3_string = '';
var network_game4_string = '';
var network_solution;

var start_game = false;

var player_count = 0; 

var round_max = 10;
var round_count = 5;

var network_last_message = '';


window.onload = function()
{
    engine.start();
    //add_session_var_from_server("username");
    //add_session_var_from_server("lobby_id");
}

engine.init = function()
{
    console.log("init");
 
    var request = new XMLHttpRequest();
    request.open("POST","network/post.php",true);
    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    console.log("post");
    request.onreadystatechange = function(){
        if ((this.readyState == 4)&&(this.status == 200))
        {
            console.log(this.responseText);
        }	
    }

    if(localStorage.getItem("lobby_host") == "true")
    {
        request.send("status=pregame&lobby_id=" + localStorage.getItem('lobby_id') + "&name=" + localStorage.getItem('username') + "&end=" + "200");
    }
    else
    {
        request.send("status=player_joined&lobby_id=" + localStorage.getItem('lobby_id') + "&name=" + localStorage.getItem("username") + "&end=" + "200");
    }
    //get_session_var("name");

    var request_t = new XMLHttpRequest();
	request_t.open("POST","network/request.php",true);
	request_t.setRequestHeader("Content-Type","application/x-www-form-urlencoded");

    request_t.onreadystatechange= function ()
	{
		if ((this.readyState == 4)&&(this.status == 200))
		{
			data = this.responseText;
            result = JSON.parse(JSON.parse(data));
            game_1 = Math.floor(Math.random() * 100);
            console.log(result[game_1.toString()]);
            game_list = result;

            entity_manager.clear();
            main_menu();

            //console.log("test");
            //console.log(result);
		}
	}
    console.log('send');
	request_t.send("type=get_all_steam_games");
    console.log('sent');

    text = new Entity;
    text.label.text =  "Connecting...";
    text.position.x = 1280/2;
    text.position.y = 720/2;
    text.label.font = "72px serif"

}

engine.update = function()
{
    entity_manager.think();
    entity_manager.update();



    if(engine.mouse.event){
        send_update();
    }

    if(network_update_interval <= 0)
    {
        network_update();
        network_update_interval = 10;
    }
    network_update_interval --;
    if( start_game )
    {
        start_game = false;
        var request = new XMLHttpRequest();
        request.open("POST","network/post.php",true);
        request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        console.log("post");
        request.send("status=start&lobby_id=" + localStorage.getItem('lobby_id') + "&name=" + localStorage.getItem('username') + "&end=" + "200");

    }
    // Update mouse last!
    engine.mouse.update();
}

function network_update()
{
    var request = new XMLHttpRequest();
    request.open("POST","network/post.php",true);
    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");

    request.onreadystatechange = function(){
        if ((this.readyState == 4)&&(this.status == 200))
		{
            if(network_last_message != this.responseText){
                console.log(this.responseText);
                network_last_message = this.responseText;
                var message_contents = network_last_message.split("&");
                var var_array = [];
                for( var i = 1; i < message_contents.length; i++ ){
                    message_contents[i] = message_contents[i].replace("/(\r\n|\n|\r)/gm", "").split("=");
                    var_array[message_contents[i][0]] = message_contents[i][1];
                }
                console.log(var_array);
                network_process( var_array );
            }
		}	
    }

    request.send("type=read&user_id=" + localStorage.getItem("user_id") + "&win=1&points=10");
}

function network_process(var_array)
{
    console.log("Network_Process");
    switch(var_array["status"])
    {
        case "player_joined":
            add_network_player(var_array["name"]);
        case "pregame":
            add_network_player(var_array["name"]);
        case "starting":
            network_start_quiz(var_array);
    }

}

function network_start_quiz(var_array)
{
    if(localStorage.getItem("lobby_host") == "true") return;

    network_game1_string = var_array["game1"];
    network_game2_string = var_array["game2"];
    network_game3_string = var_array["game3"];
    network_game4_string = var_array["game4"];

    network_solution = var_array["solution"];

    start_quiz();
}

let prev_name = '';
function add_network_player( username )
{
    console.log("Network_Add_Player: " + username);
    if(username == localStorage.getItem("username")) return;
    if(prev_name == username) return;
    prev_name = username;
    let user_name = new Entity;
    user_name.label.text = username;
    user_name.position.x = 50;
    user_name.position.y = 50 + (25 * player_count);
    player_count++;
    print(player_count);
}

engine.render = function()
{
    
    engine.ctx.clearRect(0, 0, canvas.width, canvas.height);
    engine.ctx.fillStyle = '#1C1731';
    engine.ctx.fillRect(0, 0, engine.cnv.width, engine.cnv.height);

    entity_manager.draw();
}

function main_menu()
{
    lobby_id_str = new Entity;
    lobby_id_str.label.text = "Join Code: " + localStorage.getItem("lobby_id");
    lobby_id_str.position.x = 1280/2;
    lobby_id_str.position.y = 25;

    players = new Entity;
    players.label.text = "Players";
    players.position.x = 50;
    players.position.y = 25;

    user_name = new Entity;
    user_name.label.text = localStorage.getItem("username");
    user_name.position.x = 50;
    user_name.position.y = 50;

    if(localStorage.getItem("lobby_host") == "true")
    {
        //    start_btn = new_button();
        //    start_btn.position.x = 500;
        //    start_btn.position.y = 720/2;
        //    start_btn.label.text = "START";
        //    start_btn.tag = '0';
        //}
        timer_main = new_timer();
        timer_main.position.x = 1200;
        timer_main.position.y = 50;
        timer_main.nums.x = 10;
        timer_main.label.text = 10;
        timer_main.label.font = "64px serif"

        setTimeout(function() {
            start_quiz();
        }, 10000)
    }

    player_count++;

}

function game_over()
{
    round_count++;
    
    
    
    entity_manager.clear();

    if( round_count >= 10 ){
        text = new Entity;
        text.label.text =  "Game Over";
        text.position.x = 1280/2;
        text.position.y = 720/2;
        text.label.font = "72px serif"
        
        var request = new XMLHttpRequest();
        request.open("POST","network/request.php",true);
        request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    
        request.send("type=update_user_stats&user_id=" + localStorage.getItem("user_id") + "&win=1&points=10");

        return;
    }

    timer = new_timer();
    timer.position.x = 1200;
    timer.position.y = 50;
    timer.nums.x = 5;
    timer.label.text = 5;
    timer.label.font = "64px serif"

    text = new Entity;
    text.label.text =  "You were wrong.";
    if( correct ){
        text.label.text =  "Correct!";
    }
        text.position.x = 1280/2;
    text.position.y = 720/2;
    text.label.font = "72px serif"

    setTimeout(function() {
        entity_manager.clear();
    }, 5000)
    
    setTimeout(function() {
        start_quiz();
    }, 5000)

}


function start_quiz()
{
    entity_manager.clear();
    correct = false;
    solution_index = Math.floor(Math.random() * 4);
    let random_nums = [Math.floor(Math.random() * 100)];

    while(true)
    {
        if(random_nums.length == 4) break;
        num = Math.floor(Math.random() * 100);
        if( !random_nums.includes(num) ){
            random_nums.push(num);
        }

    }

    

    if( localStorage.getItem("lobby_host") == "true")
    {
        var request = new XMLHttpRequest();
        request.open("POST","network/request.php",true);
        request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        console.log("post");
        request.onreadystatechange = function(){
            if ((this.readyState == 4)&&(this.status == 200))
            {
                console.log(this.responseText);
            }	
        }
        request.send("type=lobby_update_status&lobby_id=" + localStorage.getItem("lobby_id") + "&status=1");

        var request = new XMLHttpRequest();
        request.open("POST","network/post.php",true);
        request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        console.log("post");
        request.onreadystatechange = function(){
            if ((this.readyState == 4)&&(this.status == 200))
            {
                console.log(this.responseText);
            }	
        }
        request.send("status=starting&game1=" + random_nums[0].toString() + 
        "&game2=" + random_nums[1].toString() + 
        "&game3=" + random_nums[2].toString() +
        "&game4=" + random_nums[3].toString() + 
        "&lobby_id=" + localStorage.getItem('lobby_id') + 
        "&solution=" + random_nums[solution_index].toString() +
        "&end=" + "200");
    }
    
    
    user_name = new Entity;
    user_name.label.text = localStorage.getItem("username");
    user_name.position.x = 50;
    user_name.position.y = 50;

    btn_1 = new_button();
    btn_1.position.x = 50;
    btn_1.position.y = 150;
    btn_1.label.text = game_list[random_nums[0].toString()]["1"];
    btn_1.tag = 0;

    btn_2 = new_button();
    btn_2.position.x = 50;
    btn_2.position.y = btn_1.position.y + 100;
    btn_2.label.text = game_list[random_nums[1].toString()]["1"];
    btn_2.tag = 1;

    btn_3 = new_button();
    btn_3.position.x = 50;
    btn_3.position.y = btn_2.position.y + 100;
    btn_3.label.text = game_list[random_nums[2].toString()]["1"];
    btn_3.tag = 2;

    btn_4 = new_button();
    btn_4.position.x = 50;
    btn_4.position.y = btn_3.position.y + 100;
    btn_4.label.text = game_list[random_nums[3].toString()]["1"];
    btn_4.tag = 3;

    timer = new_timer();
    timer.position.x = 1200;
    timer.position.y = 50;
    timer.label.text = 15;
    timer.nums.x = 15;
    timer.label.font = "64px serif"

    tags = new Entity;
    tags.label.text = game_list[random_nums[solution_index].toString()]["3"].replace("/,/g", ", ");
    tags.position.x = 800;
    tags.position.y = 300;

    l1 = new Entity;
    l1.label.text = game_list[random_nums[solution_index].toString()]["2"].replace("/" + game_list[random_nums[solution_index].toString()]["1"] + "/g", "___");
    l1.position.x = 800;
    l1.position.y = 400;

    solution_name = game_list[random_nums[solution_index].toString()]["1"];

    network_update();
    console.log(network_last_message);

    if(localStorage.getItem("lobby_host") == "false")
    {
        btn_1.label.text = game_list[network_game1_string]["1"];
        btn_2.label.text = game_list[network_game2_string]["1"];
        btn_3.label.text = game_list[network_game3_string]["1"];
        btn_4.label.text = game_list[network_game4_string]["1"];

        tags.label.text = game_list[network_solution]["3"].replace("/,/g", ", ");
        l1.label.text = game_list[network_solution]["2"].replace("/" + game_list[random_nums[solution_index].toString()]["1"] + "/g", "___");

        solution_name = game_list[network_solution]["1"]
    }

    console.log(solution_name);

    console.log("network update");
    

}

function send_update()
{
   

}

function add_session_var_from_server( session_var )
{
    var request = new XMLHttpRequest();
    request.open("POST","network/request.php",true);
	request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");

    request.onreadystatechange= function ()
	{
		if ((this.readyState == 4)&&(this.status == 200))
		{
            sessionStorage.setItem(session_var, json.parse(this.responseText));
			return;
		}		
	}
	request.send("type=get_session_var&var=" + session_var);
}