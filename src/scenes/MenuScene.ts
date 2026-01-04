import BaseScene from './BaseScene';

import type { SharedConfig, MenuItemConfig } from '@/types';

class MenuScene extends BaseScene {
  private menu: MenuItemConfig[];

  constructor(config: SharedConfig) {
    super('MenuScene', config);

    this.menu = [
      { scene: 'PlayScene', text: 'Play' },
      { scene: 'ScoreScene', text: 'Score' },
      { scene: '', text: 'Exit' },
    ];
  }

  create() {
    super.create();
    this.createMenu(this.menu, this.setupMenuEvents.bind(this));
  }

  setupMenuEvents(menuItem: MenuItemConfig) {
    const textGO = menuItem.textGO;
    textGO?.setInteractive();

    textGO?.on('pointerover', () => {
      textGO.setStyle({ color: '#ff0' });
    });

    textGO?.on('pointerout', () => {
      textGO.setStyle({ color: '#000' });
    });

    textGO?.on('pointerup', () => {
      menuItem.scene && this.scene.start(menuItem.scene);

      if (menuItem.text === 'Exit') {
        this.game.destroy(true);
      }
    });
  }
}

export default MenuScene;
