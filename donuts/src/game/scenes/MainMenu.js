import Phaser from 'phaser';
import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

/** In-app content routes. Everything else is treated as the home view. */
const CONTENT_ROUTES = ['projects', 'about', 'contact'];

/** Breakpoint (px) below which the layout switches to its small-screen form. */
const SMALL_SCREEN_MAX_WIDTH = 768;

/** Milliseconds the sliding menu stays open after the pointer leaves. */
const MENU_AUTO_HIDE_DELAY = 1500;

/** Colours for the cursive menu link labels. */
const LINK_COLOR = '#a94064';
const LINK_HOVER_COLOR = '#fc5c85';

/**
 * The six menu entries, in display order. `sprite` is the donut texture used
 * for the fly-away animation when the entry is selected; `donut` is the texture
 * used inside the open-box layout.
 */
const MENU_ITEMS = [
    { label: 'Home', donut: 'first-donut', sprite: 'pink-donut' },
    { label: 'Projects', donut: 'second-donut', sprite: 'blue-donut' },
    { label: 'About', donut: 'third-donut', sprite: 'choco-donut' },
    { label: 'Contact', donut: 'fourth-donut', sprite: 'choco-donut' },
    { label: 'Resume', donut: 'fifth-donut', sprite: 'pink-donut' },
    { label: 'Blog', donut: 'sixth-donut', sprite: 'blue-donut' },
];

/** Frames of the box-opening animation (played forwards on entry). */
const OPEN_SEQUENCE = ['closed', 'mostlyclosed', 'halfway', 'mostlyopen'];

/** Frames of the box-closing animation (played when an entry is selected). */
const CLOSE_SEQUENCE = [
    { key: 'mostlyopen', scale: 0.75 },
    { key: 'halfway', scale: 0.6 },
    { key: 'mostlyclosed', scale: 0.5 },
    { key: 'closed', scale: 0.3 },
];

