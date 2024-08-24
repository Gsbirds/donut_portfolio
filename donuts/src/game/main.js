import { Boot } from './scenes/Boot';
import { MainMenu } from './scenes/MainMenu';
import Phaser from 'phaser';
import { Preloader } from './scenes/Preloader';

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    height: 1020,
    parent: 'game-container',
    transparent: true,

    scene: [
        Boot,
        Preloader,
        MainMenu,
    ]
};

const StartGame = (parent) => {
    const isDonutClicked = JSON.parse(localStorage.getItem('donutClicked'));

    if (isDonutClicked) {
        document.getElementById(parent).style.height = '300px';
    } else {
        document.getElementById(parent).style.height = '1020px'; 
    }

    return new Phaser.Game({ ...config, parent });
}


export default StartGame;
