class Engine {
    constructor() 
    {
        this.fps = 60;
        this.ctx = null;
        this.cnv = null;
        this.loop = null;
        this.mouse = new Mouse;
    }

    canvas_init() 
    {
        this.cnv = document.getElementById('canvas');
        this.ctx = this.cnv.getContext('2d')

        this.cnv.addEventListener('click', function(e) {
            mouse_click(canvas, e)
        })

        document.body.style.padding = 0;
        document.body.style.margin = 0;
        canvas.width = 1280;
        canvas.height = 720;
    }

    init() 
    {
        
    }

    update() 
    {
        
    }

    render()
    {

    }

    start()
    {
        console.log("start");
        this.canvas_init();
        this.init();

        this.loop = setInterval(
            () => {
            this.update();
            this.render();
            },
            1000/this.fps
        );

    }


}