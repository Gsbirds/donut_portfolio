import Phaser from 'phaser';
import { gameConfig } from './config';

const StartGame = (parent) => new Phaser.Game({ ...gameConfig, parent });

export default StartGame;
