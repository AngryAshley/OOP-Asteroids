interface HiScore{
    playerName: string;
    score: number;
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
    public startButtonX: number;
    public startButtonY: number;
    public startButtonW: number;
    public startButtonH: number;

    public constructor(canvasId: HTMLCanvasElement) {
        //construct all canvas
        this.canvas = canvasId;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.w = this.canvas.width;
        this.h = this.canvas.height;
        this.centerW = this.w/2;
        this.centerH = this.h/2;
        canvas.addEventListener('click', (event) => {this.checkClick(event)});
        
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

        // all screens: uncomment to activate 
        this.start_screen();
        //this.level_screen();
        //this.title_screen();

    }


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
        this.drawAsteroid(this.centerW,this.centerH+40,1.5);
    }

    /**
     * Writes the asteroid heading
     * @param number deviation from center height
     */
    public writeAsteroidHeading(dev: number){
        this.ctx.font = "150px Minecraft";
        this.ctx.fillText("Asteroids", this.centerW, this.centerH+dev);
    };
    /**
     * Writes the intro text
     * @param number deviation from center height
     */
    public writeIntroText(dev: number){
        this.ctx.font = "30px Minecraft";
        this.ctx.fillText("Press to pray", this.centerW, this.centerH+dev);
    }
    public writeStartButton(dev: number, width: number, height: number){
        //this.ctx.fillStyle = "White";
        //this.ctx.fillRect(this.centerW-(width/2), this.centerH+dev, width, height);
        let image: HTMLImageElement = new Image();
    image.onload = () => {
        let ctx=this.canvas.getContext("2d");
        ctx.drawImage(<CanvasImageSource>image,this.centerW-(image.width/2)+28,this.centerH+dev,width, height);
        this.startButtonX = this.centerW-(image.width/2)+28;
        this.startButtonY = this.centerH+dev;
        this.startButtonW = width;
        this.startButtonH = height;
        //ctx.drawImage(<CanvasImageSource>image,-image.width*s/2,-image.height*s/2, image.width*s, image.height*s);
        this.ctx.font = "50px Minecraft";
        this.ctx.fillStyle = "Black";
        this.ctx.fillText("PRAY", this.centerW, this.centerH+dev+48)
    }
    image.src = ".\\assets\\images\\SpaceShooterRedux\\PNG\\UI\\buttonBlue.png";    
    };

    public pressStart(){
        let image: HTMLImageElement = document.createElement("img")
        image.src = ".\\assets\\images\\SpaceShooterRedux\\PNG\\UI\\PRAISE.png";
        image.id = "PRAIS_GESUS";
        document.body.appendChild(image);
        image.style.zIndex = "10";
        image.style.position = "absolute";
        image.style.marginTop = "-650px";
        image.style.marginLeft = "100px";
        setTimeout(() => {
            document.body.removeChild(image);
        }, 1000)
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
            
        window.requestAnimationFrame(() => this.drawAsteroid(x,y,s))
        }
        image.src = ".\\assets\\images\\SpaceShooterRedux\\PNG\\Meteors\\meteorBrown_big3.png";
    }

    public checkClick(event: MouseEvent){
            if (
                event.x > this.startButtonX && 
                event.x < this.startButtonX + this.startButtonW &&
                event.y > this.startButtonY && 
                event.y < this.startButtonY + this.startButtonH
              ) {
                this.pressStart();
              }
    }
    //-------- level screen methods -------------------------------------
    /**
     * Function to initialize the level screen
     */
    public level_screen() {
        for(let i=0; i<this.lives; i++){
            let image: HTMLImageElement = new Image()
            image.onload = () => {
                let ctx=this.canvas.getContext("2d");
                ctx.drawImage(<CanvasImageSource>image,50+(i*33),50);
            }
            image.src=".\\assets\\images\\SpaceShooterRedux\\PNG\\UI\\playerLife1_blue.png";
        console.log("Draw");
        }

        this.ctx.fillStyle = "White";
        this.ctx.font = "30px Minecraft";
        this.ctx.fillText(`Score: ${this.score}`, this.w-300,75);

        let c: string, s: string, n: number;
        let rand = this.randomNumber(2,20);
        for(let i=0; i<rand; i++){
            let image: HTMLImageElement = new Image()
            image.onload = () => {
                let ctx=this.canvas.getContext("2d");
                ctx.drawImage(<CanvasImageSource>image,this.randomNumber(0,this.w),this.randomNumber(100,this.h));
            }
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
            image.src=`.\\assets\\images\\SpaceShooterRedux\\PNG\\Meteors\\Meteor${c}_${s}${n}.png`;
        }
        
        let image: HTMLImageElement = new Image()
            image.onload = () => {
                let ctx=this.canvas.getContext("2d");
                ctx.drawImage(<CanvasImageSource>image,this.centerW-(image.width/2),this.centerH-(image.height/2));
            }
        image.src = ".\\assets\\images\\SpaceShooterRedux\\PNG\\playerShip1_blue.png";
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

    /**
    * Renders a random number between min and max
    * @param {number} min - minimal time
    * @param {number} max - maximal time
    */
    public randomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min) + min);
    };
    

    
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

