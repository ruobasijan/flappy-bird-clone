import Phaser from 'phaser';

import BaseScene from './BaseScene';

import type { SharedConfig, DifficultyName, DifficultyConfig } from '@/types';

const PIPES_TO_RENDER = 4;

class PlayScene extends BaseScene {
  protected bird!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  protected pipes!: Phaser.Physics.Arcade.Group;
  protected isPaused = false;
  protected pipeHorizontalDistance = 0;
  protected pipeVerticalDistanceRange: [number, number] = [200, 200];
  protected pipeHorizontalDistanceRange: [number, number] = [300, 300];
  protected flapVelocity = 300;
  protected score = 0;
  protected scoreText!: Phaser.GameObjects.Text;
  protected currentDifficulty: DifficultyName = 'easy';
  protected difficulties: Record<DifficultyName, DifficultyConfig>;
  protected pauseEvent?: Phaser.Events.EventEmitter;
  protected initialTime!: number;
  protected countDownText!: Phaser.GameObjects.Text;
  protected timedEvent!: Phaser.Time.TimerEvent;

  constructor(config: SharedConfig) {
    super('PlayScene', config);
    this.difficulties = {
      easy: { pipeHorizontalDistanceRange: [300, 350], pipeVerticalDistanceRange: [150, 200] },
      normal: { pipeHorizontalDistanceRange: [280, 330], pipeVerticalDistanceRange: [140, 190] },
      hard: { pipeHorizontalDistanceRange: [250, 310], pipeVerticalDistanceRange: [50, 100] },
    };
  }

  create(): void {
    this.currentDifficulty = 'easy';
    super.create();
    this.createBird();
    this.createPipes();
    this.handleInputs();
    this.createScore();
    this.createPause();
    this.createColliders();
    this.listenToEvents();

    this.anims.create({
      key: 'fly',
      frames: this.anims.generateFrameNumbers('bird', { start: 9, end: 15 }),
      frameRate: 8,
      repeat: -1,
    });

    this.bird.play('fly');
  }

  update(): void {
    this.checkGameStatus();
    this.recyclePipes();
  }

  listenToEvents(): void {
    this.events.on('resume', () => {
      if (this.pauseEvent) return;

      this.pauseEvent = this.events.on('resume', () => {
        this.initialTime = 3;
        this.countDownText = this.add
          .text(...this.screenCenter, 'Fly in: ' + this.initialTime, this.fontOptions)
          .setOrigin(0.5);

        this.timedEvent = this.time.addEvent({
          delay: 1000,
          callback: this.countDown,
          callbackScope: this,
          loop: true,
        });
      });
    });
  }

  countDown(): void {
    this.initialTime--;
    this.countDownText.setText('Fly in: ' + this.initialTime);
    if (this.initialTime <= 0) {
      this.isPaused = false;
      this.countDownText.setText('');
      this.physics.resume();
      this.timedEvent.remove();
    }
  }

  createBG(): void {
    this.add.image(0, 0, 'sky').setOrigin(0);
  }

  createBird(): void {
    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird')
      .setFlipX(true)
      .setScale(3)
      .setOrigin(0);

    this.bird.setBodySize(this.bird.width, this.bird.height - 8);
    this.bird.body.gravity.y = 600;
    this.bird.setCollideWorldBounds(true);
  }

  createPipes(): void {
    this.pipes = this.physics.add.group();

    for (let i = 0; i < PIPES_TO_RENDER; i++) {
      const upperPipe = this.pipes.create(0, 0, 'pipe').setImmovable(true).setOrigin(0, 1);
      const lowerPipe = this.pipes.create(0, 0, 'pipe').setImmovable(true).setOrigin(0, 0);

      this.placePipe(
        upperPipe as Phaser.GameObjects.Sprite,
        lowerPipe as Phaser.GameObjects.Sprite,
      );
    }

    this.pipes.setVelocityX(-200);
  }

  createScore(): void {
    this.score = 0;
    const bestScore = localStorage.getItem('bestScore');
    this.scoreText = this.add.text(16, 16, `Score: ${0}`, {
      fontSize: '32px',
      color: '#000',
    });
    this.add.text(16, 52, `Best Score: ${bestScore || 0}`, {
      fontSize: '32px',
      color: '#000',
    });
  }

  createPause(): void {
    this.isPaused = false;
    const pauseButton = this.add
      .image(this.config.width - 10, this.config.height - 10, 'pause')
      .setInteractive()
      .setScale(3)
      .setOrigin(1);

    pauseButton.on('pointerdown', () => {
      this.isPaused = true;
      this.physics.pause();
      this.scene.pause();
      this.scene.launch('PauseScene');
    });
  }

  handleInputs(): void {
    this.input.on('pointerdown', this.flap, this);
    this.input.keyboard?.on('keydown-SPACE', this.flap, this);
  }

  checkGameStatus(): void {
    if (this.bird.getBounds().bottom >= this.config.height || this.bird.y <= 0) {
      this.gameOver();
    }
  }

  placePipe(uPipe: Phaser.GameObjects.Sprite, lPipe: Phaser.GameObjects.Sprite): void {
    const difficulty = this.difficulties[this.currentDifficulty];
    const rightMostX = this.getRightMostPipe();
    const pipeVerticalDistance = Phaser.Math.Between(...difficulty.pipeVerticalDistanceRange);
    const pipeVerticalPosition = Phaser.Math.Between(
      20,
      this.config.height - 20 - pipeVerticalDistance,
    );
    const pipeHorizontalDistance = Phaser.Math.Between(...difficulty.pipeHorizontalDistanceRange);

    uPipe.x = rightMostX + pipeHorizontalDistance;
    uPipe.y = pipeVerticalPosition;

    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeVerticalDistance;
  }

  createColliders(): void {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, undefined, this);
  }

  recyclePipes(): void {
    const tempPipes: Phaser.GameObjects.GameObject[] = [];
    this.pipes.getChildren().forEach((pipe) => {
      if ((pipe as Phaser.GameObjects.Sprite).getBounds().right <= 0) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this.placePipe(
            tempPipes[0] as Phaser.GameObjects.Sprite,
            tempPipes[1] as Phaser.GameObjects.Sprite,
          );
          this.increaseScore();
          this.saveBestScore();
          this.increaseDifficulty();
        }
      }
    });
  }

  increaseDifficulty(): void {
    if (this.score === 1) this.currentDifficulty = 'normal';
    if (this.score === 3) this.currentDifficulty = 'hard';
  }

  getRightMostPipe(): number {
    let rightMostX = 500;
    this.pipes.getChildren().forEach((pipe) => {
      rightMostX = Math.max((pipe as Phaser.GameObjects.Sprite).x, rightMostX);
    });
    return rightMostX;
  }

  saveBestScore(): void {
    const bestScoreText = localStorage.getItem('bestScore');
    const bestScore = bestScoreText && parseInt(bestScoreText, 10);

    if (!bestScore || this.score > bestScore) {
      localStorage.setItem('bestScore', this.score.toString());
    }
  }

  gameOver = (): void => {
    this.physics.pause();
    this.bird.setTint(0xee4824);

    this.saveBestScore();

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
      },
      loop: false,
    });
  };

  flap(): void {
    if (this.isPaused) return;
    this.bird.body.velocity.y = -this.flapVelocity;
  }

  increaseScore(): void {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
  }
}

export default PlayScene;
