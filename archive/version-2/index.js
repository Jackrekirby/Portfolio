console.log('javascript running')


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
        let paddleWidth = 15;
        document.getElementById('ball').style.left = String(this.x) + '%'
        document.getElementById('ball').style.top = String(this.y) + '%'

        if (this.vy < 0) {
            document.getElementById('paddle-one').style.left = String(this.py) + '%'
            this.py = this.py - ((100 - this.y) / 1000) * (this.py - this.x);
            this.py = Math.min(this.py, 100 - paddleWidth);
            this.py = Math.max(this.py, paddleWidth);
        } else {
            document.getElementById('paddle-two').style.left = String(this.p2y) + '%'
            this.p2y = this.p2y - (this.y / 1000) * (this.p2y - this.x);
            this.p2y = Math.min(this.p2y, 100 - paddleWidth);
            this.p2y = Math.max(this.p2y, paddleWidth);
        }


        this.x += this.vx;
        this.y += this.vy;

        if (this.y >= 93 || this.y <= 7) {
            this.vy *= -1;
        }


        if (this.x >= 96 || this.x <= 4) {
            this.vx *= -1;
        }
    }
}


class Particle {
    constructor(id) {
        this.id = id
        this.x = 5;
        this.y = 10;
    }
    move() {
        let particle = document.getElementById('molecule').getElementsByClassName('particle')[this.id];
        this.x += 0.1 * (Math.random() - 0.5);
        this.y += 0.1 * (Math.random() - 0.5);
        this.x = Math.min(this.x, 9.5);
        this.x = Math.max(this.x, 0.5);
        this.y = Math.min(this.y, 19.5);
        this.y = Math.max(this.y, 0.5);
        particle.style.top = String(this.x) + 'rem'
        particle.style.left = String(this.y) + 'rem'
    }
}


function rand(min, max) {
    return min + Math.random() * (max - min);
}

class Boid {
    constructor(id) {
        this.element = document.getElementsByClassName('boid')[id];
        this.unit = 'rem'
        this.vx = (Math.random() - 0.5) * 0.1;
        this.vy = (Math.random() - 0.5) * 0.1;

        this.element.style.left = `${rand(30, 60)}%`;
        this.element.style.top = `${rand(30, 60)}%`;

    }

    get x() {
        let a = getComputedStyle(this.element).left;
        return a.substring(0, a.length - 2);
    }

    get y() {
        let a = getComputedStyle(this.element).top;
        return a.substring(0, a.length - 2);
    }

    dist2(x, y) {
        let dx = (this.x - x) ** 2;
        let dy = (this.y - y) ** 2;
        return dx + dy;
    }

    align() {
        let vx = 0, vy = 0;
        let count = 0;
        for (let boid of Boid.all) {
            let d = this.dist2(boid.x, boid.y);
            if (d > 1000 && d < 10000) {
                vx += boid.vx;
                vy += boid.vy;
                count++;
            }
        }
        count++;
        vx += this.vx;
        vy += this.vy;
        vx /= count;
        vy /= count;
        this.vx -= 0.01 * (this.vx - vx);
        this.vy -= 0.01 * (this.vy - vy);
    }

    update() {
        // this.vx -= Math.sign(this.x - (window.innerWidth / 2)) * ((Math.random() - 0.3) * 0.001);
        // this.vy -= Math.sign(this.y - (window.innerHeight / 2)) * ((Math.random() - 0.3) * 0.001);

        this.element.style.left = `calc(${this.x}px + ${this.vx}${this.unit})`;
        this.element.style.top = `calc(${this.y}px + ${this.vy}${this.unit})`;
        this.align();
    }
}

Boid.all = new Array();


let ball = new Ball();
let particles = new Array();

for (let i = 0; i < 32; i++) {
    let div = document.createElement('div');
    div.classList.add('particle');
    if (i % 2 == 0) {
        div.classList.add('w');
    }
    document.getElementById('molecule').appendChild(div);
    particles.push(new Particle(i));
}

function box() {
    console.log('box')
    let div = document.createElement('div')
    let i = Math.floor(Math.random() * 6);

    div.classList.add(`falling-box`);
    div.classList.add(`line-${i}`);

    if (boxes[i] > 5) {
        let elements = document.getElementById('falling-boxes').getElementsByClassName(`line-${i}`);
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
        boxes[i] = 0;
    }

    boxes[i]++;
    let x = i + (Math.random() * 0.2);
    if ((boxes[i] + i) % 2 == 0) {
        div.style.backgroundColor = 'white';
    }

    div.style.left = `calc(50% + ${(x - 3) * 3}rem)`;
    div.style.setProperty('--to', `calc(100% - ${boxes[i]}rem)`);

    document.getElementById('falling-boxes').appendChild(div);
}


function initCarousel() {
    let carousels = document.getElementsByClassName('carousel');
    for (let carousel of carousels) {
        let button = carousel.getElementsByTagName('button')[0];
        button.addEventListener("click", moveCarousel);
    }
    for (let carousel of carousels) {
        carousel.getElementsByTagName('div')[0].style.display = 'inline';
    }
}

function moveCarousel(event) {
    console.log('event', this)
    let pathID = 1;
    let divs = event.path[pathID].getElementsByTagName('div');
    let i = 0;
    for (let div of divs) {
        if (div.style.display == 'inline') {
            console.log('i', i)
            break;
        }
        i++;
    }
    let j = i + 1;
    if (i + 1 == divs.length) {
        j = 0;
    }

    event.path[pathID].getElementsByTagName('div')[i].style.display = 'none';
    event.path[pathID].getElementsByTagName('div')[j].style.display = 'inline';
}

class Rain {
    static init(parentElement, count) {
        for (let i = 0; i < count; i++) {
            let element = document.createElement('div');
            element.classList.add('rain');
            Rain.style(element);
            element.addEventListener("animationend", this.update2);
            parentElement.appendChild(element);
        }
    }

    static style(element) {
        element.style.top = '-10%';
        element.style.left = String(Math.random() * 100) + '%';
        let dropletSize = (5 * Math.random()) / 5 + 0.1;
        element.style.width = `${dropletSize * 0.2}rem`
        element.style.height = `${dropletSize * 1}rem`
        let t = 20 - dropletSize * 10;
        element.style.animationDuration = `${t}s`;
        element.style.animationDelay = `${Math.random() * 10}s`;
    }

    static update2(event) {
        let element = event.path[0];
        Rain.style(element);
        element.classList.remove('rain');
        setTimeout(() => element.classList.add('rain'), 1)
    }
}



boxes = Array(6).fill(0);
initCarousel();
Rain.init(document.getElementById('rain-container'), 10);

// console.log('BOID');
// for (let i = 0; i < document.getElementsByClassName('boid').length; i++) {
//     Boid.all.push(new Boid(i));
// }


var intervalId = window.setInterval(function () {
    ball.update();
    for (let a of particles) {
        a.move();
    }

    for (let boid of Boid.all) {
        boid.update();
    }
}, 10);

var intervalId2 = window.setInterval(function () {
    box();
}, 3000);