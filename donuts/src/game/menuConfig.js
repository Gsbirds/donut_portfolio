import Phaser from 'phaser';

export const CONTENT_ROUTES = ['projects', 'about', 'contact'];
export const SMALL_SCREEN_MAX_WIDTH = 768;
export const MENU_AUTO_HIDE_DELAY = 1500;

export const LINK_COLOR = '#a94064';
export const LINK_HOVER_COLOR = '#fc5c85';
export const MENU_TEXT_COLOR = '#3e4346';

// Single source of truth for the six menu entries.
// - donut:   texture shown inside the open-box layout / compact row
// - sprite:  texture used for the fly-away animation on select
// - open:    open-box placement relative to the logo { dx, dy, deg }
const R1 = -19;
const R2 = -25;
export const MENU_ITEMS = [
    { label: 'Home', donut: 'first-donut', sprite: 'pink-donut', open: { dx: -190, dy: 130, deg: R1 } },
    { label: 'Projects', donut: 'second-donut', sprite: 'blue-donut', open: { dx: -20, dy: 70, deg: R1 } },
    { label: 'About', donut: 'third-donut', sprite: 'choco-donut', open: { dx: 130, dy: 20, deg: R1 } },
    { label: 'Contact', donut: 'fourth-donut', sprite: 'choco-donut', open: { dx: 100, dy: 370, deg: R2 } },
    { label: 'Resume', donut: 'fifth-donut', sprite: 'pink-donut', open: { dx: 250, dy: 290, deg: R2 } },
    { label: 'Blog', donut: 'sixth-donut', sprite: 'blue-donut', open: { dx: 400, dy: 220, deg: R2 } },
];

// Box open/close animation frames and timing.
export const OPEN_SEQUENCE = ['closed', 'mostlyclosed', 'halfway', 'mostlyopen'];
export const CLOSE_SEQUENCE = [
    { key: 'mostlyopen', scale: 0.75 },
    { key: 'halfway', scale: 0.6 },
    { key: 'mostlyclosed', scale: 0.5 },
    { key: 'closed', scale: 0.3 },
];
export const FRAME_DELAY = 55;

export const isSmallScreen = () => window.innerWidth <= SMALL_SCREEN_MAX_WIDTH;

export const degToRad = (deg) => Phaser.Math.DegToRad(deg);
