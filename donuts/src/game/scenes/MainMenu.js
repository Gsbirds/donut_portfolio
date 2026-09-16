import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { isHomeUrl } from '../routing';
import { isSmallScreen } from '../menuConfig';
import { buildCompactView } from '../views/compactView';
import { showOpenBox } from '../views/openBoxView';

// Coordinator: owns the scene lifecycle and shared helpers, and delegates the
// actual layout to the view modules (compact vs. open box) based on the route.
export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
        this.resetState();
    }

    resetState() {
        this.logo = null;
        this.donuts = [];
        this.linkTexts = [];
        this.links = {};
        this._pressedLink = null;
        this._hideDonutsTimer = null;
        this._menuStaysOut = false;
    }

    get worldCenterX() {
        return GAME_WIDTH / 2;
    }

    get worldCenterY() {
        return GAME_HEIGHT / 2;
    }

    create() {
        if (isHomeUrl()) {
            localStorage.removeItem('donutClicked');
            EventBus.emit('home-menu-clicked', false);
        }

        this._view = isHomeUrl() ? 'open' : 'closed';
        this.renderCurrentView({ animate: true });

        this.registerResizeHandler();
        this.registerRouteHandler();
        this.registerScrollHandler();

        EventBus.emit('current-scene-ready', this);
    }

    renderCurrentView({ animate = false } = {}) {
        clearTimeout(this._hideDonutsTimer);
        this.tweens.killAll();
        this.time.removeAllEvents();
        this.children.removeAll(true);
        this.resetState();

        if (this._view === 'closed') {
            buildCompactView(this);
            EventBus.emit('donut-hovered', false);
        } else {
            showOpenBox(this, animate);
        }
    }

    // In-app navigation only changes the hash, so re-render on hashchange.
    registerRouteHandler() {
        this._onHashChange = () => {
            const nextView = isHomeUrl() ? 'open' : 'closed';
            if (nextView !== this._view) {
                this._view = nextView;
                this.renderCurrentView();
            }
        };
        window.addEventListener('hashchange', this._onHashChange);
        this.events.once('shutdown', () => {
            window.removeEventListener('hashchange', this._onHashChange);
        });
    }

    // Rebuild only when crossing the mobile/desktop breakpoint (FIT rescales
    // the artwork itself).
    registerResizeHandler() {
        this._wasSmallScreen = isSmallScreen();
        this._onResize = () => {
            clearTimeout(this._resizeDebounce);
            this._resizeDebounce = setTimeout(() => {
                if (isSmallScreen() !== this._wasSmallScreen) {
                    this._wasSmallScreen = isSmallScreen();
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

    // --- Shared helpers used by the view modules ---

    setCursorStyle(style) {
        this.input.manager.canvas.style.cursor = style;
    }

    animateUIElement(target, properties, duration = 500, ease = 'Power2', onComplete = null) {
        const config = { targets: target, ...properties, duration, ease };
        if (onComplete) {
            config.onComplete = onComplete;
        }
        this.tweens.add(config);
    }

    animateDonutRotation(donut, onComplete) {
        this.tweens.add({
            targets: donut,
            angle: { from: 0, to: 360 },
            ease: 'Sine.easeInOut',
            onComplete,
        });
    }

    cleanUpUIElements() {
        clearTimeout(this._hideDonutsTimer);
        this.linkTexts.forEach((text) => text.destroy());
        this.donuts.forEach((donut) => donut.destroy());
        if (this.logo) {
            this.logo.destroy();
            this.logo = null;
        }
        this.linkTexts = [];
        this.donuts = [];
    }
}
