
class Vector2d {
    constructor()
    {
        this.x = 0;
        this.y = 0;
    }
}

class Vector3d {
    constructor()
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
}

class Rect {
    constructor()
    {
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
    }
}

class Label {
    constructor()
    {
        this.text = null;
        this.font = "24px serif";
        this.offset = new Vector2d();
        this.color = "#ffffff";
    }
}

class Mouse {
    constructor()
    {
        this.position = new Vector2d;
        this.event = null;
    }

    update()
    {
        this.event = null;
    }
}

class Player {
    constructor()
    {
        this.name = '';
        this.score = 0;
        this.has_guessed = false;
        this.win_streak = 0;
    }
}

class Game {
    constructor()
    {
       this.current_round = 0;
       this.max_rounds = 0;
       this.players = [];
       this.code = 0;
       
    }
}

class Entity {
    constructor()
    {
        this.position = new Vector2d;
        this.action = null;
        this.think = null;
        this.sprite = null;
        this.scale = new Vector2d;
        this.hitbox = new Rect;
        this.nums = new Vector3d;

        this.tag = '';
        this.label = new Label;

        entity_manager.entity_list.push(this);
        entity_manager.entity_count ++;
        console.log("New entity instantiated");
    }

    entity_think()
    {
        if(this.think != null) this.think(this);
    }

    entity_update()
    {
        this.hitbox.x = this.position.x;
        this.hitbox.y = this.position.y;

        if(this.update != null) this.update();
    }

    entity_scale( scale )
    {
        this.scale = scale;
        this.hitbox.w = this.sprite.width * this.scale.x;
        this.hitbox.h = this.sprite.height * this.scale.y;

        
        this.label.offset.x = ( this.sprite.width * this.scale.x ) / 2;
        this.label.offset.y = ( this.sprite.height * this.scale.y ) / 2;

        if( this.label.text == "Rust"){
            correct = true;
        }

    }
}

class Entity_Manager {
    constructor()
    {
        this.entity_list = new Array();
        this.entity_count = 0;
    }

    update()
    {
        for( let i = 0; i < this.entity_count; i++){
            this.entity_list[i].entity_update();
        }
    }

    think()
    {
        for( let i = 0; i < this.entity_count; i++){
            this.entity_list[i].entity_think();
        }
    }

    clear()
    {
        entity_manager.entity_list = [];
        entity_manager.entity_count = 0;

    }

    draw()
    {
        for( let i = 0; i < this.entity_count; i++){
            let ent = this.entity_list[i];

            if(  ent.sprite )
            {
                engine.ctx.drawImage( 
                    ent.sprite, 
                    0, 
                    0, 
                    ent.sprite.width, 
                    ent.sprite.height, 
                    ent.position.x, 
                    ent.position.y, 
                    ent.sprite.width * ent.scale.x, 
                    ent.sprite.height * ent.scale.y
                )
            }
            engine.ctx.font = ent.label.font;
            engine.ctx.fillStyle = ent.label.color;
            engine.ctx.textAlign = "center";
            engine.ctx.textBaseline = "middle";
            engine.ctx.fillText( ent.label.text, ent.position.x + ent.label.offset.x,  ent.position.y + ent.label.offset.y );

           // engine.ctx.move(ent.hitbox.x, ent.hitbox.y);


        }
        
    }

}

var entity_manager = new Entity_Manager;
