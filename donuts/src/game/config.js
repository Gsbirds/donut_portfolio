import Phaser from 'phaser';
import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { MainMenu } from './scenes/MainMenu';

// Fixed design resolution. Scenes author coordinates against this; the Scale
// manager (FIT + CENTER_BOTH) scales and centres the canvas to fit its parent.
export const GAME_WIDTH = 1024;
export const GAME_HEIGHT = 1220;

export const gameConfig = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    transparent: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    input: {
        // Don't preventDefault wheel/touch, so the page still scrolls under the
        // sticky canvas. activePointers > 1 for reliable multi-touch taps.
        mouse: { preventDefaultWheel: false },
        touch: { capture: false },
        activePointers: 3,
    },
    scene: [Boot, Preloader, MainMenu],
};
