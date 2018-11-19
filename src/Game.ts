interface HiScore{
    playerName: string;
    score: number;
}

interface Button{
    x: number;
    y: number;
    w: number;
    h: number;
    func: string;
}

interface asteroid{
    x: number;
    y: number;
    dir: number;
    sprite: string;
    speed: number;
}
interface SpriteSheetTexture {
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

class Game {
    //global attr for canvas
    //readonly attributes must be initialized in the constructor
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;

    //some global player attributes
    private readonly player: string = "Player1";
    private score: number = 400;
    private lives: number = 3;
    private readonly highscores: Array<HiScore>; 
    private mousePos: MousePos;
    private w: number;
    private h: number;
    private centerW: number;
    private centerH: number;
    private rotSpeed: number = 40;
    private leftPressed: boolean;
    private upPressed: boolean;
    private rightPressed: boolean;
    private downPressed: boolean;
    private asteroidPresent: boolean = false;

    private shipX: number = 50;
    private shipY: number = 37;
    private shipOldX: number = 50;
    private shipOldY: number = 37;
    private shipOldRot: number = 0;
    private shipSpeed: number = 0.5;
    private shipXSpeed: number = 0;
    private shipYSpeed: number = 0;
    private shipRot: number = 0;

    public debug: boolean = true;
    public buttonArray: Array<Button>;
    public asteroidArray: Array<asteroid>; 
    private readonly spriteMapImage: HTMLImageElement;
    public spriteMapData: SpriteSheetTexture[];

    public constructor(canvasId: HTMLCanvasElement) {
        //construct all canvas
        this.canvas = canvasId;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.w = this.canvas.width;
        this.h = this.canvas.height;
        this.centerW = this.w/2;
        this.centerH = this.h/2;
        this.asteroidArray = [];
        this.buttonArray = [];
        canvas.addEventListener('click', (event) => {this.checkClick(event)});

        this.spriteMapImage = new Image;
        this.spriteMapImage.addEventListener('load', () => {
            fetch('./assets/images/SpaceShooterRedux/Spritesheet/sheet.xml')
                .then((response) => {
                    return response.text()
                })
                .then((str) => {
                    let parser = new DOMParser();
                    this.spriteMapData = [];
                    //<SubTexture name="beam0.png" x="143" y="377" width="43" height="31"/>
                    Array.prototype.forEach.call(parser.parseFromString(str, "text/xml").getElementsByTagName("SubTexture"), (e: Element) => {
                        let atts = e.attributes;
                        this.spriteMapData.push({name: atts[0].nodeValue, x: parseInt(atts[1].nodeValue), y: parseInt(atts[2].nodeValue), width: parseInt(atts[3].nodeValue), height: parseInt(atts[4].nodeValue)});
                    });
                    console.table(this.spriteMapData);
                }).then(() => {
                    //this.start_screen();
                });
        });
        this.spriteMapImage.src = "./assets/images/SpaceShooterRedux/Spritesheet/sheet.png";
        
        //set the context of the canvas
        this.ctx = this.canvas.getContext('2d');

        this.highscores = [
            {
                playerName: 'Loek',
                score: 40000
            },
            {
                playerName: 'Daan',
                score: 34000
            },
            {
                playerName: 'Rimmert',
                score: 200
            }
        ]

        this.buttonArray = [
        ]

        // all screens: uncomment to activate 
        this.start_screen();
        //this.level_screen();
        //this.title_screen();
        //this.extraOpdracht();

    }

/* ----------------------------------- Physics engine -----------------------------------
    public G: number = 981.0;
    public A: number;
    public ticks: number = 0;
    public Xspeed: number = 0;
    public Yspeed: number = 0;
    public xOld: number=0;
    public yOld: number=0;
    public x: number = 600;
    public y: number = 0;
    public mass: number = 100;
    public seconds: number = 0;
    public oldTime: number = 0;
    public Fg: number;
    public V: number;
    public resistance: number = 1.5;
    public extraOpdracht(){
        window.setInterval(() => this.tick(), 1000/60);
    }
    public physics(){
        let difference = this.seconds - this.oldTime;
        let FgPrev: number = 0;
        //his.Fg = this.mass*this.G;
        //this.A = (this.Fg/this.mass);
        this.y = this.y+this.Yspeed*difference+0.5*this.G*difference*difference;
        this.Yspeed = this.Yspeed+this.G*difference;
        
        this.oldTime = this.seconds;
    }
    public tick(){
        this.yOld = this.y;
        this.xOld = this.x;
        this.ticks++;
        this.seconds = this.ticks/60;
        //this.y = this.y + this.Yspeed;
        if(this.y>this.canvas.height){
            this.Yspeed = -this.Yspeed/this.resistance; 
            this.y = this.canvas.height; 
            ;
        }

        this.physics();
        this.ctx.clearRect(0,0,200,200);
        this.writeText(`Force: ${this.Fg}`,50, 50, 20, "white", "left");
        this.writeText(`Time: ${this.seconds}`,50, 75);
        this.writeText(`A: ${this.A}`,50, 100);
        this.writeText(`Ticks: ${this.ticks}`,50, 125);
        this.writeText(`ShipY: ${this.y}`,50, 150);
        this.writeText(`ShipX: ${this.x}`,50, 175);
        this.writeText(`ShipV: ${this.Yspeed}`,50, 200);
        

        this.drawSpaceShip();

    }

    public drawSpaceShip(){
        let image: HTMLImageElement = new Image()
            image.onload = () => {
                this.ctx.clearRect(this.xOld,this.yOld-image.height-50,image.width, image.height+50)
                let ctx=this.canvas.getContext("2d");
                ctx.drawImage(<CanvasImageSource>image,this.x,this.y-image.height);
            }
        image.src = ".\\assets\\images\\SpaceShooterRedux\\PNG\\playerShip1_blue.png";
    }
    */
    

