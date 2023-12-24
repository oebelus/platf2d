const canvas = document.getElementById("background")
const ctx = canvas.getContext("2d")

const button = document.createElement("button"); 
button.innerHTML = "↻"
const body = document.getElementsByTagName("body")[0]
body.appendChild(button)

let score = document.querySelector(".score")
let level = document.querySelector(".level")

let animationId;

button.addEventListener('click', () => {
    cancelAnimationFrame(animationId)
    resetGameState()
    animate()
})

function resetGameState() {
    platforms = generatePlatforms(10)
    coins = generateCoins(5)
    player = new Player(100, canvas.height/1.265, 50, 50);
}

canvas.width = innerWidth
canvas.height = innerHeight

const gravity = 0.2

class Platform {
    constructor(x, y, w, h, color) {
        this.positition = {
            x: x,
            y: y,
        }
        this.width = w
        this.height = h
        this.color = color
    }
    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.positition.x, this.positition.y, this.width, this.height)
    }
}

var ground = new Platform(0, canvas.height/1.15, canvas.width, canvas.height-canvas.height/3, "#0D0E0F")

function overlaps(a, b) {
    return a.positition.y < b.positition.y + b.height &&
           a.positition.y + a.height > b.positition.y;
}

function generatePlatforms(n) { // canvas.height-220
    let colors = ["yellow", "red", "green", "cyan", "orange", "pink", "purple"];
    let platforms = [];
    for (let i = 0; i < n; i++) {
        let x = Math.floor(Math.random() * (canvas.width - 300)) + 300
        let y = Math.floor(Math.random() * (canvas.height- 200))
        let w = Math.floor(Math.random() * (canvas.width - 100))
        let h = canvas.height/10
        let color = colors[Math.floor(Math.random() * colors.length)]
        
        let newPlatform = new Platform(x, y, w, h, color)
        let overlap = platforms.some(p => overlaps(newPlatform, p));
        
        if (!overlap)
            platforms.push(new Platform(x, y, w, h, color))
    }
    return platforms
}

var platforms = generatePlatforms(10)

class Door {
    constructor(x, y, w, h, color) {
        this.positition = {
            x: x,
            y: y,
        }
        this.width = w
        this.height = h
        this.color = color
    }
    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.positition.x, this.positition.y, this.width, this.height)
    }
}

var door = new Door(canvas.width - 110, 360, 100, 200, "white")

class Coin {
    constructor(x, y) {
        this.position = {
            x: x,
            y: y
        }
        this.color = "#FFD550"
        this.vertical = 0.5
        this.direction = 1
        this.range = 20
        this.originalY = y
    }
    draw() {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.position.x, this.position.y, 20, 0, 2 * Math.PI)
        ctx.fill()
    }
    update() {
        this.draw()
        this.position.y += this.vertical * this.direction
        if (this.position.y > this.originalY + this.range || this.position.y < this.originalY - this.range) {
            this.direction *= -1;
        }
    }
}

function generateCoins(n) {
    let coins = []
    for (let i = 0; i < n; i++) {
        let x = Math.floor(Math.random() * (canvas.width - 300)) + 300
        let y = Math.floor(Math.random() * (canvas.height - 300))

        let newCoin = new Coin(x, y)
        coins.push(newCoin)
    }
    return coins
}

let coins = generateCoins(5)
console.log(coins)

//10, canvas.height/1.265, 50, 50
class Player {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.color = "cyan"
        this.velocity = {
            x: 0,
            y: 1
        }
        this.jump = false
        this.score = 0
    }
    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }
    update() {
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y

        let length = platforms.length
        for (let i = 0; i < length; i++) {
            let p = platforms[i]
            let colliding = this.x < p.positition.x + p.width &&
                this.x + this.w > p.positition.x &&
                this.y < p.positition.y + p.height &&
                this.y + this.h > p.positition.y 
                if (colliding) {
                    if (this.y < p.positition.y + p.height && this.y + this.h > p.positition.y + p.height) {
                        
                        this.y = p.positition.y + p.height
                    }
                    else if (this.y < p.positition.y + p.height && this.y + this.h > p.positition.y) {
                        this.y = p.positition.y - p.height
                    }
                    else if ( this.x < p.positition.x + p.width && this.x + this.w > p.positition.x) {
                        this.x += 20
                    }
                    else if (this.x < p.positition.x + p.width &&
                        this.x + this.w > p.positition.x) {
                            this.x -= 20
                        }
                this.velocity.x = 0
                this.velocity.y = 0
                this.jump = false;
            }
        }

        if (this.y + this.h + this.velocity.y >= canvas.height/1.15) {
            this.velocity.y = 0
            this.jump = false
        } else if (this.y < 0) {
            this.y = 0
            this.velocity.y += gravity
            this.jump = true
        }
        else this.velocity.y += gravity

        for (let i = 0; i < coins.length; i++) {
            let c = coins[i]
            let colliding = this.x < c.position.x &&
                            this.x + this.w > c.position.x &&
                            this.y < c.position.y &&
                            this.y + this.h > c.position.y;
            if (colliding) {
                this.score++
                score.innerHTML = `SCORE: ${this.score}`
                coins.splice(i, 1)
                console.log(coins)
                i--;
            }
            console.log(this.score)
        }

        let count = 1;
        if (this.x == door.x + 20) {
            count++
            platforms = generatePlatforms(10)
            coins = generateCoins(10)
            level.innerHTML = `LEVEL: ${count}`
        }
    }
}

var player = new Player(100, canvas.height/1.265, 50, 50)

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }, 
    up: {
        pressed: false
    },
    space: {
        pressed: false
    }
}

// Function to update the rectangle's position
function move(e) {
    switch(e.key) {
        case 'ArrowUp':
            keys.up.pressed = true
            player.y -= 10;
            break;
        case 'ArrowDown':
            player.y += 10;
            break;
        case 'ArrowLeft':
            keys.left.pressed = true
            player.x -= 10;
            break;
        case 'ArrowRight':
            keys.right.pressed = true
            player.x += 10;
            break;
        case ' ':
            if (!player.jump) {
                player.velocity.y -= 8;
                keys.space.pressed = true
                player.jump = true
            }
            /*setTimeout(() => { player.y += 200; }, 150);*/
            break
    }
}

function down(e) {
    switch(e.key) {
        case 'ArrowUp':
            keys.up.pressed = false;
            break
        case 'ArrowDown':
            break;
        case 'ArrowLeft':
            keys.left.pressed = false;
            break
        case 'ArrowRight':
            keys.right.pressed = false;
            break
        case ' ':
            keys.space.pressed = false;
            player.jump = false
            
    }
}

function updatePosition() {
    let rectStyle = window.getComputedStyle(rect);
    let bottom = parseInt(rectStyle.getPropertyValue('bottom'));
    rect.style.bottom = (bottom - 1) + "px";
}

window.addEventListener('keydown', move);
window.addEventListener('keyup', down);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //ground()
    for (let coin of coins) {
        coin.draw()
    }
    ground.draw()
    for (var plat of platforms) {
        plat.draw()
    }
    for (let coin of coins) {
        coin.update()
    }
    player.update()

    if (coins.length == 0) {
        door.draw()
    } 

    animationId = requestAnimationFrame(animate);
}

// Start the animation
animate();
