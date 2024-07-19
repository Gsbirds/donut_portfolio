import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.add.image(512, 384, 'background');


        this.add.image(512, 300, 'first-donut');

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
