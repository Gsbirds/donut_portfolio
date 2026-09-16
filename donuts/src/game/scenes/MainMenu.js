import Phaser from 'phaser';
import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

const CONTENT_ROUTES = ['projects', 'about', 'contact'];
const SMALL_SCREEN_MAX_WIDTH = 768;
const MENU_AUTO_HIDE_DELAY = 1500;

const LINK_COLOR = '#a94064';
const LINK_HOVER_COLOR = '#fc5c85';
const MENU_TEXT_COLOR = '#3e4346';

const MENU_ITEMS = [
    { label: 'Home', donut: 'first-donut', sprite: 'pink-donut' },
    { label: 'Projects', donut: 'second-donut', sprite: 'blue-donut' },
    { label: 'About', donut: 'third-donut', sprite: 'choco-donut' },
    { label: 'Contact', donut: 'fourth-donut', sprite: 'choco-donut' },
    { label: 'Resume', donut: 'fifth-donut', sprite: 'pink-donut' },
    { label: 'Blog', donut: 'sixth-donut', sprite: 'blue-donut' },
];

const OPEN_SEQUENCE = ['closed', 'mostlyclosed', 'halfway', 'mostlyopen'];
const CLOSE_SEQUENCE = [
    { key: 'mostlyopen', scale: 0.75 },
    { key: 'halfway', scale: 0.6 },
    { key: 'mostlyclosed', scale: 0.5 },
    { key: 'closed', scale: 0.3 },
];
const FRAME_DELAY = 55;

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');

        this.logo = null;
        this.donuts = [];
        this.linkTexts = [];
        this.zones = [];
        this.links = {};

        this._hideDonutsTimer = null;
        this._menuStaysOut = false;
    }

    create() {
        this.handleHomePage();

        this._view = this.isHomeUrl() ? 'open' : 'closed';

        if (this._view === 'closed') {
            this.showInitialClosedBox();
            EventBus.emit('donut-hovered', false);
        } else {
            this.showInitialOpenBox(true);
        }

        this.registerResizeHandler();
        this.registerRouteHandler();
        this.registerScrollHandler();

        EventBus.emit('current-scene-ready', this);
    }

    // The canvas is position:fixed; Phaser only recomputes its offset on
    // resize, so scrolling leaves input misaligned until we refresh bounds.
    registerScrollHandler() {
        this._onScroll = () => {
            clearTimeout(this._scrollDebounce);
            this._scrollDebounce = setTimeout(() => this.scale.updateBounds(), 50);
        };
        window.addEventListener('scroll', this._onScroll, { passive: true });
        this.events.once('shutdown', () => {
            window.removeEventListener('scroll', this._onScroll);
            clearTimeout(this._scrollDebounce);
        });
    }

    // In-app navigation only changes the hash, so re-render on hashchange.
    registerRouteHandler() {
        this._onHashChange = () => {
            const nextView = this.isHomeUrl() ? 'open' : 'closed';
            if (nextView === this._view) {
                return;
            }
            this._view = nextView;
            this.renderCurrentView();
        };

        window.addEventListener('hashchange', this._onHashChange);
        this.events.once('shutdown', () => {
            window.removeEventListener('hashchange', this._onHashChange);
        });
    }

    // Rebuild only when crossing the mobile/desktop breakpoint (FIT already
    // rescales the artwork itself).
    registerResizeHandler() {
        this._wasSmallScreen = this.isSmallScreen;

        this._onResize = () => {
            clearTimeout(this._resizeDebounce);
            this._resizeDebounce = setTimeout(() => {
                if (this.isSmallScreen !== this._wasSmallScreen) {
                    this._wasSmallScreen = this.isSmallScreen;
                    this.renderCurrentView();
                }
            }, 150);
        };

        this.scale.on('resize', this._onResize);
        this.events.once('shutdown', () => {
            this.scale.off('resize', this._onResize);
            clearTimeout(this._resizeDebounce);
        });
    }

    renderCurrentView() {
        clearTimeout(this._hideDonutsTimer);
        this.tweens.killAll();
        this.time.removeAllEvents();
        this.children.removeAll(true);

        this.logo = null;
        this.zones = [];
        this.linkTexts = [];
        this.donuts = [];

        if (this._view === 'closed') {
            this.showInitialClosedBox();
        } else {
            this.buildOpenBox();
        }
    }

    handleHomePage() {
        if (this.isHomeUrl()) {
            localStorage.removeItem('donutClicked');
            EventBus.emit('home-menu-clicked', false);
        }
    }

    // Home is the default: anything that isn't a content route.
    isHomeUrl() {
        return !CONTENT_ROUTES.some((route) => window.location.hash.includes(route));
    }

    get isSmallScreen() {
        return window.innerWidth <= SMALL_SCREEN_MAX_WIDTH;
    }

    setCursorStyle(style) {
        this.input.manager.canvas.style.cursor = style;
    }

    // --- Compact view (content routes): small box + sliding donut row ---

    showInitialClosedBox() {
        this.logo = this.add.image(110, 30, 'closed')
            .setDepth(100)
            .setScale(0.3)
            .setInteractive({ useHandCursor: true });

        const box = this.textures.get('closed').getSourceImage();
        this.logo.input.hitArea.setTo(
            -box.width * 0.25,
            -box.height * 0.25,
            box.width * 1.5,
            box.height * 1.5,
        );

        this.createSlidingDonuts();
        this.setupLogoHoverEffects();
        this.setupLogoMenuInteractions();

        this.showDonuts();
        this._menuStaysOut = true;
    }

    // Cursor feedback only; never swaps the box texture, so hover can't close it.
    setupLogoHoverEffects() {
        this.logo.on('pointerover', () => {
            this.setCursorStyle('pointer');
            EventBus.emit('donut-hovered', true);
        });

        this.logo.on('pointerout', () => {
            this.setCursorStyle('default');
            EventBus.emit('donut-hovered', false);
        });
    }

    createSlidingDonuts() {
        this.donuts = [];
        this.linkTexts = [];
        this._hideDonutsTimer = null;
        this._menuStaysOut = false;

        MENU_ITEMS.forEach((item, index) => {
            const position = this.calculateDonutPosition(index);

            const donut = this.add.image(position.x, position.y, item.sprite)
                .setDepth(101)
                .setScale(this.donutMenuScale(item.sprite))
                .setAlpha(0)
                .setName(item.label);

            // Generous hit area keeps the small donut easy to tap.
            const source = this.textures.get(item.sprite).getSourceImage();
            const hitRadius = Math.max(source.width, source.height) * 0.6;
            donut.setInteractive({
                hitArea: new Phaser.Geom.Circle(source.width / 2, source.height / 2, hitRadius),
                hitAreaCallback: Phaser.Geom.Circle.Contains,
                useHandCursor: true,
            });

            const linkText = this.add.text(position.x, position.y + this.textGap, item.label, {
                fontSize: 40,
                fontStyle: 'bold',
                fontFamily: 'Cedarville Cursive',
                fill: MENU_TEXT_COLOR,
            })
                .setOrigin(0.5)
                .setDepth(102)
                .setAlpha(0)
                .setInteractive({ useHandCursor: true });

            linkText.on('pointerover', () => {
                this.setCursorStyle('pointer');
                linkText.setStyle({ fill: LINK_HOVER_COLOR });
            });
            linkText.on('pointerout', () => {
                this.setCursorStyle('default');
                linkText.setStyle({ fill: MENU_TEXT_COLOR });
            });
            linkText.on('pointerup', () => this.navigateToDestination(item.label));

            this.setupDonutInteractions(donut, item.label);

            this.donuts.push(donut);
            this.linkTexts.push(linkText);
        });
    }

    donutMenuScale(spriteKey) {
        const image = this.textures.get(spriteKey).getSourceImage();
        const maxSize = 100;
        return Math.min(0.3, maxSize / image.width, maxSize / image.height);
    }

    get textGap() {
        return window.innerWidth > 1100 ? 95 : 50;
    }

    calculateDonutPosition(index) {
        if (this.isSmallScreen) {
            return { x: 100, y: 150 + index * 155 };
        }
        return { x: 200 + index * 150, y: 100 };
    }

    setupDonutInteractions(donut, linkName) {
        donut.on('pointerover', () => {
            clearTimeout(this._hideDonutsTimer);
            this.setCursorStyle('pointer');
            EventBus.emit('donut-hovered', true);
        });

        donut.on('pointerout', () => {
            this.setCursorStyle('default');
            EventBus.emit('donut-hovered', false);
            this.scheduleMenuAutoHide();
        });

        // pointerup is the reliable trigger on both mouse and touch.
        donut.on('pointerup', () => {
            if (linkName === 'Home') {
                localStorage.removeItem('donutClicked');
                EventBus.emit('home-menu-clicked', false);
            }
            this.animateDonutRotation(donut, () => this.navigateToDestination(linkName));
        });

        this.links[linkName] = donut;
    }

    setupLogoMenuInteractions() {
        this.logo.on('pointerdown', () => {
            if (this._menuStaysOut) {
                this.hideDonuts();
                this._menuStaysOut = false;
            } else {
                clearTimeout(this._hideDonutsTimer);
                this.showDonuts();
                this._menuStaysOut = true;
            }
        });

        this.logo.on('pointerout', () => {
            this.setCursorStyle('default');
            this.scheduleMenuAutoHide();
        });
    }

    scheduleMenuAutoHide() {
        if (this._menuStaysOut) {
            return;
        }
        this._hideDonutsTimer = setTimeout(() => this.hideDonuts(), MENU_AUTO_HIDE_DELAY);
    }

    showDonuts() {
        this.donuts.forEach((donut, index) => {
            const position = this.calculateDonutPosition(index);
            this.animateUIElement(donut, { x: position.x, y: position.y, alpha: 1 });
            this.animateUIElement(this.linkTexts[index], {
                x: position.x,
                y: position.y + 85,
                alpha: 1,
            });
        });
    }

    hideDonuts() {
        this.donuts.forEach((donut, index) => {
            const x = this.isSmallScreen ? 100 : 250 + index * 125;
            this.animateUIElement(donut, { x, alpha: 0 });
            this.animateUIElement(this.linkTexts[index], { x, alpha: 0 });
        });
    }

    animateDonutRotation(donut, onComplete) {
        this.tweens.add({
            targets: donut,
            angle: { from: 0, to: 360 },
            ease: 'Sine.easeInOut',
            onComplete,
        });
    }

    // --- Open-box view (home): animated box + interactive links ---

    showInitialOpenBox(playAnimation = false) {
        if (playAnimation) {
            this.playOpenSequence(() => this.buildOpenBox());
        } else {
            this.buildOpenBox();
        }
    }

    buildOpenBox() {
        const small = this.isSmallScreen;
        const logoX = small ? 254 : 442;
        const logoY = small ? 712 : 744;

        const baseLogoSize = 480;
        const logoWidth = this.textures.get('logo').getSourceImage().width;
        const scale = Math.max(baseLogoSize / logoWidth, 0.75);

        this.logo = this.add.image(logoX, logoY, 'logo').setDepth(100).setScale(scale);

        this.createLinkRelativeToLogo(-190, 130, 'Home', 'first-donut', scale, Phaser.Math.DegToRad(-19));
        this.createLinkRelativeToLogo(-20, 70, 'Projects', 'second-donut', scale, Phaser.Math.DegToRad(-19));
        this.createLinkRelativeToLogo(130, 20, 'About', 'third-donut', scale, Phaser.Math.DegToRad(-19));
        this.createLinkRelativeToLogo(100, 370, 'Contact', 'fourth-donut', scale, Phaser.Math.DegToRad(-25));
        this.createLinkRelativeToLogo(250, 290, 'Resume', 'fifth-donut', scale, Phaser.Math.DegToRad(-25));
        this.createLinkRelativeToLogo(400, 220, 'Blog', 'sixth-donut', scale, Phaser.Math.DegToRad(-25));

        EventBus.emit('logo-position', { x: this.logo.x, y: this.logo.y });
    }

    playOpenSequence(onComplete, index = 0) {
        if (index >= OPEN_SEQUENCE.length) {
            onComplete();
            return;
        }

        const image = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, OPEN_SEQUENCE[index])
            .setDepth(200)
            .setScale(0.75);

        this.time.delayedCall(FRAME_DELAY, () => {
            image.destroy();
            this.playOpenSequence(onComplete, index + 1);
        });
    }

    playCloseSequence(onComplete, index = 0) {
        if (index >= CLOSE_SEQUENCE.length) {
            onComplete();
            return;
        }

        const step = CLOSE_SEQUENCE[index];
        this.logo.setTexture(step.key).setScale(step.scale);

        this.time.delayedCall(FRAME_DELAY, () => {
            this.playCloseSequence(onComplete, index + 1);
        });
    }

    createLinkRelativeToLogo(offsetX, offsetY, label, imageName, scale, rotation) {
        const fontSize = Math.max(20, 36 * scale);

        const linkText = this.add.text(
            this.logo.x + offsetX * this.logo.scaleX,
            this.logo.y + offsetY * this.logo.scaleY,
            label,
            { fontSize: `${fontSize}px`, fontFamily: 'Cedarville Cursive', fill: LINK_COLOR },
        ).setOrigin(0.5).setDepth(101).setRotation(rotation);

        // Tight hit area on the glyphs only, so the box lid isn't clickable.
        linkText.setInteractive(
            new Phaser.Geom.Rectangle(0, 0, linkText.width, linkText.height),
            Phaser.Geom.Rectangle.Contains,
        );
        linkText.input.cursor = 'pointer';

        linkText.on('pointerover', () => {
            this.setCursorStyle('pointer');
            linkText.setStyle({ fill: LINK_HOVER_COLOR });
        });
        linkText.on('pointerout', () => {
            this.setCursorStyle('default');
            linkText.setStyle({ fill: LINK_COLOR });
            this._pressedLink = null;
        });

        // Require press and release on the same link so a drag over the box
        // can't trigger a selection.
        linkText.on('pointerdown', () => {
            this._pressedLink = label;
        });
        linkText.on('pointerup', () => {
            if (this._pressedLink === label) {
                this._pressedLink = null;
                this.selectOpenBoxItem(label, imageName);
            }
        });

        this.linkTexts.push(linkText);
        this.links[label] = linkText;
    }

    selectOpenBoxItem(name, imageName) {
        if (name === 'Home' && this.isHomeUrl()) {
            window.location.reload();
            return;
        }

        const spriteName = this.getDonutSpriteByName(name);

        this.cleanUpUIElements();

        this.logo = this.add.image(612, 495, imageName).setScale(0.75);
        this.addFlyingDonut(spriteName);

        this.playCloseSequence(() => {
            this.tweens.add({
                targets: this.logo,
                x: 100,
                y: 50,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => this.navigateToDestination(name),
            });
        });
    }

    addFlyingDonut(spriteName) {
        const x = this.isSmallScreen ? GAME_WIDTH / 2 - 200 : GAME_WIDTH / 2 + 80;
        const y = GAME_HEIGHT / 2;

        const donut = this.add.sprite(x, y, spriteName).setDepth(1000);
        if (this.isSmallScreen) {
            donut.setScale(1 / 3);
        }

        this.tweens.add({
            targets: donut,
            y: { start: y - 200, to: y + 200 },
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });
        this.tweens.add({ targets: donut, angle: 360, duration: 1000, repeat: -1 });

        this.time.delayedCall(4000, () => donut.destroy());
    }

    // --- Shared helpers ---

    animateUIElement(target, properties, duration = 500, ease = 'Power2', onComplete = null) {
        const config = { targets: target, ...properties, duration, ease };
        if (onComplete) {
            config.onComplete = onComplete;
        }
        this.tweens.add(config);
    }

    getDonutSpriteByName(name) {
        if (name === 'Projects' || name === 'Blog') {
            return 'blue-donut';
        }
        if (name === 'About' || name === 'Contact') {
            return 'choco-donut';
        }
        return 'pink-donut';
    }

    cleanUpUIElements() {
        clearTimeout(this._hideDonutsTimer);
        this.zones.forEach((zone) => zone.destroy());
        this.linkTexts.forEach((text) => text.destroy());
        this.donuts.forEach((donut) => donut.destroy());
        if (this.logo) {
            this.logo.destroy();
            this.logo = null;
        }
        this.zones = [];
        this.linkTexts = [];
        this.donuts = [];
    }

    navigateToDestination(name) {
        if (name === 'Blog') {
            EventBus.emit('donut-clicked', true);
            window.location.href = 'https://calm-reef-66202-3443b850ed8c.herokuapp.com/';
            return;
        }
        if (name === 'Resume') {
            EventBus.emit('donut-clicked', true);
            window.location.href = `${import.meta.env.BASE_URL}assets/resume.pdf`;
            return;
        }

        // Hash routes resolve the same on localhost and the GitHub Pages base.
        if (name === 'Home') {
            localStorage.removeItem('donutClicked');
            window.location.hash = '#/';
        } else {
            EventBus.emit('donut-clicked', true);
            window.location.hash = `#/${name.toLowerCase()}`;
        }
    }
}
