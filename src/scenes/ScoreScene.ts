import BaseScene from './BaseScene';

import type { SharedConfig } from "@/types";

class ScoreScene extends BaseScene {

    constructor(config: SharedConfig) {
        super('ScoreScene', { ...config, canGoBack: true });
    }

    create() {
        super.create();

        const bestScore = localStorage.getItem('bestScore');
        this.add.text(...this.screenCenter, `Best Score: ${bestScore || 0}`, this.fontOptions)
            .setOrigin(0.5)
    }
}

export default ScoreScene;
