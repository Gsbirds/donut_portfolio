import Phaser from 'phaser';
import { gameConfig } from './config';

/**
 * Boot the Phaser game inside the given parent element.
 *
 * The Scale manager (configured in `gameConfig`) handles fitting and centring
 * the canvas, so we no longer mutate the container's inline height here.
 *
 * @param {string} parent - id of the DOM element that hosts the canvas.
 * @returns {Phaser.Game}
 */
const StartGame = (parent) => new Phaser.Game({ ...gameConfig, parent });

export default StartGame;
