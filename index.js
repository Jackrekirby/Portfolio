

class PingPong {
    constructor(parentElement) {
        this.ball = {
            'x': 50, 'y': 50,
            'dx': 0.75, 'dy': 0.3
        }

        this.paddleWidth = 15;

        this.paddle1 = {
            'x': 50,
        }
        this.paddle2 = {
            'x': 50,
        }

        this.ballEle = document.createElement('div');
        this.ballEle.classList.add('ball');
        parentElement.appendChild(this.ballEle);

        this.paddle1Ele = document.createElement('div');
        this.paddle1Ele.classList.add('paddle');
        this.paddle1Ele.classList.add('p1');
        parentElement.appendChild(this.paddle1Ele);

        this.paddle2Ele = document.createElement('div');
        this.paddle2Ele.classList.add('paddle');
        this.paddle2Ele.classList.add('p2');
        parentElement.appendChild(this.paddle2Ele);
    }

    update() {
        this.ballEle.style.left = `${this.ball.x}%`
        this.ballEle.style.top = `${this.ball.y}%`

        if (this.ball.dy > 0) {
            this.paddle1Ele.style.left = `${this.paddle1.x}%`
            this.paddle1.x -= ((this.ball.y) / 1000) * (this.paddle1.x - this.ball.x);
            this.paddle1.x = clamp(this.paddle1.x, this.paddleWidth, 100 - this.paddleWidth);
        } else {
            this.paddle2Ele.style.left = `${this.paddle2.x}%`
            this.paddle2.x -= ((100 - this.ball.y) / 1000) * (this.paddle2.x - this.ball.x);
            this.paddle2.x = clamp(this.paddle2.x, this.paddleWidth, 100 - this.paddleWidth);
        }

        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

        if (this.ball.y >= 93 || this.ball.y <= 7) {
            this.ball.dy *= -1;
        }

        if (this.ball.x >= 95 || this.ball.x <= 5) {
            this.ball.dx *= -1;
        }
    }
}

function addFallingbox() {
    let numRows = 5;

    let div = document.createElement('div')
    let i = Math.floor(Math.random() * boxes.length);

    div.classList.add(`falling-box`);
    div.classList.add(`line-${i}`);

    if (boxes[i] > numRows) {
        let elements = document.getElementById('falling-boxes').getElementsByClassName(`line-${i}`);
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
        boxes[i] = 0;
    }

    boxes[i]++;
    let x = i + (Math.random() * 0.2);
    if ((boxes[i] + i) % 2 == 0) {
        div.style.backgroundColor = 'var(--clr-light)';
    }

    div.style.left = `calc(50% + ${(x - 3) * 3}rem)`;
    div.style.setProperty('--to', `calc(100% - ${boxes[i]}rem)`);

    document.getElementById('falling-boxes').appendChild(div);
}

class Particle {
    constructor(id) {
        this.id = id
        this.x = 50;
        this.y = 50;
    }

    static create(count) {
        let particles = new Array();
        for (let i = 0; i < 32; i++) {
            let div = document.createElement('div');
            div.classList.add('particle');
            if (i % 2 == 0) {
                div.classList.add('w');
            }
            document.getElementById('particles').appendChild(div);
            particles.push(new Particle(i));
        }
        return particles
    }

    update() {
        let particle = document.getElementById('particles').getElementsByClassName('particle')[this.id];
        this.x += 1 * (Math.random() - 0.5);
        this.y += 1 * (Math.random() - 0.5);
        this.x = Math.min(this.x, 95);
        this.x = Math.max(this.x, 5);
        this.y = Math.min(this.y, 95);
        this.y = Math.max(this.y, 5);
        particle.style.top = String(this.x) + '%'
        particle.style.left = String(this.y) + '%'
    }
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

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
};

let pingPong = new PingPong(document.getElementById('ping-pong'))
let boxes = Array(6).fill(0);
let particles = Particle.create(32);
Rain.init(document.getElementById('rain-container'), 10);

let fastLoop = window.setInterval(function () {
    pingPong.update();

    for (let a of particles) {
        a.update();
    }
}, 15);

let slowLoop = window.setInterval(function () {
    addFallingbox();
}, 3000);