/** Per-frame delay (ms) for the box open/close animations. */
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

        // The landing (home) view shows the animated open box; every other
        // in-app route shows the compact box menu, matching the deployed site.
        this._view = this.isHomeUrl() ? 'open' : 'closed';

        if (this._view === 'closed') {
            this.showInitialClosedBox();
            EventBus.emit('donut-hovered', false);
        } else {
            // First paint plays the opening animation; rebuilds skip it.
            this.showInitialOpenBox(true);
        }

        this.registerResizeHandler();
        this.registerRouteHandler();
        this.registerScrollHandler();

        EventBus.emit('current-scene-ready', this);
    }

    /**
     * The canvas is position:fixed, so scrolling the page moves the document
     * under it. Phaser's ScaleManager caches the canvas offset and only
     * recomputes it on resize, so after scrolling all input is offset and the
     * menu becomes unclickable. Recompute the scale bounds on scroll (debounced
     * to avoid perpetual refresh churn) so pointer coordinates stay correct.
     */
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

    /**
     * Navigation between in-app routes only changes the URL hash (no page
     * reload), so the scene listens for hashchange and re-renders the view that
     * matches the new route: the open box on home, the compact menu elsewhere.
     */
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

    /**
     * Rebuild the menu layout when the viewport crosses the mobile/desktop
     * breakpoint. FIT scaling already resizes the artwork continuously; this
     * only re-runs when the *arrangement* needs to change, and is debounced so
     * dragging the window doesn't thrash.
     */
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

    /**
     * Reset the scene to a clean slate and render the active view. Using
     * Phaser's own teardown primitives guarantees no orphaned sprites, tweens
     * or timers survive from a previous view (e.g. the fly-away transition).
     */
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
            // Skip the opening animation on a rebuild.
            this.buildOpenBox();
        }
    }

    // ---------------------------------------------------------------------
    // Routing / page helpers
    // ---------------------------------------------------------------------

    handleHomePage() {
        if (this.isHomeUrl()) {
            localStorage.removeItem('donutClicked');
            EventBus.emit('home-menu-clicked', false);
        }
    }

    /**
     * The landing (home) view is anything that is not one of the content
     * routes. Defining it by exclusion keeps home as the default: any hash that
     * isn't projects/about/contact shows the big open menu, never the compact
     * one. Content routes show the compact menu.
     */
    isHomeUrl() {
        const hash = window.location.hash;
        return !CONTENT_ROUTES.some((route) => hash.includes(route));
    }

    // ---------------------------------------------------------------------
    // Layout helpers
    // ---------------------------------------------------------------------

    get isSmallScreen() {
        return window.innerWidth <= SMALL_SCREEN_MAX_WIDTH;
    }

    setCursorStyle(style) {
        this.input.manager.canvas.style.cursor = style;
    }

    // ---------------------------------------------------------------------
    // Closed-box view (returning visitor): compact logo + sliding donut menu
    // ---------------------------------------------------------------------

    showInitialClosedBox() {
        this.logo = this.add.image(110, 30, 'closed')
            .setDepth(100)
            .setScale(0.3)
            .setInteractive({ useHandCursor: true });

        // Generous hit area around the box so it's easy to click/tap to toggle
        // the menu, including while the page is scrolled.
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

        // Show the donut row by default so every non-home page has a visible,
        // ready-to-use menu. The logo still toggles it open/closed.
        this.showDonuts();
        this._menuStaysOut = true;
    }

    setupLogoHoverEffects() {
        // Cursor feedback only. The box texture is never changed on hover, so
        // the box can never animate closed just from the pointer passing over
        // it — it stays as-is until an actual link is selected.
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

            // A generous circular hit area (in the texture's local space, so it
            // scales with the donut) keeps the tap target comfortably large on
            // touch screens even though the donut is drawn small.
            const source = this.textures.get(item.sprite).getSourceImage();
            const hitRadius = Math.max(source.width, source.height) * 0.6;
            donut.setInteractive({
                hitArea: new Phaser.Geom.Circle(source.width / 2, source.height / 2, hitRadius),
                hitAreaCallback: Phaser.Geom.Circle.Contains,
                useHandCursor: true,
            });

            const baseTextColor = '#3e4346';
            const linkText = this.add.text(position.x, position.y + this.textGap, item.label, {
                fontSize: 40,
                fontStyle: 'bold',
                fontFamily: 'Cedarville Cursive',
                fill: baseTextColor,
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
                linkText.setStyle({ fill: baseTextColor });
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

    get donutGap() {
        return window.innerWidth > 1100 ? 5 : 20;
    }

    calculateDonutPosition(index) {
        // Space the six donuts evenly across the world width so the last one
        // (Blog) stays fully on screen. Start with a left margin and use a gap
        // that keeps index 5 within the 1024px world.
        const startX = 200;
        const gap = 150;

        if (this.isSmallScreen) {
            return { x: 100, y: 150 + index * 155 };
        }
        return { x: startX + index * gap, y: 100 };
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

        // pointerup fires on tap release for both mouse and touch, so it is the
        // reliable trigger on mobile (pointerover/out don't apply to touch).
        const select = () => {
            if (linkName === 'Home') {
                localStorage.removeItem('donutClicked');
                EventBus.emit('home-menu-clicked', false);
            }
            this.animateDonutRotation(donut, () => this.navigateToDestination(linkName));
        };

        donut.on('pointerup', select);
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

    // ---------------------------------------------------------------------
    // Open-box view (first visit): animated box + interactive donut menu
    // ---------------------------------------------------------------------

    showInitialOpenBox(playAnimation = false) {
        if (playAnimation) {
            this.playOpenSequence(() => this.buildOpenBox());
        } else {
            this.buildOpenBox();
        }
    }

    /** Build the open-box logo, interactive zones and cursive link labels. */
    buildOpenBox() {
        const small = this.isSmallScreen;
        const logoX = small ? 254 : 442;
        const logoY = small ? 712 : 744;

        const baseLogoSize = 480;
        const logoWidth = this.textures.get('logo').getSourceImage().width;
        const scale = Math.max(baseLogoSize / logoWidth, 0.75);

        this.logo = this.add.image(logoX, logoY, 'logo').setDepth(100).setScale(scale);

        // The visible cursive labels are the only clickable elements. We no
        // longer add invisible hit zones over the box, so hovering or clicking
        // near the lid can never trigger the close animation — the box stays
        // open until a link is actually selected.
        this.createLinkRelativeToLogo(-190, 130, 'Home', 'first-donut', scale, Phaser.Math.DegToRad(-19));
        this.createLinkRelativeToLogo(-20, 70, 'Projects', 'second-donut', scale, Phaser.Math.DegToRad(-19));
        this.createLinkRelativeToLogo(130, 20, 'About', 'third-donut', scale, Phaser.Math.DegToRad(-19));
        this.createLinkRelativeToLogo(100, 370, 'Contact', 'fourth-donut', scale, Phaser.Math.DegToRad(-25));
        this.createLinkRelativeToLogo(250, 290, 'Resume', 'fifth-donut', scale, Phaser.Math.DegToRad(-25));
        this.createLinkRelativeToLogo(400, 220, 'Blog', 'sixth-donut', scale, Phaser.Math.DegToRad(-25));

        EventBus.emit('logo-position', { x: this.logo.x, y: this.logo.y });
    }

    /** Play the forward box-opening frames centred in the world, then callback. */
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

    /** Play the reverse box-closing frames on the current logo, then callback. */
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

        // Tight hit area matching the exact text bounds, so only the visible
        // letters are clickable. The lid (and empty space around the words) is
        // never interactive, so hovering/pressing the box can't close it.
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

        // Only fire on a genuine click: the press AND release must both land on
        // this same link. This stops the box from closing when the mouse is
        // just brought down / dragged over the lid.
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

    /** Shared handler for selecting an entry from the open-box view. */
    selectOpenBoxItem(name, imageName) {
        // Selecting Home while already on the home view: just reload the page,
        // skip the close/fly-away animation.
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

    /** Spawn a spinning, bobbing donut that self-destructs after a few seconds. */
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

    // ---------------------------------------------------------------------
    // Shared helpers
    // ---------------------------------------------------------------------

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
        // External destinations navigate away entirely.
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

        // Internal destinations use hash routes so they resolve the same way on
        // localhost and on the deployed GitHub Pages base path.
        if (name === 'Home') {
            localStorage.removeItem('donutClicked');
            window.location.hash = '#/';
        } else {
            EventBus.emit('donut-clicked', true);
            window.location.hash = `#/${name.toLowerCase()}`;
        }
    }
}
