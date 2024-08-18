import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
         if (window.location.pathname === '/home') {
            localStorage.removeItem('donutClicked');

         }

        const isDonutClicked = JSON.parse(localStorage.getItem('donutClicked'));
        
        if (isDonutClicked) {
            this.logo = this.add.image(100, 30, 'closed').setDepth(100).setScale(0.3);
    
            this.createSlidingDonuts();
    
            this.logo.setInteractive();
    
            this.logo.on('pointerover', () => {
                this.input.manager.canvas.style.cursor = 'pointer';
                this.logo.setTexture('mostlyclosed'); 
            });
    
            this.logo.on('pointerout', () => {
                this.input.manager.canvas.style.cursor = 'default';
                this.logo.setTexture('closed');
            });
    
            return;
        }
    
        this.showInitialImages(() => {
            const background = this.add.image(512, 384, 'background');
            background.setAlpha(0);
            this.logo = this.add.image(712, 495, 'logo').setDepth(100).setScale(0.75);
    
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

    createSlidingDonuts() {
        const donutImages = ['pink-donut', 'blue-donut', 'choco-donut', 'pink-donut', 'blue-donut', 'choco-donut'];
        const donutLinks = ['Home', 'Projects', 'About', 'Contact', 'Art', 'Blog'];
    
        const donuts = [];
        const linkTexts = [];
        let hideDonutsTimer; // Timer for hiding donuts after pointer out
        let menuStaysOut = false; // Flag to keep the menu out when the box is clicked
    
        const initialYPosition = 100;
    
        for (let i = 0; i < donutImages.length; i++) {
            const initialXPosition = 200 + (i * 150); 
    
            const donut = this.add.image(initialXPosition, initialYPosition, donutImages[i])
                .setDepth(101)
                .setScale(0.25)
                .setAlpha(0)
                .setInteractive()
                .setName(donutLinks[i]);

    
            const linkText = this.add.text(initialXPosition, initialYPosition + 70, donutLinks[i], {   fontSize:25,
                fontFamily: 'Cedarville Cursive',
                className: 'cedarville-cursive-regular',fill: '#a94064' })
                .setOrigin(0.5)
                .setDepth(102)
                .setAlpha(0)
                .setInteractive();
    
            donut.on('pointerover', () => {
                clearTimeout(hideDonutsTimer);
                this.input.manager.canvas.style.cursor = 'pointer';
                this.highlightLink(donutLinks[i], true);
    
                this.tweens.add({
                    targets: donut,
                    scale: 0.4,
                    duration: 200,
                    ease: 'Power2'
                });
    
                this.tweens.add({
                    targets: linkText,
                    scale: 1.2, 
                    duration: 200,
                    ease: 'Power2'
                });
            });
    
            donut.on('pointerout', () => {
                this.input.manager.canvas.style.cursor = 'default';
                this.highlightLink(donutLinks[i], false);
    
                this.tweens.add({
                    targets: donut,
                    scale: 0.3,
                    duration: 200,
                    ease: 'Power2'
                });
    
                this.tweens.add({
                    targets: linkText,
                    scale: 1, 
                    duration: 200,
                    ease: 'Power2'
                });
    
                if (!menuStaysOut) {
                    hideDonutsTimer = setTimeout(() => {
                        this.hideDonuts(donuts, linkTexts);
                    }, 1500);
                }
            });
    
            linkText.on('pointerdown', () => {
                const url = `${window.location.origin}/${donutLinks[i].toLowerCase()}`;
                window.location.href = url;
            });
    
            donut.on('pointerdown', () => {
                let url;
                if (donutLinks[i] === 'Blog') {
                    url = 'https://calm-reef-66202-3443b850ed8c.herokuapp.com/';
                } else {
                    url = `${window.location.origin}/${donutLinks[i].toLowerCase()}`;
                }
                window.location.href = url;
            });
    
            donuts.push(donut);
            linkTexts.push(linkText);
        }
    
        this.logo.setInteractive();
    
        this.logo.on('pointerover', () => {
            clearTimeout(hideDonutsTimer); // Clear the hide timer if pointer re-enters
            this.input.manager.canvas.style.cursor = 'pointer';
            if (!menuStaysOut) {
                this.showDonuts(donuts, linkTexts);
            }
        });
    
        this.logo.on('pointerout', () => {
            this.input.manager.canvas.style.cursor = 'default';
    
            if (!menuStaysOut) {
                hideDonutsTimer = setTimeout(() => {
                    this.hideDonuts(donuts, linkTexts);
                }, 1500);
            }
        });
    
        this.logo.on('pointerdown', () => {
            if (menuStaysOut) {
                // If the menu is out, clicking will hide the donuts
                this.hideDonuts(donuts, linkTexts);
                menuStaysOut = false; // Set the state to false so the next click or hover shows the donuts
            } else {
                // If the menu is not out, clicking will keep the donuts visible
                clearTimeout(hideDonutsTimer); // Prevent hiding when the box is clicked
                this.showDonuts(donuts, linkTexts); // Ensure donuts are shown
                menuStaysOut = true; // Set the state to true to keep the donuts out
            }
        });
    }
    
    showDonuts(donuts, linkTexts) {
        for (let i = 0; i < donuts.length; i++) {
            this.tweens.add({
                targets: donuts[i],
                x: 350 + (i * 150),
                alpha: 1,
                duration: 500,
                ease: 'Power2'
            });
    
            this.tweens.add({
                targets: linkTexts[i],
                x: 350 + (i * 150),
                alpha: 1,
                duration: 500,
                ease: 'Power2'
            });
        }
    }
    
    hideDonuts(donuts, linkTexts) {
        for (let i = 0; i < donuts.length; i++) {
            this.tweens.add({
                targets: donuts[i],
                x: 200 + (i * 150),
                alpha: 0,
                duration: 500,
                ease: 'Power2'
            });
    
            this.tweens.add({
                targets: linkTexts[i],
                x: 200 + (i * 150),
                alpha: 0,
                duration: 500,
                ease: 'Power2'
            });
        }
    }
    
    
    
    
    showInitialImages(callback) {
        const background = this.add.image(512, 384, 'background');
        background.setAlpha(0);
        const showImage = (x, y, key, scale, delay, next) => {
            const image = this.add.image(x, y, key).setDepth(200).setScale(scale);
            this.time.delayedCall(delay, () => {
                image.destroy();
                if (next) {
                    next();
                } else {
                    callback();
                }
            });
        };

        showImage(712, 495, 'closed', 0.75, 100, () => {
            showImage(712, 495, 'mostlyclosed', 0.75, 100, () => {
                showImage(712, 495, 'halfway', 0.75, 100, () => {
                    showImage(712, 495, 'mostlyopen', 0.75, 100, callback);
                });
            });
        });
    }

    reverseImages(callback) {
        const sizes = [0.75, 0.6, 0.5, 0.3];
        const keys = ['mostlyopen', 'halfway', 'mostlyclosed', 'closed'];
        const delays = [100, 100, 100, 100];
        let imageIndex = 0;

        const reverseImage = () => {
            if (imageIndex < keys.length) {
                this.logo.setTexture(keys[imageIndex]);
                this.logo.setScale(sizes[imageIndex]);
                this.time.delayedCall(delays[imageIndex], () => {
                    imageIndex++;
                    reverseImage();
                });
            } else {
                callback();
            }
        };

        reverseImage();
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

            this.logo = this.add.image(612, 495, imageName).setScale(0.75);

            this.addSprite(spriteName);

            this.reverseImages(() => {
                this.tweens.add({
                    targets: this.logo,
                    x: 100,
                    y: 50,
                    duration: 1000,
                    ease: 'Power2',
                    onComplete: () => {
                        const url = `${window.location.origin}/${name.toLowerCase()}`;
                        window.location.href = url;
                        EventBus.emit('donut-clicked', true);
                    }
                });
            });

        });

    }

    createLink(x, y, label, imageName) {
        const linkText = this.add.text(x, y, label, {
            fontSize:25,
            fontFamily: 'Cedarville Cursive', // Apply the font directly if loaded via CSS
            className: 'cedarville-cursive-regular', // Apply the class name
        }).setOrigin(0.5).setDepth(101).setInteractive();
        
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
    
            this.logo = this.add.image(512, 300, imageName).setDepth(200).setScale(0.75);
            
            this.addSprite(spriteName);
    
            this.reverseImages(() => {
                this.tweens.add({
                    targets: this.logo,
                    x: 100,
                    y: 50,
                    duration: 1000,
                    ease: 'Power2',
                    onComplete: () => {
                        let url;
                        if (label === 'Blog') {
                            url = 'https://calm-reef-66202-3443b850ed8c.herokuapp.com/';
                        } else {
                            url = `${window.location.origin}/${label.toLowerCase()}`;
                        }
                        window.location.href = url;
                        EventBus.emit('donut-clicked', true);
                    }
                });
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