    //-------- Splash screen methods ------------------------------------
    /**
     * Function to initialize the splash screen
     */

    public start_screen() {
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        
        this.writeAsteroidHeading(-100);
        this.writeIntroText(175);
        this.writeStartButton(200, 160, 60);
        this.asteroidPresent = true;
        this.drawAsteroid(this.centerW,this.centerH+40,1.5);
    }

    /**
     * Writes the asteroid heading
     * @param number deviation from center height
     */
    public writeAsteroidHeading(dev: number){
        this.writeText("Asteroids", this.centerW, this.centerH+dev, 150);
    };
    /**
     * Writes the intro text
     * @param number deviation from center height
     */
    public writeIntroText(dev: number){
        this.writeText("Press to pray", this.centerW, this.centerH+dev, 30);
    }
    public writeStartButton(dev: number, width: number, height: number){
        //this.ctx.fillStyle = "White";
        //this.ctx.fillRect(this.centerW-(width/2), this.centerH+dev, width, height);
        let image: HTMLImageElement = new Image();
    image.onload = () => {
        let ctx=this.canvas.getContext("2d");
        ctx.drawImage(<CanvasImageSource>image,this.centerW-(image.width/2)+28,this.centerH+dev,width, height);
        this.buttonArray.push({
            x: this.centerW-(image.width/2)+28,
            y: this.centerH+dev,
            w: width,
            h: height,
            func: "this.pressStart()"
        })
        //this.startButtonX = this.centerW-(image.width/2)+28;
        //this.startButtonY = this.centerH+dev;
        //this.startButtonW = width;
        //this.startButtonH = height;
        //ctx.drawImage(<CanvasImageSource>image,-image.width*s/2,-image.height*s/2, image.width*s, image.height*s);
        this.writeText("PRAY", this.centerW, this.centerH+dev+48, 50, "Black");
    }
    image.src = ".\\assets\\images\\SpaceShooterRedux\\PNG\\UI\\buttonBlue.png";  

    };

    public pressStart(){
        /*
        let image: HTMLImageElement = document.createElement("img")
        image.src = ".\\assets\\images\\SpaceShooterRedux\\PNG\\UI\\PRAISE.png";
        image.id = "PRAIS_GESUS";
        document.body.appendChild(image);
        image.style.zIndex = "10";
        image.style.position = "absolute";
        image.style.marginTop = "-650px";
        image.style.marginLeft = "100px";
        setTimeout(() => { document.body.removeChild(image); }, 1000)
        */
       this.destroyAsteroid();
       this.level_screen();
    }

