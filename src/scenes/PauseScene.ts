import BaseScene from './BaseScene';

import type { MenuItemConfig, SharedConfig } from '@/types';

class PauseScene extends BaseScene {
  private menu: MenuItemConfig[];

  constructor(config: SharedConfig) {
    super('PauseScene', config);

    this.menu = [
      { scene: 'PlayScene', text: 'Continue' },
      { scene: 'MenuScene', text: 'Exit' },
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
      if (menuItem.scene && menuItem.text === 'Continue') {
        this.scene.stop();
        this.scene.resume(menuItem.scene);
      } else {
        this.scene.stop('PlayScene');
        this.scene.start(menuItem.scene);
      }
    });
  }
}

export default PauseScene;
