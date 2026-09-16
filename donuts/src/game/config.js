import Phaser from 'phaser';
import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { MainMenu } from './scenes/MainMenu';

/**
 * Fixed design resolution for the game world.
 *
 * All scene coordinates are authored against this space. The Scale manager
 * (FIT + CENTER_BOTH) then uniformly scales and centres the canvas inside its
 * parent container, so the artwork and its interactive hit areas always line
 * up regardless of the viewport size. This is what keeps the donut box
 * centred and clickable.
 */
export const GAME_WIDTH = 1024;
export const GAME_HEIGHT = 1220;

/** Shared Phaser game configuration. */
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
        // Enable mouse and touch, and allow multi-touch so taps register
        // reliably on mobile devices. Don't preventDefault on wheel/touch so
        // the page underneath the (sticky, overlapping) menu still scrolls
        // naturally even when the pointer is over the canvas.
        mouse: { preventDefaultWheel: false },
        touch: { capture: false },
        activePointers: 3,
    },
    scene: [Boot, Preloader, MainMenu],
};
