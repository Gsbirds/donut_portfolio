import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
    }

    

    preload ()
    {
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
        this.load.setPath('assets');

        this.load.image('logo', 'donutbox.png');
        this.load.image('first-donut', 'assets/missing-donut-1.png');
        this.load.image('second-donut', 'assets/missing-donut-2.png');

        this.load.image('third-donut', 'assets/missing-donut-3(2).png');

        this.load.image('fourth-donut', 'assets/missing-donut-4.png');

        this.load.image('fifth-donut', 'assets/missing-donut-5.png');
        this.load.image('sixth-donut', 'assets/missing-donut-6.png');

        this.load.image('pink-donut', 'Pink-donut.png');
        this.load.image('blue-donut', 'Blue-donut.png');
        this.load.image('choco-donut', 'Brown-donut.png');

        

    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
