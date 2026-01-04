import Phaser from 'phaser';

import type { SharedConfig, MenuItemConfig } from '@/types';

class BaseScene extends Phaser.Scene {
  protected config: SharedConfig;
  protected screenCenter: [number, number];
  protected fontSize = 34;
  protected lineHeight = 42;
  protected fontOptions: Phaser.Types.GameObjects.Text.TextStyle;

  constructor(key: string, config: SharedConfig) {
    super(key);
    this.config = config;
    this.screenCenter = [config.width / 2, config.height / 2];
    this.fontOptions = { fontSize: `${this.fontSize}px`, color: '#000' };
  }

  create() {
    this.add.image(0, 0, 'sky').setOrigin(0);

    if (this.config.canGoBack) {
      const backButton = this.add
        .image(this.config.width - 2, this.config.height - 2, 'back')
        .setOrigin(1)
        .setScale(2)
        .setInteractive();

      backButton.on('pointerup', () => {
        this.scene.start('MenuScene');
      });
    }
  }

  createMenu(menu: MenuItemConfig[], setupMenuEvents: (menuItem: MenuItemConfig) => void) {
    let lastMenuPositionY = 0;

    menu.forEach((menuItem) => {
      const menuPosition: [number, number] = [
        this.screenCenter[0],
        this.screenCenter[1] + lastMenuPositionY,
      ];
      menuItem.textGO = this.add
        .text(...menuPosition, menuItem.text, this.fontOptions)
        .setOrigin(0.5, 1);
      lastMenuPositionY += this.lineHeight;
      setupMenuEvents(menuItem);
    });
  }
}

export default BaseScene;
