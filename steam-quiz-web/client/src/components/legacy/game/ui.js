class UIText {
    constructor()
    {
        this.text = null;
        this.font = "24px serif";
        this.offset = new Vector2d();
        this.color = "#ffffff";
    }
}

class UIButton {
    constructor()
    {
        this.on_press = null;
        this.label = new UIText();
    }
}

class UIImage {
    constructor()
    {
        this.image = null;
        this.position = new Vector2d;
    }
}

class UIMenu {
    constructor()
    {
        this.enabled = false;
        this.tag = null;

        this.buttons = [];
        this.labels = [];
        this.dropdowns = [];
        this.button = new UIButton;
        
        this.background = null;
    }
}
