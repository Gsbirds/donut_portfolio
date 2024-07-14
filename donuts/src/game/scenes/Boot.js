import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background', 'assets/donutwallpaper.png');
        this.load.image('first-donut', 'assets/missing-donut-1.png');
        this.load.image('second-donut', 'assets/missing-donut-2.png');

        this.load.image('third-donut', 'assets/missing-donut-3(2).png');

        this.load.image('fourth-donut', 'assets/missing-donut-4.png');

        this.load.image('fifth-donut', 'assets/missing-donut-5.png');
        this.load.image('sixth-donut', 'assets/missing-donut-6.png');
    
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
