class Player {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.color = "cyan"
        this.velocity = {
            x: 0,
            y: 0
        }
        this.jump = false
        this.score = 0
        this.level = 0
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
            let colliding = this.x < p.position.x + p.width &&
                this.x + this.w > p.position.x &&
                this.y < p.position.y + p.height &&
                this.y + this.h > p.position.y 
                if (colliding) {
                    if (this.y < p.position.y + p.height && this.y + this.h > p.position.y + p.height) {
                        
                        this.y = p.position.y + p.height
                    }
                    else if (this.y < p.position.y + p.height && this.y + this.h > p.position.y) {
                        this.y = p.position.y - p.height
                    }
                    else if ( this.x < p.position.x + p.width && this.x + this.w > p.position.x) {
                        this.x += 20
                    }
                    else if (this.x < p.position.x + p.width &&
                        this.x + this.w > p.position.x) {
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
                score.innerHTML = `COINS: ${this.score}`
                coins.splice(i, 1)
                console.log(coins)
                i--;
            }
        }
    }
    
    door() {
        if (player.x > door.position.x && player.x < door.position.x + door.width &&
            player.y > door.position.y && player.y < door.position.y + door.height) {
            platforms = generatePlatforms(10)
            coins = generateCoins(5)
            this.level++
            console.log("stage", this.level)
            level.innerHTML = `LEVEL: ${this.level}`
            player.x = 100
        }
    }
}

export default Player