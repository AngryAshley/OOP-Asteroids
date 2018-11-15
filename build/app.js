class Game {
    constructor(canvasId) {
        this.player = "Player1";
        this.score = 400;
        this.lives = 3;
        this.rotSpeed = 40;
        this.canvas = canvasId;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.w = this.canvas.width;
        this.h = this.canvas.height;
        this.centerW = this.w / 2;
        this.centerH = this.h / 2;
        canvas.addEventListener('click', (event) => { this.checkClick(event); });
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
        ];
        this.start_screen();
    }
    start_screen() {
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.writeAsteroidHeading(-100);
        this.writeIntroText(175);
        this.writeStartButton(200, 160, 60);
        this.drawAsteroid(this.centerW, this.centerH + 40, 1.5);
    }
    writeAsteroidHeading(dev) {
        this.ctx.font = "150px Minecraft";
        this.ctx.fillText("Asteroids", this.centerW, this.centerH + dev);
    }
    ;
    writeIntroText(dev) {
        this.ctx.font = "30px Minecraft";
        this.ctx.fillText("Press to pray", this.centerW, this.centerH + dev);
    }
    writeStartButton(dev, width, height) {
        let image = new Image();
        image.onload = () => {
            let ctx = this.canvas.getContext("2d");
            ctx.drawImage(image, this.centerW - (image.width / 2) + 28, this.centerH + dev, width, height);
            this.startButtonX = this.centerW - (image.width / 2) + 28;
            this.startButtonY = this.centerH + dev;
            this.startButtonW = width;
            this.startButtonH = height;
            this.ctx.font = "50px Minecraft";
            this.ctx.fillStyle = "Black";
            this.ctx.fillText("PRAY", this.centerW, this.centerH + dev + 48);
        };
        image.src = ".\\assets\\images\\SpaceShooterRedux\\PNG\\UI\\buttonBlue.png";
    }
    ;
    pressStart() {
        let image = document.createElement("img");
        image.src = ".\\assets\\images\\SpaceShooterRedux\\PNG\\UI\\PRAISE.png";
        image.id = "PRAIS_GESUS";
        document.body.appendChild(image);
        image.style.zIndex = "10";
        image.style.position = "absolute";
        image.style.marginTop = "-650px";
        image.style.marginLeft = "100px";
        setTimeout(() => {
            document.body.removeChild(image);
        }, 1000);
    }
    drawAsteroid(x, y, s) {
        let image = new Image(), time = new Date(), trans = { x: x, y: y };
        image.onload = () => {
            let rot = ((this.rotSpeed * Math.PI) / 60) * time.getSeconds() + ((this.rotSpeed * Math.PI) / 60000) * time.getMilliseconds();
            let ctx = this.canvas.getContext("2d");
            ctx.save();
            ctx.clearRect(x - image.width * s / 2 - 6, y - image.width * s / 2 - 6, image.width * 2, image.height * 2);
            ctx.translate(trans.x, trans.y);
            ctx.rotate(rot);
            ctx.drawImage(image, -image.width * s / 2, -image.height * s / 2, image.width * s, image.height * s);
            ctx.rotate(-rot);
            ctx.translate(-trans.x, -trans.y);
            ctx.restore();
            window.requestAnimationFrame(() => this.drawAsteroid(x, y, s));
        };
        image.src = ".\\assets\\images\\SpaceShooterRedux\\PNG\\Meteors\\meteorBrown_big3.png";
    }
    checkClick(event) {
        if (event.x > this.startButtonX &&
            event.x < this.startButtonX + this.startButtonW &&
            event.y > this.startButtonY &&
            event.y < this.startButtonY + this.startButtonH) {
            this.pressStart();
        }
    }
    level_screen() {
        for (let i = 0; i < this.lives; i++) {
            let image = new Image();
            image.onload = () => {
                let ctx = this.canvas.getContext("2d");
                ctx.drawImage(image, 50 + (i * 33), 50);
            };
            image.src = ".\\assets\\images\\SpaceShooterRedux\\PNG\\UI\\playerLife1_blue.png";
            console.log("Draw");
        }
        this.ctx.fillStyle = "White";
        this.ctx.font = "30px Minecraft";
        this.ctx.fillText(`Score: ${this.score}`, this.w - 300, 75);
        let c, s, n;
        let rand = this.randomNumber(2, 20);
        for (let i = 0; i < rand; i++) {
            let image = new Image();
            image.onload = () => {
                let ctx = this.canvas.getContext("2d");
                ctx.drawImage(image, this.randomNumber(0, this.w), this.randomNumber(100, this.h));
            };
            switch (this.randomNumber(0, 2)) {
                case 0:
                    c = "Brown";
                    break;
                case 1:
                    c = "Grey";
                    break;
                default:
                    c = "Brown";
                    break;
            }
            switch (this.randomNumber(0, 3)) {
                case 0:
                    s = "big";
                    break;
                case 1:
                    s = "med";
                    break;
                case 2:
                    s = "small";
                    break;
                case 3:
                    s = "tiny";
                    break;
            }
            if (s == "big") {
                n = this.randomNumber(1, 4);
            }
            else {
                n = this.randomNumber(1, 2);
            }
            ;
            image.src = `.\\assets\\images\\SpaceShooterRedux\\PNG\\Meteors\\Meteor${c}_${s}${n}.png`;
        }
        let image = new Image();
        image.onload = () => {
            let ctx = this.canvas.getContext("2d");
            ctx.drawImage(image, this.centerW - (image.width / 2), this.centerH - (image.height / 2));
        };
        image.src = ".\\assets\\images\\SpaceShooterRedux\\PNG\\playerShip1_blue.png";
    }
    title_screen() {
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.font = "75px Minecraft";
        this.ctx.fillText(`Yer score be ${this.score} matey!`, this.centerW, this.centerH - 150);
        this.ctx.font = "50px Minecraft";
        this.ctx.fillText("HISCORES", this.centerW, this.centerH);
        this.ctx.font = "30px Minecraft";
        for (let i = 0; i < this.highscores.length; i++) {
            this.ctx.fillText(`${this.highscores[i].playerName} ${this.highscores[i].score}`, this.centerW, this.centerH + 50 + (i * 40));
        }
        this.ctx.font = "40px Minecraft";
        for (let i = this.highscores.length - 1; i >= 0; i--) {
            console.log(`checking ${i}`);
            if (this.highscores[i].score > this.score) {
                console.log(`number index is now ${i}`);
                i++;
                if (i <= this.highscores.length) {
                    this.ctx.fillText(`You beat ${this.highscores[i].playerName}, congratulations!`, this.centerW, this.centerH + 50 + 140);
                    break;
                }
                else {
                    this.ctx.fillText(`You did not get a highscore, try again!`, this.centerW, this.centerH + 50 + 140);
                    break;
                }
                ;
            }
            else if (i == 0) {
                this.ctx.font = "60px Minecraft";
                this.ctx.fillText(`CONGLATURATIONS, A WINNER IS YOU!`, this.centerW, this.centerH + 50 + 160);
                break;
            }
        }
    }
    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    ;
}
let init = function () {
    const Asteroids = new Game(document.getElementById('canvas'));
};
var canvas = document.getElementById('canvas');
window.addEventListener('load', init);
//# sourceMappingURL=app.js.map