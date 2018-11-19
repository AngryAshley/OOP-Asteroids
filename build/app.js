class Game {
    constructor(canvasId) {
        this.player = "Player1";
        this.score = 400;
        this.lives = 3;
        this.rotSpeed = 40;
        this.asteroidPresent = false;
        this.shipX = 50;
        this.shipY = 37;
        this.shipOldX = 50;
        this.shipOldY = 37;
        this.shipOldRot = 0;
        this.shipSpeed = 0.5;
        this.shipXSpeed = 0;
        this.shipYSpeed = 0;
        this.shipRot = 0;
        this.debug = true;
        this.canvas = canvasId;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.w = this.canvas.width;
        this.h = this.canvas.height;
        this.centerW = this.w / 2;
        this.centerH = this.h / 2;
        this.asteroidArray = [];
        this.buttonArray = [];
        canvas.addEventListener('click', (event) => { this.checkClick(event); });
        this.spriteMapImage = new Image;
        this.spriteMapImage.addEventListener('load', () => {
            fetch('./assets/images/SpaceShooterRedux/Spritesheet/sheet.xml')
                .then((response) => {
                return response.text();
            })
                .then((str) => {
                let parser = new DOMParser();
                this.spriteMapData = [];
                Array.prototype.forEach.call(parser.parseFromString(str, "text/xml").getElementsByTagName("SubTexture"), (e) => {
                    let atts = e.attributes;
                    this.spriteMapData.push({ name: atts[0].nodeValue, x: parseInt(atts[1].nodeValue), y: parseInt(atts[2].nodeValue), width: parseInt(atts[3].nodeValue), height: parseInt(atts[4].nodeValue) });
                });
                console.table(this.spriteMapData);
            }).then(() => {
            });
        });
        this.spriteMapImage.src = "./assets/images/SpaceShooterRedux/Spritesheet/sheet.png";
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
        this.buttonArray = [];
        this.start_screen();
    }
    start_screen() {
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.writeAsteroidHeading(-100);
        this.writeIntroText(175);
        this.writeStartButton(200, 160, 60);
        this.asteroidPresent = true;
        this.drawAsteroid(this.centerW, this.centerH + 40, 1.5);
    }
    writeAsteroidHeading(dev) {
        this.writeText("Asteroids", this.centerW, this.centerH + dev, 150);
    }
    ;
    writeIntroText(dev) {
        this.writeText("Press to pray", this.centerW, this.centerH + dev, 30);
    }
    writeStartButton(dev, width, height) {
        let image = new Image();
        image.onload = () => {
            let ctx = this.canvas.getContext("2d");
            ctx.drawImage(image, this.centerW - (image.width / 2) + 28, this.centerH + dev, width, height);
            this.buttonArray.push({
                x: this.centerW - (image.width / 2) + 28,
                y: this.centerH + dev,
                w: width,
                h: height,
                func: "this.pressStart()"
            });
            this.writeText("PRAY", this.centerW, this.centerH + dev + 48, 50, "Black");
        };
        image.src = ".\\assets\\images\\SpaceShooterRedux\\PNG\\UI\\buttonBlue.png";
    }
    ;
    pressStart() {
        this.destroyAsteroid();
        this.level_screen();
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
            if (this.asteroidPresent) {
                window.requestAnimationFrame(() => this.drawAsteroid(x, y, s));
            }
        };
        image.src = ".\\assets\\images\\SpaceShooterRedux\\PNG\\Meteors\\meteorBrown_big3.png";
    }
    destroyAsteroid() {
        this.asteroidPresent = false;
    }
    checkClick(event) {
        for (let i = 0; i < this.buttonArray.length; i++) {
            if (event.x > this.buttonArray[i].x &&
                event.x < this.buttonArray[i].x + this.buttonArray[i].w &&
                event.y > this.buttonArray[i].y &&
                event.y < this.buttonArray[i].y + this.buttonArray[i].h) {
                eval(this.buttonArray[i].func);
                break;
            }
        }
    }
    level_screen() {
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.buttonArray = [];
        window.addEventListener("keydown", (event) => this.keyDownHandler(event), false);
        window.addEventListener("keyup", (event) => this.keyUpHandler(event), false);
        for (let i = this.randomNumber(2, 20); i > 0; i--) {
            this.Asteroid_Construct();
        }
        this.Spaceship_construct();
        window.setInterval(() => this.tick(), 1000 / 30);
    }
    tick() {
        if (this.debug) {
            this.Debug_render();
        }
        this.Spaceship_render();
        this.Asteroid_render();
        this.UI_render();
    }
    UI_render() {
        for (let i = 0; i < this.lives; i++) {
            let image = new Image();
            image.onload = () => {
                this.ctx.clearRect(50 + (i * 33), 50, image.width, image.height);
                this.ctx.drawImage(image, 50 + (i * 33), 50);
            };
            image.src = ".\\assets\\images\\SpaceShooterRedux\\PNG\\UI\\playerLife1_blue.png";
        }
        this.ctx.clearRect(this.w - 310, 50, 310, 25);
        this.writeText(`Score ${this.score}`, this.w - 300, 75, 30, "white");
    }
    Debug_render() {
        this.ctx.clearRect(50, 100, 400, 200);
        this.writeText(`shipX: ${this.shipX}`, 50, 125, 20, "white", "left");
        this.writeText(`shipY: ${this.shipY}`, 50, 150, 20, "white", "left");
        this.writeText(`XSpeed: ${this.shipXSpeed}`, 50, 175, 20, "white", "left");
        this.writeText(`YSpeed: ${this.shipYSpeed}`, 50, 200);
        this.writeText(`Rot: ${this.shipRot}`, 50, 225);
    }
    Spaceship_construct() {
        let image = new Image();
        image.src = ".\\assets\\images\\SpaceShooterRedux\\PNG\\playerShip1_blue.png";
        this.shipX = this.centerW - (image.width / 2);
        this.shipY = this.centerH - (image.height / 2);
    }
    Spaceship_render() {
        let image = new Image();
        image.src = ".\\assets\\images\\SpaceShooterRedux\\PNG\\playerShip1_blue.png";
        this.ctx.save();
        this.ctx.translate(this.shipX, this.shipY);
        this.ctx.rotate(this.shipRot * Math.PI / 180);
        this.ctx.clearRect(-image.width / 2 - 5, -image.height / 2 - 5, image.width + 10, image.height + 10);
        this.ctx.rotate(-this.shipRot * Math.PI / 180);
        this.ctx.translate(-this.shipX, -this.shipY);
        this.ctx.restore();
        if (this.leftPressed) {
            this.shipRot -= 4;
        }
        ;
        if (this.rightPressed) {
            this.shipRot += 4;
        }
        ;
        if (this.shipRot > 359) {
            this.shipRot = 0;
        }
        ;
        if (this.shipRot < 0) {
            this.shipRot = 359;
        }
        ;
        if (this.upPressed) {
            this.shipXSpeed -= (this.shipSpeed * Math.sin(-this.shipRot * Math.PI / 180)) / 2;
            this.shipYSpeed -= (this.shipSpeed * Math.cos(-this.shipRot * Math.PI / 180)) / 2;
        }
        ;
        if (this.downPressed) {
            this.shipXSpeed += (this.shipSpeed * Math.sin(-this.shipRot * Math.PI / 180)) / 2;
            this.shipYSpeed += (this.shipSpeed * Math.cos(-this.shipRot * Math.PI / 180)) / 2;
        }
        ;
        this.shipX += this.shipXSpeed;
        this.shipY += this.shipYSpeed;
        if (this.shipX < -image.width - 10) {
            this.shipX = this.w + image.width + 5;
        }
        if (this.shipX > this.w + image.width + 10) {
            this.shipX = -image.width - 5;
        }
        if (this.shipY < -image.height - 10) {
            this.shipY = this.h + image.height + 5;
        }
        if (this.shipY > this.h + image.height + 10) {
            this.shipY = -image.height - 5;
        }
        image.onload = () => {
            this.ctx.save();
            this.ctx.translate(this.shipX, this.shipY);
            this.ctx.rotate(this.shipRot * Math.PI / 180);
            this.ctx.drawImage(image, -image.width / 2, -image.height / 2);
            this.ctx.rotate(-this.shipRot * Math.PI / 180);
            this.ctx.translate(-this.shipX, -this.shipY);
            this.ctx.restore();
        };
        this.shipOldX = this.shipX;
        this.shipOldY = this.shipY;
        this.shipOldRot = this.shipRot;
    }
    Asteroid_Construct() {
        let c, s, n, sprite;
        let rand = this.randomNumber(2, 20);
        for (let i = 0; i < rand; i++) {
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
            sprite = `./assets/images/SpaceShooterRedux/PNG/Meteors/Meteor${c}_${s}${n}.png`;
        }
        this.asteroidArray.push({
            x: this.randomNumber(0, this.w),
            y: this.randomNumber(0, this.h),
            dir: this.randomNumber(0, 359),
            sprite: sprite,
            speed: this.randomNumber(2, 6)
        });
    }
    Asteroid_render() {
        for (let i = 0; i < this.asteroidArray.length; i++) {
            let image = new Image();
            let remove = false;
            image.src = this.asteroidArray[i].sprite;
            this.ctx.clearRect(this.asteroidArray[i].x, this.asteroidArray[i].y, image.width, image.height);
            this.asteroidArray[i].x += this.asteroidArray[i].speed * Math.sin(-this.asteroidArray[i].dir * Math.PI / 180);
            this.asteroidArray[i].y += this.asteroidArray[i].speed * Math.cos(-this.asteroidArray[i].dir * Math.PI / 180);
            if (this.asteroidArray[i].x < -100 || this.asteroidArray[i].x > this.canvas.width + 100 || this.asteroidArray[i].y < -100 || this.asteroidArray[i].y > this.canvas.height + 100) {
                this.asteroidArray.splice(i, 1);
                this.Asteroid_Construct();
                remove = true;
                i = i - 1;
            }
            if (!remove) {
                this.ctx.drawImage(image, this.asteroidArray[i].x, this.asteroidArray[i].y);
            }
        }
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
    writeText(text, x, y, size, color, align) {
        if (size != undefined) {
            this.ctx.font = `${size}px Minecraft`;
        }
        ;
        if (color != undefined) {
            this.ctx.fillStyle = color;
        }
        ;
        if (align != undefined) {
            this.ctx.textAlign = align;
        }
        ;
        this.ctx.fillText(text, x, y);
    }
    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    ;
    keyDownHandler(event) {
        console.log("KEYPRESS");
        switch (event.keyCode) {
            case 37:
                this.leftPressed = true;
                break;
            case 38:
                this.upPressed = true;
                break;
            case 39:
                this.rightPressed = true;
                break;
            case 40:
                this.downPressed = true;
                break;
        }
    }
    keyUpHandler(event) {
        switch (event.keyCode) {
            case 37:
                this.leftPressed = false;
                break;
            case 38:
                this.upPressed = false;
                break;
            case 39:
                this.rightPressed = false;
                break;
            case 40:
                this.downPressed = false;
                break;
        }
    }
}
let init = function () {
    const Asteroids = new Game(document.getElementById('canvas'));
};
var canvas = document.getElementById('canvas');
window.addEventListener('load', init);
//# sourceMappingURL=app.js.map