    public drawAsteroid(x: number, y: number, s: number){
        let image: HTMLImageElement = new Image(),
            time: Date = new Date(),
            trans = {x: x, y: y}
            ;
        image.onload = () => {
        let rot = ((this.rotSpeed * Math.PI) / 60)* time.getSeconds() + ((this.rotSpeed * Math.PI) / 60000) * time.getMilliseconds()
            let ctx=this.canvas.getContext("2d");
            ctx.save();
            ctx.clearRect(x-image.width*s/2-6,y-image.width*s/2-6,image.width*2,image.height*2);
            ctx.translate(trans.x, trans.y)
            ctx.rotate(rot);
            //ctx.drawImage(<CanvasImageSource>image,x-(image.width*s/2),y,image.width*s, image.height*s);
            ctx.drawImage(<CanvasImageSource>image,-image.width*s/2,-image.height*s/2, image.width*s, image.height*s);
            ctx.rotate(-rot);
            ctx.translate(-trans.x, -trans.y)
            ctx.restore();
            if(this.asteroidPresent){window.requestAnimationFrame(() => this.drawAsteroid(x,y,s))}
        }
        image.src = ".\\assets\\images\\SpaceShooterRedux\\PNG\\Meteors\\meteorBrown_big3.png";
    }
    public destroyAsteroid(){
        this.asteroidPresent = false;
    }

    public checkClick(event: MouseEvent){
        for(let i = 0; i<this.buttonArray.length; i++){
            if (
                event.x > this.buttonArray[i].x && 
                event.x < this.buttonArray[i].x + this.buttonArray[i].w &&
                event.y > this.buttonArray[i].y && 
                event.y < this.buttonArray[i].y + this.buttonArray[i].h
              ) {
                eval(this.buttonArray[i].func);
                break;
              }
        }
    }
    //-------- level screen methods -------------------------------------
    /**
     * Function to initialize the level screen
     */
    public level_screen() {
        this.ctx.clearRect(0,0,this.w,this.h)
        this.buttonArray = [];

        window.addEventListener("keydown", (event) => this.keyDownHandler(event),false);
        window.addEventListener("keyup", (event) => this.keyUpHandler(event),false);


        

        for(let i = this.randomNumber(2,20); i>0; i--){
            this.Asteroid_Construct()
        }
        
        
        //------------ Render SpaceShip ------------
        this.Spaceship_construct();
        window.setInterval(() => this.tick(), 1000/30);

    }

    tick(){
        if(this.debug){this.Debug_render()}
        this.Spaceship_render();
        this.Asteroid_render();
        this.UI_render();
        
    }
    UI_render(){
        for(let i=0; i<this.lives; i++){
            let image: HTMLImageElement = new Image()
            image.onload = () => {
                this.ctx.clearRect(50+(i*33),50,image.width,image.height)
                this.ctx.drawImage(<CanvasImageSource>image,50+(i*33),50);
            }
            image.src=".\\assets\\images\\SpaceShooterRedux\\PNG\\UI\\playerLife1_blue.png";
        }
        this.ctx.clearRect(this.w-310,50,310,25)
        this.writeText(`Score ${this.score}`, this.w-300,75,30,"white");
    }
    Debug_render(){
        this.ctx.clearRect(50,100,400,200);
        this.writeText(`shipX: ${this.shipX}`,50, 125, 20, "white", "left");
        this.writeText(`shipY: ${this.shipY}`,50, 150, 20, "white", "left");
        this.writeText(`XSpeed: ${this.shipXSpeed}`,50, 175, 20, "white", "left");
        this.writeText(`YSpeed: ${this.shipYSpeed}`,50, 200);
        this.writeText(`Rot: ${this.shipRot}`,50, 225);
    }

