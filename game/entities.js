// Timer Start

function new_timer()
{
    let timer = new Entity;
    timer.think = timer_think;
    timer.nums.y = 0;
    timer.nums.x = 2;


    return timer;
}

function timer_think( self )
{
    console.log(self.sprite)
    if( self.nums.y == 60)
    {
        self.nums.x--;
        if(  self.nums.x >= 0 ){  
            self.label.text = self.nums.x.toString();
        }
        self.nums.y = 0;
    }
    if( self.nums.x == -2 )
    {
        game_over();
    }
    
    self.nums.y += 1;
}

// Timer End

// Button Start

function new_button()
{
    let button = new Entity;
    button.think = button_think;
    button.sprite = new Image();
    button.sprite.src = "button.png"
    button.scale.x = 0.5;
    button.scale.y = 0.5;
    button.sprite.width = 600;
    button.sprite.height = 144;

    button.hitbox.w = button.sprite.width * button.scale.x;
    button.hitbox.h = button.sprite.height * button.scale.y;

    test = new Image();
    test.src = "button.png";

    console.log(test.width);

    button.label.offset.x = ( button.sprite.width * button.scale.x ) / 2;
    button.label.offset.y = ( button.sprite.height * button.scale.y ) / 2;

    return button;
}

function button_think( self )
{
    if( engine.mouse.event )
    {

        if( collision_point_rect( engine.mouse.position, self.hitbox ))
        {
            old = new Vector2d;
            old.x = self.hitbox.w;
            old.y = self.hitbox.h;

            scale = new Vector2d;
            scale.x = 0.4;
            scale.y = 0.4;

            self.entity_scale( scale );

            offset = new Vector2d;
            offset.x = (old.x - self.hitbox.w) / 2;
            offset.y = (old.y - self.hitbox.h) / 2;

            self.position.x += offset.x;
            self.position.y += offset.y;
        }
    }

}

// Button End