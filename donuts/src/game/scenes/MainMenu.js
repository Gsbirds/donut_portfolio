import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        this.showInitialImages(() => {
            const background = this.add.image(512, 384, 'background');
            background.setAlpha(0);
            this.logo = this.add.image(612, 495, 'logo').setDepth(100);

            this.createInteractiveZone(this.logo.x - 50, this.logo.y + 200, 75, 'Home', 'first-donut');
            this.createInteractiveZone(this.logo.x + 100, this.logo.y + 200, 75, 'Projects', 'second-donut');
            this.createInteractiveZone(this.logo.x + 250, this.logo.y + 200, 75, 'About', 'third-donut');
            this.createInteractiveZone(this.logo.x + 100, this.logo.y + 300, 75, 'Contact', 'fourth-donut');
            this.createInteractiveZone(this.logo.x + 250, this.logo.y + 300, 75, 'Art', 'fifth-donut');
            this.createInteractiveZone(this.logo.x + 400, this.logo.y + 300, 75, 'Blog', 'sixth-donut');

            this.createLink(this.logo.x - 190, this.logo.y + 130, 'Home', 'first-donut');
            this.createLink(this.logo.x - 20, this.logo.y + 70, 'Projects', 'second-donut');
            this.createLink(this.logo.x + 160, this.logo.y + 20, 'About', 'third-donut');
            this.createLink(this.logo.x + 100, this.logo.y + 350, 'Contact', 'fourth-donut');
            this.createLink(this.logo.x + 250, this.logo.y + 300, 'Art', 'fifth-donut'); 
            this.createLink(this.logo.x + 400, this.logo.y + 240, 'Blog', 'sixth-donut'); 

            EventBus.emit('current-scene-ready', this);
            EventBus.emit('logo-position', { x: this.logo.x, y: this.logo.y });
        });
    }

    showInitialImages(callback) {
        const background = this.add.image(512, 384, 'background');
        background.setAlpha(0);
        const showImage = (x, y, key, delay, next) => {
            const image = this.add.image(x, y, key).setDepth(200);
            this.time.delayedCall(delay, () => {
                image.destroy();
                if (next) {
                    next();
                } else {
                    callback();
                }
            });
        };
    
        showImage(612, 495, 'closed', 100, () => {
            showImage(612, 495, 'mostlyclosed', 100, () => {
                showImage(612, 495, 'halfway', 100, () => {
                    showImage(612, 495, 'mostlyopen', 100, callback);
                });
            });
        });
    }

    reverseImages(callback) {
        const sizes = [1, 0.8, 0.6, 0.4];
        const keys = ['mostlyopen', 'halfway', 'mostlyclosed', 'closed'];
        const delays = [100, 100, 100, 100];

        const showImage = (x, y, key, size, delay, next) => {
            const image = this.add.image(x, y, key).setDepth(200).setScale(size);
            this.time.delayedCall(delay, () => {
                image.destroy();
                if (next) {
                    next();
                } else {
                    callback();
                }
            });
        };

        const chainImages = (index) => {
            if (index < keys.length) {
                showImage(612, 495, keys[index], sizes[index], delays[index], () => chainImages(index + 1));
            } else {
                callback();
            }
        };

        chainImages(0);
    }

    addSprite(spriteName) {
        const scene = this;

        if (scene) {
            const x = scene.scale.width / 2;
            const y = scene.scale.height / 2;

            const star = scene.add.sprite(x, y, spriteName);
            star.setDepth(1000);

            scene.add.tween({
                targets: star,
                y: { start: y - 200, to: y + 200 },
                duration: 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            scene.add.tween({
                targets: star,
                angle: 360,
                duration: 1000,
                repeat: -1
            });

            scene.time.delayedCall(4000, () => {
                star.destroy();
            });
        }
    }

    createInteractiveZone(x, y, radius, name, imageName) {
        const zone = this.add.zone(x, y, radius * 2, radius * 2).setCircleDropZone(radius).setName(name).setInteractive();

        zone.on('pointerover', () => {
            this.input.manager.canvas.style.cursor = 'pointer';
            this.highlightLink(name, true);
        });
        zone.on('pointerout', () => {
            this.input.manager.canvas.style.cursor = 'default';
            this.highlightLink(name, false);
        });

        zone.on('pointerdown', () => {
            let spriteName;
            if (name === 'Home' || name === 'Art') {
                spriteName = 'pink-donut';
            } else if (name === 'Projects' || name === 'Blog') {
                spriteName = 'blue-donut';
            } else if (name === 'About' || name === 'Contact') {
                spriteName = 'choco-donut';
            }

            if (this.logo) {
                this.logo.destroy();
            }

            this.logo = this.add.image(612, 495, imageName).setDepth(200);
            
            this.addSprite(spriteName);

            this.reverseImages(() => {
                const url = `${window.location.origin}/${name.toLowerCase()}`;
                window.location.href = url;
            });
        });
    }

    createLink(x, y, label, imageName) {
        const linkText = this.add.text(x, y, label, { fontSize: '16px', fill: '#a94064' }).setOrigin(0.5).setDepth(101).setInteractive();

        linkText.on('pointerover', () => {
            this.input.manager.canvas.style.cursor = 'pointer';
            linkText.setStyle({ fill: '#fc5c85' });
        });

        linkText.on('pointerout', () => {
            this.input.manager.canvas.style.cursor = 'default';
            linkText.setStyle({ fill: '#a94064' });
        });

        linkText.on('pointerdown', () => {
            let spriteName;
            if (label === 'Home' || label === 'Art') {
                spriteName = 'pink-donut';
            } else if (label === 'Projects' || label === 'Blog') {
                spriteName = 'blue-donut';
            } else if (label === 'About' || label === 'Contact') {
                spriteName = 'choco-donut';
            }

            if (this.logo) {
                this.logo.destroy();
            }

            this.logo = this.add.image(512, 300, imageName).setDepth(200);
            
            this.addSprite(spriteName);

            this.reverseImages(() => {
                const url = `${window.location.origin}/${label.toLowerCase()}`;
                window.location.href = url;
            });
        });

        this.links = this.links || {};
        this.links[label] = linkText;
    }

    highlightLink(label, highlight) {
        const linkText = this.links[label];
        if (linkText) {
            linkText.setStyle({ fill: highlight ? '#fc5c85' : '#a94064' });
        }
    }

    changeScene() {
        if (this.logoTween) {
            this.logoTween.stop();
            this.logoTween = null;
        }
        this.scene.start('Game');
    }

    moveLogo(reactCallback) {
        if (this.logoTween) {
            if (this.logoTween.isPlaying()) {
                this.logoTween.pause();
            } else {
                this.logoTween.play();
            }
        } else {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: 'Back.easeInOut' },
                y: { value: 80, duration: 1500, ease: 'Sine.easeOut' },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (reactCallback) {
                        reactCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y)
                        });
                    }
                }
            });
        }
    }
}
