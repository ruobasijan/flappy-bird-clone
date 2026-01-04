import Phaser from 'phaser';

export interface SharedConfig {
  width: number;
  height: number;
  startPosition: { x: number; y: number };
  canGoBack?: boolean;
}

export type Scene = new (config: SharedConfig) => Phaser.Scene;

export interface MenuItemConfig {
  scene: string;
  text: string;
  textGO?: Phaser.GameObjects.Text;
}

export type DifficultyName = 'easy' | 'normal' | 'hard';

export interface DifficultyConfig {
  pipeHorizontalDistanceRange: [number, number];
  pipeVerticalDistanceRange: [number, number];
}
