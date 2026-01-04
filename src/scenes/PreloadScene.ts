import Phaser from 'phaser';

class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    this.load.image('sky', 'images/sky.png');
    this.load.spritesheet('bird', 'images/birdSprite.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image('pipe', 'images/pipe.png');
    this.load.image('pause', 'images/pause.png');
    this.load.image('back', 'images/back.png');
  }

  create() {
    this.scene.start('MenuScene');
  }
}

export default PreloadScene;