    Spaceship_construct(){
        let image: HTMLImageElement = new Image()
        image.src = ".\\assets\\images\\SpaceShooterRedux\\PNG\\playerShip1_blue.png";
        this.shipX = this.centerW-(image.width/2)
        this.shipY = this.centerH-(image.height/2);
    }
    Spaceship_render(){
        let image: HTMLImageElement = new Image()
        image.src = ".\\assets\\images\\SpaceShooterRedux\\PNG\\playerShip1_blue.png";
        
        this.ctx.save();
        this.ctx.translate(this.shipX, this.shipY)
        this.ctx.rotate(this.shipRot*Math.PI/180);
        this.ctx.clearRect(-image.width/2-5,-image.height/2-5,image.width+10, image.height+10)
        //this.ctx.fillStyle = "white"
        //this.ctx.fillRect(-image.width/2-5,-image.height/2-5,image.width+10, image.height+10)
        this.ctx.rotate(-this.shipRot*Math.PI/180);
        this.ctx.translate(-this.shipX, -this.shipY)
        this.ctx.restore();
        
        if(this.leftPressed){this.shipRot-=4};
        if(this.rightPressed){this.shipRot+=4};
        if(this.shipRot>359){this.shipRot = 0};
        if(this.shipRot<0){this.shipRot = 359};
        if(this.upPressed){
            this.shipXSpeed -= (this.shipSpeed*Math.sin(-this.shipRot*Math.PI/180))/2;
            this.shipYSpeed -= (this.shipSpeed*Math.cos(-this.shipRot*Math.PI/180))/2;
        };
        if(this.downPressed){
            this.shipXSpeed += (this.shipSpeed*Math.sin(-this.shipRot*Math.PI/180))/2;
            this.shipYSpeed += (this.shipSpeed*Math.cos(-this.shipRot*Math.PI/180))/2;
        };

            this.shipX += this.shipXSpeed;
            this.shipY += this.shipYSpeed;

            if (this.shipX < -image.width-10){
                this.shipX = this.w+image.width+5;
            }
            if(this.shipX > this.w+image.width+10){
                this.shipX = -image.width-5;
            }
            if(this.shipY < -image.height-10){
                this.shipY = this.h + image.height+5
            }
            if(this.shipY > this.h+image.height+10){
                this.shipY = -image.height-5;
            }
            

        

        

            image.onload = () => {
                this.ctx.save();
                this.ctx.translate(this.shipX, this.shipY)
                this.ctx.rotate(this.shipRot*Math.PI/180);
                //ctx.drawImage(<CanvasImageSource>image,x-(image.width*s/2),y,image.width*s, image.height*s);
                this.ctx.drawImage(<CanvasImageSource>image,-image.width/2,-image.height/2);
                this.ctx.rotate(-this.shipRot*Math.PI/180);
                this.ctx.translate(-this.shipX, -this.shipY)
                this.ctx.restore();
            }
            this.shipOldX = this.shipX
            this.shipOldY = this.shipY
            this.shipOldRot = this.shipRot
    }

    Asteroid_Construct(){
        let c: string, s: string, n: number, sprite: string;
        let rand = this.randomNumber(2,20);
        for(let i=0; i<rand; i++){
 
            switch(this.randomNumber(0,2)){
                case 0: c = "Brown"; break;
                case 1: c = "Grey"; break;
                default: c = "Brown"; break;
            }
            switch(this.randomNumber(0,3)){
                case 0: s = "big"; break;
                case 1: s = "med"; break; 
                case 2: s = "small"; break;
                case 3: s = "tiny"; break;
            }
            if(s=="big"){n=this.randomNumber(1,4)} else {n=this.randomNumber(1,2)};
            sprite =`.\\assets\\images\\SpaceShooterRedux\\PNG\\Meteors\\Meteor${c}_${s}${n}.png`;
        }
        this.asteroidArray.push({
            x: this.randomNumber(0,this.w),
            y: this.randomNumber(0,this.h),
            dir: this.randomNumber(0,359),
            sprite: sprite,
            speed: this.randomNumber(2,6)
        })
    }
    public Asteroid_render(){
        for(let i = 0; i<this.asteroidArray.length; i++){
            let image: HTMLImageElement = new Image()
            /*
            let image = this.spriteMapData.filter(obj => {
                return obj.name === this.asteroidArray[i].sprite
            })[0];

            for(let o=this.spriteMapData.length; o>0;o--){
                if(this.spriteMapData[o].name == this.asteroidArray[i].sprite){
                    let image = this.spriteMapData[o].name
                }
            }
           */ 
            //if (!image) return null;
            

            let remove: boolean = false;
            image.src = this.asteroidArray[i].sprite;

            this.ctx.clearRect(this.asteroidArray[i].x,this.asteroidArray[i].y,image.width,image.height);
            this.asteroidArray[i].x += this.asteroidArray[i].speed*Math.sin(-this.asteroidArray[i].dir*Math.PI/180);
            this.asteroidArray[i].y += this.asteroidArray[i].speed*Math.cos(-this.asteroidArray[i].dir*Math.PI/180);

            
            if (this.asteroidArray[i].x < -100 || this.asteroidArray[i].x > this.canvas.width+100 || this.asteroidArray[i].y < -100 || this.asteroidArray[i].y > this.canvas.height+100){
                this.asteroidArray.splice(i,1);
                this.Asteroid_Construct();
                remove = true;
                i=i-1;
            }
            
            if(!remove){
            this.ctx.drawImage(<CanvasImageSource>image,this.asteroidArray[i].x,this.asteroidArray[i].y);
            //this.ctx.drawImage(this.spriteMapImage, image.x, image.y, image.width, image.height, this.asteroidArray[i].x, this.asteroidArray[i].y, image.width, image.height);
            }
        }
    }
    

