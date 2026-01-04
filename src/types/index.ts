import Phaser from "phaser";

export interface SharedConfig {
    width: number;
    height: number;
    startPosition: { x: number; y: number };
    canGoBack?: boolean;
}

export type Scene = new (config: SharedConfig) => Phaser.Scene;
