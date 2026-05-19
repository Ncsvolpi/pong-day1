import Phaser from 'phaser'

class GameScene extends Phaser.Scene {
    player!: Phaser.GameObjects.Rectangle
    enemy!: Phaser.GameObjects.Rectangle
    ball!: Phaser.GameObjects.Arc
    
    isPaused = false
    pauseKey!: Phaser.Input.Keyboard.Key
    resetKey!: Phaser.Input.Keyboard.Key
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    keys!: any
    
    playerScore = 0
    enemyScore = 0

    pauseText!: Phaser.GameObjects.Text
    scoreText!: Phaser.GameObjects.Text

    ballVelocity = {
        x: 4,
        y: 3
    }

    constructor() {
        super('game')
    }

    create() {
        this.player = this.add.rectangle(40, 300, 20, 100, 0xffcc00)
        this.enemy = this.add.rectangle(760, 300, 20, 100, 0xffffff)
        this.ball = this.add.circle(400, 300, 10, 0xffffff)

        this.scoreText = this.add.text(330, 30, '0  x  0', {
            fontSize: '40px',
            color: '#ffffff'
        })

        this.cursors = this.input.keyboard!.createCursorKeys()

        this.keys = this.input.keyboard!.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            S: Phaser.Input.Keyboard.KeyCodes.S
            
        })

        this.resetKey = this.input.keyboard!.addKey(
          Phaser.Input.Keyboard.KeyCodes.ENTER
        )

        this.pauseKey = this.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.ESC
        )

        this.pauseText = this.add.text(300, 250, 'PAUSADO', {
            fontSize: '48px',
            color: '#ffffff'
        })

        this.pauseText.setVisible(false)

        this.resetBall()
    }

    update() {
      if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
          this.togglePause()
      }

      if (this.isPaused) {
          return
      }

      if(Phaser.Input.Keyboard.JustDown(this.resetKey)){
        this.resetGame();
      }
        this.movePlayer()
        this.moveEnemy()
        this.moveBall()
        this.checkCollisions()
        this.checkScore()

    }

    //Movimentos
    movePlayer() {
        const speed = 6

        if (this.keys.W.isDown || this.cursors.up.isDown) {
            this.player.y -= speed
        }

        if (this.keys.S.isDown || this.cursors.down.isDown) {
            this.player.y += speed
        }

        this.player.y = Phaser.Math.Clamp(this.player.y, 50, 550)
    }

    moveEnemy() {
        const speed = 4

        if (this.ball.y < this.enemy.y) {
            this.enemy.y -= speed
        }

        if (this.ball.y > this.enemy.y) {
            this.enemy.y += speed
        }

        this.enemy.y = Phaser.Math.Clamp(this.enemy.y, 50, 550)
    }

    moveBall() {
        this.ball.x += this.ballVelocity.x
        this.ball.y += this.ballVelocity.y

        if (this.ball.y <= 10 || this.ball.y >= 590) {
            this.ballVelocity.y *= -1
        }
    }

    //Fisica
    checkCollisions() {
        if (this.isColliding(this.ball, this.player)) {
            this.ballVelocity.x = Math.abs(this.ballVelocity.x)
            this.increaseBallSpeed()
        }

        if (this.isColliding(this.ball, this.enemy)) {
            this.ballVelocity.x = -Math.abs(this.ballVelocity.x)
            this.increaseBallSpeed()
        }
    }

    isColliding(
        ball: Phaser.GameObjects.Arc,
        paddle: Phaser.GameObjects.Rectangle
    ) {
        const ballBounds = ball.getBounds()
        const paddleBounds = paddle.getBounds()

        return Phaser.Geom.Intersects.RectangleToRectangle(
            ballBounds,
            paddleBounds
        )
    }

    increaseBallSpeed() {
        this.ballVelocity.x *= 1.05
        this.ballVelocity.y *= 1.05
    }

    resetBall() {
        this.ball.x = 400
        this.ball.y = 300

        const direction = Phaser.Math.Between(0, 1) === 0 ? -1 : 1

        this.ballVelocity.x = 4 * direction
        this.ballVelocity.y = Phaser.Math.Between(-3, 3)

        if (this.ballVelocity.y === 0) {
            this.ballVelocity.y = 2
        }
    }

    //Regras do Jogo
    checkScore() {
        if (this.ball.x < 0) {
            this.enemyScore++
            this.updateScore()
            this.resetBall()
        }

        if (this.ball.x > 800) {
            this.playerScore++
            this.updateScore()
            this.resetBall()
        }
    }

    updateScore() {
        this.scoreText.setText(`${this.playerScore}  x  ${this.enemyScore}`)
    }

    togglePause() {
      this.isPaused = !this.isPaused
      this.pauseText.setVisible(this.isPaused)
    }

    clearScore(){
      this.enemyScore = 0
      this.playerScore = 0
    }

    resetGame(){
      this.resetBall();
      this.clearScore();
      this.updateScore();
    }
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1d1d1d',
    scene: GameScene
}

new Phaser.Game(config)