    //-------- Title screen methods -------------------------------------

    /**
    * Function to initialize the title screen   
    */
    public title_screen() {
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.font = "75px Minecraft";
        this.ctx.fillText(`Yer score be ${this.score} matey!`, this.centerW, this.centerH-150);
        
        //2. draw all highscores
        this.ctx.font = "50px Minecraft";
        this.ctx.fillText("HISCORES", this.centerW, this.centerH);

        this.ctx.font = "30px Minecraft";
        for(let i=0; i<this.highscores.length; i++){
            this.ctx.fillText(`${this.highscores[i].playerName} ${this.highscores[i].score}`, this.centerW, this.centerH+50+(i*40));
        }

        this.ctx.font = "40px Minecraft";
        for(let i=this.highscores.length-1; i>=0; i--){
            console.log(`checking ${i}`)
            if(this.highscores[i].score>this.score){
                console.log(`number index is now ${i}`)
                i++
                if(i<=this.highscores.length){
                    this.ctx.fillText(`You beat ${this.highscores[i].playerName}, congratulations!`, this.centerW, this.centerH+50+140);
                    break;
                } else {
                    this.ctx.fillText(`You did not get a highscore, try again!`, this.centerW, this.centerH+50+140);
                    break;
                };
            } else if(i==0){
                this.ctx.font = "60px Minecraft";
                this.ctx.fillText(`CONGLATURATIONS, A WINNER IS YOU!`, this.centerW, this.centerH+50+160);
                break;
            }
        }
    }

    //-------Generic canvas functions ----------------------------------

    public writeText(text: string, x: number, y: number, size?: number, color?: string, align?: CanvasTextAlign){
        if(size!=undefined){this.ctx.font = `${size}px Minecraft`;};
        if(color!=undefined){this.ctx.fillStyle = color;};
        if(align!=undefined){this.ctx.textAlign = align;};
        this.ctx.fillText(text, x, y);
    }

    /**
    * Renders a random number between min and max
    * @param {number} min - minimal time
    * @param {number} max - maximal time
    */
    public randomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min) + min);
    };

    private keyDownHandler(event: KeyboardEvent){
        console.log("KEYPRESS");
        switch(event.keyCode){
            case 37: this.leftPressed = true; break;
            case 38: this.upPressed = true; break;
            case 39: this.rightPressed = true; break;
            case 40: this.downPressed = true; break;
        }
    }
    private keyUpHandler(event: KeyboardEvent){
        switch(event.keyCode){
            case 37: this.leftPressed = false; break;
            case 38: this.upPressed = false; break;
            case 39: this.rightPressed = false; break;
            case 40: this.downPressed = false; break;
        }
    }
    

    
}

//this will get an HTML element. I cast this element in de appropriate type using <>
let init = function () {
    const Asteroids = new Game(<HTMLCanvasElement>document.getElementById('canvas'));
};

interface Event{
    clientX: number;
    clientY: number;
}
interface Rect{
    x: number;
    y: number;
    width: number;
    height: number;
}
interface MousePos{
    x: number;
    y: number;
}

var canvas = document.getElementById('canvas')




//add loadlistener for custom font types
window.addEventListener('load', init);

