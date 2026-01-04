import Phaser from 'phaser';

import type { Scene, SharedConfig } from '@/types';

import PlayScene from './scenes/PlayScene';
import MenuScene from './scenes/MenuScene';
import PreloadScene from './scenes/PreloadScene';
import ScoreScene from './scenes/ScoreScene';
import PauseScene from './scenes/PauseScene';

const WIDTH = 800;
const HEIGHT = 600;
const BIRD_POSITION = { x: WIDTH * 0.1, y: HEIGHT / 2 };

const SHARED_CONFIG: SharedConfig = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION,
};

const SCENES: Scene[] = [PreloadScene, MenuScene, ScoreScene, PlayScene, PauseScene];

const createScene = (SceneClass: Scene): Phaser.Scene => new SceneClass(SHARED_CONFIG);
const initScenes = (): Phaser.Scene[] => SCENES.map(createScene);

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
  },
  scene: initScenes(),
};

new Phaser.Game(config);
