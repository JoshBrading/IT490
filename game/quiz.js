var engine = new Engine();
var correct = false;



window.onload = function()
{
    engine.start();
}

engine.init = function()
{
    console.log("init");

    start_quiz();
}

engine.update = function()
{
    entity_manager.think();
    entity_manager.update();

    // Update mouse last!
    engine.mouse.update();
}

engine.render = function()
{
    
    engine.ctx.clearRect(0, 0, canvas.width, canvas.height);
    engine.ctx.fillStyle = '#1C1731';
    engine.ctx.fillRect(0, 0, engine.cnv.width, engine.cnv.height);

    entity_manager.draw();
}

function game_over()
{
    console.log("Game Over");
    entity_manager.clear();

    timer = new_timer();
    timer.position.x = 1200;
    timer.position.y = 50;
    timer.nums.x = 5;
    timer.label.text = 5;
    timer.label.font = "64px serif"

    text = new Entity;
    text.label.text =  "You were wrong.";
    if( correct ) text.label.text =  "Correct!";
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
    correct = false;
    console.log("init");

    btn_1 = new_button();
    btn_1.position.x = 50;
    btn_1.position.y = 150;
    btn_1.label.text = "Counter Strike: Global Offensive";
    btn_1.label.font = "22px serif"

    btn_2 = new_button();
    btn_2.position.x = 50;
    btn_2.position.y = btn_1.position.y + 100;
    btn_2.label.text = "Call of Duty: Modern Warfare II";
    btn_2.label.font = "22px serif"

    btn_3 = new_button();
    btn_3.position.x = 50;
    btn_3.position.y = btn_2.position.y + 100;
    btn_3.label.text = "Team Fortress 2";

    btn_4 = new_button();
    btn_4.position.x = 50;
    btn_4.position.y = btn_3.position.y + 100;
    btn_4.label.text = "Rust";

    timer = new_timer();
    timer.position.x = 1200;
    timer.position.y = 50;
    timer.label.text = 15;
    timer.nums.x = 15;
    timer.label.font = "64px serif"

    tags = new Entity;
    tags.label.text = "FPS, PvP, PvE"
    tags.position.x = 800;
    tags.position.y = 300;

    l1 = new Entity;
    l1.label.text = "The only aim in ________ is to survive.";
    l1.position.x = 800;
    l1.position.y = 400;

    l2 = new Entity;
    l2.label.text = "Everything wants you to die - the island’s wildlife and other inhabitants,";
    l2.position.x = 800;
    l2.position.y = 430;

    l3 = new Entity;
    l3.label.text =  "the environment, other survivors. Do whatever it takes to last another night.";
    l3.position.x = 800;
    l3.position.y = 460;
}