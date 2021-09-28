function rainUpdate(id) {
    let droplets = document.getElementsByClassName('rain');
    let droplet = droplets[id];
    droplet.classList.remove('rain');
    void droplet.offsetWidth;
    droplet.classList.add('rain');
    droplet.style.left = String(Math.random() * 100) + '%';
    droplet.style.top = "0%";
    let a = (5 + Math.random()) / 5;
    droplet.style.width = String(a * 0.2) + 'rem'
    droplet.style.height = String(a * 1) + 'rem'
    let t = Math.random() * 10 + 5;
    console.log('Raindrop', id, ', time: ', t)
    droplet.style.animationDuration = String(t) + 's';
    setTimeout(() => { rainUpdate(id) }, t * 1000);
}

class Ball {
    constructor() {
        this.x = 50;
        this.y = 50;

        this.vx = 0.5;
        this.vy = 0.2;

        this.py = 50;
        this.p2y = 50;
    }

    update() {
        document.getElementById('ball').style.left = String(this.x) + '%'
        document.getElementById('ball').style.top = String(this.y) + '%'

        if (this.vx > 0) {
            document.getElementById('paddle-one').style.top = String(this.py) + '%'
            this.py = this.py - (this.x / 1000) * (this.py - this.y);
            this.py = Math.min(this.py, 90);
            this.py = Math.max(this.py, 10);
        } else {
            document.getElementById('paddle-two').style.top = String(this.p2y) + '%'
            this.p2y = this.p2y - ((100 - this.x) / 1000) * (this.p2y - this.y);
            this.p2y = Math.min(this.p2y, 90);
            this.p2y = Math.max(this.p2y, 10);
        }


        this.x += this.vx;
        this.y += this.vy;

        if (this.y >= 95 || this.y <= 5) {
            this.vy *= -1;
        }


        if (this.x >= 93 || this.x <= 7) {
            this.vx *= -1;
        }
    }
}


function clr() {
    return Math.floor(Math.random() * 255)
}


function box() {
    console.log('box')
    let div = document.createElement('div')
    div.classList.add('box123');

    let i = Math.floor(Math.random() * 10);
    boxes[i]++;

    document.body.appendChild(div);
    div.style.animationDuration = 1 + Math.random() * 2;
    div.style.backgroundColor = `rgb(${clr()}, ${clr()}, 255)`;
    div.style.left = 'calc(25% + ' + String(i * 2 + Math.random() * 0.5) + 'rem'
    div.style.setProperty('--to', 'calc(100% - ' + String(boxes[i]) + 'rem');
}

console.log('ping-pong');
ball = new Ball();


boxes = Array(10).fill(0);

for (let i = 0; i < document.getElementsByClassName('rain').length; i++) {
    rainUpdate(i);
}


var intervalId = window.setInterval(function () {
    ball.update();
}, 10);

var intervalId = window.setInterval(function () {
    box();
}, 1000);