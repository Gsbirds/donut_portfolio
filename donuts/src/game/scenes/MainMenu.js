import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        const scaleFactor = Math.min(window.innerWidth / 1520, window.innerHeight / 680);
    
        const isPageRefreshed = performance.navigation.type === performance.navigation.TYPE_RELOAD;
    
        const currentPath = window.location.href;
    
        if (currentPath.includes('home')) {
            localStorage.removeItem('donutClicked');
            EventBus.emit('home-menu-clicked', true);    
            if (isPageRefreshed) {
                EventBus.emit('home-menu-clicked', false);
            }
        }

        if (currentPath=='https://gsbirds.github.io/donut_portfolio/'){
            EventBus.emit('home-menu-clicked', false);

        }
    
        const isDonutClicked = JSON.parse(localStorage.getItem('donutClicked'));
    
        if (isDonutClicked) {
            this.showInitialClosedBox(scaleFactor);
            EventBus.emit('donut-hovered', false);

        } else {
            this.showInitialOpenBox(scaleFactor);
        }


        // this.checkDonutHover()

        
    }
    

    showInitialClosedBox(scaleFactor) {
        this.checkLogoHover()
        if (window.location.pathname !== '/home') {
            EventBus.emit('home-menu-clicked', false);
        }
    
        this.logo = this.add.image(120, 30, 'closed').setDepth(100).setScale(0.3 * scaleFactor);
        this.createSlidingDonuts(scaleFactor);
        
        this.logo.setInteractive();
    
        window.addEventListener('resize', () => {
            this.resizeHandler();
        });
    
        this.logo.on('pointerover', () => {
            this.input.manager.canvas.style.cursor = 'pointer';
            this.logo.setTexture('mostlyclosed');
            EventBus.emit('donut-hovered', true );

        });

        this.logo.on('pointerout', () => {
            this.input.manager.canvas.style.cursor = 'default';
            this.logo.setTexture('closed');
            EventBus.emit('donut-hovered', false );

        });
        return;
    }
 


    showInitialOpenBox(scaleFactor){
        this.showInitialImages(() => {
            const background = this.add.image(512, 384, 'background');
            background.setAlpha(0);
    
            let logoX, logoY;
    
            const isSmallScreen = window.innerWidth <= 768;
            
            if (isSmallScreen) {
                logoX = 254;
                logoY = 712;
            } else {
                logoX = 442;
                logoY = 744;
            }
    
            const baseLogoSize = 480;
            const baseLogoScale = 0.75 * scaleFactor;
            const logoWidth = this.textures.get('logo').getSourceImage().width;
            const calculatedScale = Math.max(baseLogoSize / logoWidth, baseLogoScale);
    
            this.logo = this.add.image(logoX, logoY, 'logo')
                .setDepth(100)
                .setScale(calculatedScale);
    
            this.createInteractiveZoneRelativeToLogo(-50, 200, 75 * calculatedScale, 'Home', 'first-donut');
            this.createInteractiveZoneRelativeToLogo(100, 200, 75 * calculatedScale, 'Projects', 'second-donut');
            this.createInteractiveZoneRelativeToLogo(250, 200, 75 * calculatedScale, 'About', 'third-donut');
            this.createInteractiveZoneRelativeToLogo(100, 300, 75 * calculatedScale, 'Contact', 'fourth-donut');
            this.createInteractiveZoneRelativeToLogo(250, 300, 75 * calculatedScale, 'Resume', 'fifth-donut');
            this.createInteractiveZoneRelativeToLogo(400, 300, 75 * calculatedScale, 'Blog', 'sixth-donut');
    
            this.createLinkRelativeToLogo(-190, 130, 'Home', 'first-donut', calculatedScale, Phaser.Math.DegToRad(-19));
            this.createLinkRelativeToLogo(-20, 70, 'Projects', 'second-donut', calculatedScale, Phaser.Math.DegToRad(-19));
            this.createLinkRelativeToLogo(130, 20, 'About', 'third-donut', calculatedScale, Phaser.Math.DegToRad(-19));
            this.createLinkRelativeToLogo(100, 370, 'Contact', 'fourth-donut', calculatedScale, Phaser.Math.DegToRad(-25));
            this.createLinkRelativeToLogo(250, 290, 'Resume', 'fifth-donut', calculatedScale, Phaser.Math.DegToRad(-25));
            this.createLinkRelativeToLogo(400, 220, 'Blog', 'sixth-donut', calculatedScale, Phaser.Math.DegToRad(-25));
    
            EventBus.emit('current-scene-ready', this);
            EventBus.emit('logo-position', { x: this.logo.x, y: this.logo.y });
        });

    }
    

   
    createSlidingDonuts(scaleFactor) {
        const donutImages = ['pink-donut', 'blue-donut', 'choco-donut', 'pink-donut', 'blue-donut', 'choco-donut'];
        const donutLinks = ['Home', 'Projects', 'About', 'Contact', 'Blog', 'Resume'];
    
        this.donuts = [];
        this.linkTexts = [];
        let hideDonutsTimer;
        let menuStaysOut = false;
    
        const isSmallScreen = window.innerWidth <= 768;
        const isLargeScreen = window.innerWidth > 1100;
        const maxDonutWidth = 100;
        const maxDonutHeight = 100;

        const donutGap = isLargeScreen ? 5 : 20;
        const textGap = isLargeScreen ? 70 : 50;
    
    
        for (let i = 0; i < donutImages.length; i++) {
            const position = this.calculateDonutPosition(i, scaleFactor, isSmallScreen, donutGap);
    
            const donut = this.add.image(position.x, position.y, donutImages[i]).setDepth(101);
    
            const donutWidth = donut.width * 0.3 * scaleFactor;
            const donutHeight = donut.height * 0.3 * scaleFactor;
    
            const adjustedDonutScaleFactor = Math.min(
                0.3 * scaleFactor,
                maxDonutWidth / donut.width,
                maxDonutHeight / donut.height
            );
    
            donut.setScale(adjustedDonutScaleFactor)
                .setAlpha(0) 
                .setInteractive({ useHandCursor: true })
                .setName(donutLinks[i]);

    
            const linkText = this.add.text(position.x, position.y + textGap, donutLinks[i], {
                fontSize: 25,
                fontFamily: 'Cedarville Cursive',
                className: 'cedarville-cursive-regular',
                fill: '#3e4346'
            }).setOrigin(0.5).setDepth(102).setAlpha(0).setInteractive({ useHandCursor: true });
    

            donut.on('pointerover', () => {
                clearTimeout(hideDonutsTimer);
                this.input.manager.canvas.style.cursor = 'pointer';
                EventBus.emit('donut-hovered', true);
            });
                
            donut.on('pointerout', () => {
                this.input.manager.canvas.style.cursor = 'default';
                EventBus.emit('donut-hovered', false);

                if (!menuStaysOut) {
                    hideDonutsTimer = setTimeout(() => {
                        this.hideDonuts(this.donuts, this.linkTexts);
                    }, 1500);
                }
            });
    
            donut.on('pointerdown', () => {
                let url;
                if (donutLinks[i] === 'Blog') {
                    url = 'https://calm-reef-66202-3443b850ed8c.herokuapp.com/';donut_portfolio
                } else if (donutLinks[i] === 'Resume') {
                    url = `./assets/resume.pdf`;
                } else {
                    if (donutLinks[i]=='Home'){

                    this.tweens.add({
                        targets: donut,
                        angle: { from: 0, to: 360 },
                        ease: 'Sine.easeInOut',
                        onComplete: () => {
                        EventBus.emit('home-menu-clicked', true);
                        }
                    });
                    }
                    url = `${window.location.origin}/donut_portfolio/${donutLinks[i].toLowerCase()}`;
                }
    
                this.tweens.add({
                    targets: donut,
                    angle: { from: 0, to: 360 },
                    ease: 'Sine.easeInOut',
                    onComplete: () => {
                        window.location.href = url;
                    }
                });
            });
    
            this.donuts.push(donut);
            this.linkTexts.push(linkText);
        }

        this.checkDonutHover()
        this.logo.setInteractive();
    
        this.logo.on('pointerover', () => {
            clearTimeout(hideDonutsTimer);
            this.input.manager.canvas.style.cursor = 'pointer';
            if (!menuStaysOut) {
                const isSmallScreen = window.innerWidth <= 768;
                this.showDonuts(this.donuts, this.linkTexts, isSmallScreen, donutGap);
            }
        });
    
        this.logo.on('pointerout', () => {
            this.input.manager.canvas.style.cursor = 'default';
            if (!menuStaysOut) {
                hideDonutsTimer = setTimeout(() => {
                    const isSmallScreen = window.innerWidth <= 768;
                    this.hideDonuts(this.donuts, this.linkTexts, isSmallScreen);
                }, 1500);
            }
        });
    
        this.logo.on('pointerdown', () => {
            const isSmallScreen = window.innerWidth <= 768;
            if (menuStaysOut) {
                this.hideDonuts(this.donuts, this.linkTexts, isSmallScreen);
                menuStaysOut = false;
            } else {
                clearTimeout(hideDonutsTimer);
                this.showDonuts(this.donuts, this.linkTexts, isSmallScreen, donutGap); 
                menuStaysOut = true;
            }
        });

    }

    checkLogoHover() {
        const pointer = this.input.activePointer;
    
        if (!pointer || !this.logo) {
            return;
        }
    
        const logoBounds = this.logo.getBounds();
    
        if (pointer.x > logoBounds.x && pointer.x < logoBounds.x + logoBounds.width &&
            pointer.y > logoBounds.y && pointer.y < logoBounds.y + logoBounds.height) {
    
            if (!this.isLogoHovered) {
                console.log('Hovering over the closed donut box');
                EventBus.emit('donut-hovered', { name: 'Closed Donut Box', hovered: true });
                this.isLogoHovered = true; 
                this.input.manager.canvas.style.cursor = 'pointer'; 
            }
    
            if (pointer.isDown) {
                console.log('Closed donut box clicked');
                EventBus.emit('donut-hovered', { name: 'Closed Donut Box', clicked: true });
                this.handleClosedDonutBoxClick();
            }
        } else if (this.isLogoHovered) {
            EventBus.emit('donut-hovered', { hovered: false });
            this.isLogoHovered = false;
            this.input.manager.canvas.style.cursor = 'default';
        }
    }
    
    handleClosedDonutBoxClick() {
        console.log('Handling closed donut box click logic');
        EventBus.emit('home-menu-clicked', true);
    }
    

    checkDonutHover() {
        let isHovering = false;
        const pointer = this.input.activePointer;
    
        if (!pointer) {
            return;
        }
    
        for (let i = 0; i < this.donuts.length; i++) {
            const donut = this.donuts[i];
            const donutBounds = donut.getBounds();
    
            if (!donutBounds) {
                continue;
            }
        
            if (pointer.x > donutBounds.x && pointer.x < donutBounds.x + donutBounds.width &&
                pointer.y > donutBounds.y && pointer.y < donutBounds.y + donutBounds.height) {
                
                if (this.hoveredDonut !== donut) {
                    console.log('Hovering over: ', donut.name);
                    EventBus.emit('donut-hovered', { name: donut.name, hovered: true });
                    this.hoveredDonut = donut;
                }
                isHovering = true;
                break;
            }
        }
    
        if (!isHovering && this.hoveredDonut !== null) {
            EventBus.emit('donut-hovered', { hovered: false });
            this.hoveredDonut = null;
        }
    }
    
    
    calculateScaleFactor() {
        return Math.min(window.innerWidth / 1520, window.innerHeight / 680);
    }

    resizeHandler() {
        this.scaleFactor = this.calculateScaleFactor();
        
        if (this.logo) {
            this.logo.setScale(0.3 * this.scaleFactor);
        }
    
        if (this.donuts && this.donuts.length > 0) {
            const isSmallScreen = window.innerWidth <= 768;
    
            for (let i = 0; i < this.donuts.length; i++) {
                const position = this.calculateDonutPosition(i, this.scaleFactor, isSmallScreen);
    
                this.donuts[i].setScale(0.23 * this.scaleFactor);
                this.donuts[i].setPosition(position.x, position.y);
            }
    
            if (this.donuts[0].alpha > 0) {
                this.showDonuts(this.donuts, this.linkTexts, isSmallScreen);
            }
        }
    }
    
    
    
    calculateDonutPosition(i, scaleFactor, isSmallScreen, donutGap) {
        const xPosition = isSmallScreen ? 100 : 250 + (i * 125 + donutGap);
        const yPosition = isSmallScreen ? 150 + (i * 100 * scaleFactor) : 100 * scaleFactor;
        return { x: xPosition, y: yPosition };
    }

    
    showDonuts(donuts, linkTexts, isSmallScreen, donutGap) {
        for (let i = 0; i < donuts.length; i++) {
            const position = this.calculateDonutPosition(i, 1, isSmallScreen, donutGap);
    
            this.tweens.add({
                targets: donuts[i],
                x: position.x,
                y: position.y,
                alpha: 1,
                duration: 500,
                ease: 'Power2'
            });
    
            this.tweens.add({
                targets: linkTexts[i],
                x: position.x,
                y: position.y + 50,
                alpha: 1,
                duration: 500,
                ease: 'Power2'
            });
        }
    }
    
    hideDonuts(donuts, linkTexts, isSmallScreen) {
        for (let i = 0; i < donuts.length; i++) {
            let xPosition = isSmallScreen ? 100 : 250 + (i * 125);
    
            this.tweens.add({
                targets: donuts[i],
                x: xPosition,
                alpha: 0,
                duration: 500,
                ease: 'Power2'
            });
    
            this.tweens.add({
                targets: linkTexts[i],
                x: xPosition,
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

        showImage(512, 384, 'closed', 0.75, 100, () => {
            showImage(512, 384, 'mostlyclosed', 0.75, 100, () => {
                showImage(512, 384, 'halfway', 0.75, 100, () => {
                    showImage(512, 384, 'mostlyopen', 0.75, 100, callback);
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
        const isSmallScreen = window.innerWidth <= 768;
    
        if (scene) {
            let x
            if (isSmallScreen){
            x = (scene.scale.width / 2) -200;
            }
            else{
            x = (scene.scale.width / 2) + 80;

            }
            const y = scene.scale.height / 2;
    
            const star = scene.add.sprite(x, y, spriteName);
            star.setDepth(1000);
    
            if (isSmallScreen) {
                star.setScale(1 / 3);
            }
    
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

    

    createInteractiveZoneRelativeToLogo(offsetX, offsetY, radius, name, imageName) {
        const zone = this.add.zone(
            this.logo.x + offsetX * this.logo.scaleX,
            this.logo.y + offsetY * this.logo.scaleY,
            radius * 2,
            radius * 2
        ).setCircleDropZone(radius).setName(name).setInteractive();
    
        zone.on('pointerover', () => {
            this.input.manager.canvas.style.cursor = 'pointer';
        });
    
        zone.on('pointerout', () => {
            this.input.manager.canvas.style.cursor = 'default';
        });
    
        zone.on('pointerdown', () => {
            let spriteName;
    
            if (name === 'Home' || name === 'Resume') {
                spriteName = 'pink-donut';
            } else if (name === 'Projects' || name === 'Blog') {
                spriteName = 'blue-donut';
            } else if (name === 'About' || name === 'Contact') {
                spriteName = 'choco-donut';
            }
    
            if (this.zones) {
                this.zones.forEach(zone => zone.destroy());
            }
    
            if (this.linkTexts) {
                this.linkTexts.forEach(text => text.destroy());
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
                        let url = '';
                        if (name === 'Blog') {
                            url = 'https://calm-reef-66202-3443b850ed8c.herokuapp.com/';
                        } else if (name === 'Resume') {
                            url = `./assets/resume.pdf`;
                        } else {
                            url = `${window.location.origin}/donut_portfolio/${name.toLowerCase()}`;
                        }
                        window.location.href = url;
                        EventBus.emit('donut-clicked', true);
                    }
                });
            });
        });
    
        this.zones = this.zones || [];
        this.zones.push(zone);
    }
    
    
    
    createLinkRelativeToLogo(offsetX, offsetY, label, imageName, scaleFactor, rotation) {
        const minFontSize = 14;
        const baseFontSize = 25 * scaleFactor;
        const calculatedFontSize = Math.max(minFontSize, baseFontSize); 
        const linkText = this.add.text(
            this.logo.x + offsetX * this.logo.scaleX,
            this.logo.y + offsetY * this.logo.scaleY,
            label, {
                fontSize: `${calculatedFontSize}px`,
                fontFamily: 'Cedarville Cursive',
                className: 'cedarville-cursive-regular',
            }
        ).setOrigin(0.5).setDepth(101).setInteractive();
    
        linkText.setRotation(rotation);
    
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
            if (label === 'Home' || label === 'Resume') {
                spriteName = 'pink-donut';
            } else if (label === 'Projects' || label === 'Blog') {
                spriteName = 'blue-donut';
            } else if (label === 'About' || label === 'Contact') {
                spriteName = 'choco-donut';
            }
    
            this.linkTexts.forEach(text => text.destroy());
    
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
                        } else if (label === 'Resume') {
                            url = `./assets/resume.pdf`;
                        } else {
                            url = `${window.location.origin}/donut_portfolio/${label.toLowerCase()}`;
                        }
                        window.location.href = url;
                        EventBus.emit('donut-clicked', true);
                    }
                });
            });
        });
    
        this.linkTexts = this.linkTexts || [];
        this.linkTexts.push(linkText);
    
        this.links = this.links || {};
        this.links[label] = linkText;
    }
}    
