import Phaser from 'phaser';
import { EventBus } from '../EventBus';
import { navigateToDestination } from '../routing';
import {
    MENU_ITEMS,
    MENU_TEXT_COLOR,
    LINK_HOVER_COLOR,
    MENU_AUTO_HIDE_DELAY,
    isSmallScreen,
} from '../menuConfig';

// Compact view (content routes): a small box logo with a sliding donut row.
export function buildCompactView(scene) {
    scene.logo = scene.add.image(110, 30, 'closed')
        .setDepth(100)
        .setScale(0.3)
        .setInteractive({ useHandCursor: true });

    const box = scene.textures.get('closed').getSourceImage();
    scene.logo.input.hitArea.setTo(
        -box.width * 0.25,
        -box.height * 0.25,
        box.width * 1.5,
        box.height * 1.5,
    );

    createDonutRow(scene);
    setupLogoInteractions(scene);

    showDonuts(scene);
    scene._menuStaysOut = true;
}

function donutPosition(index) {
    if (isSmallScreen()) {
        return { x: 100, y: 150 + index * 155 };
    }
    return { x: 200 + index * 150, y: 100 };
}

const textGap = () => (window.innerWidth > 1100 ? 95 : 50);

function donutScale(scene, spriteKey) {
    const image = scene.textures.get(spriteKey).getSourceImage();
    const maxSize = 100;
    return Math.min(0.3, maxSize / image.width, maxSize / image.height);
}

function createDonutRow(scene) {
    scene.donuts = [];
    scene.linkTexts = [];
    scene._hideDonutsTimer = null;
    scene._menuStaysOut = false;

    MENU_ITEMS.forEach((item, index) => {
        const pos = donutPosition(index);

        const donut = scene.add.image(pos.x, pos.y, item.sprite)
            .setDepth(101)
            .setScale(donutScale(scene, item.sprite))
            .setAlpha(0)
            .setName(item.label);

        // Generous hit area keeps the small donut easy to tap.
        const src = scene.textures.get(item.sprite).getSourceImage();
        const hitRadius = Math.max(src.width, src.height) * 0.6;
        donut.setInteractive({
            hitArea: new Phaser.Geom.Circle(src.width / 2, src.height / 2, hitRadius),
            hitAreaCallback: Phaser.Geom.Circle.Contains,
            useHandCursor: true,
        });

        const linkText = scene.add.text(pos.x, pos.y + textGap(), item.label, {
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
            scene.setCursorStyle('pointer');
            linkText.setStyle({ fill: LINK_HOVER_COLOR });
        });
        linkText.on('pointerout', () => {
            scene.setCursorStyle('default');
            linkText.setStyle({ fill: MENU_TEXT_COLOR });
        });
        linkText.on('pointerup', () => navigateToDestination(item.label));

        setupDonutInteractions(scene, donut, item.label);

        scene.donuts.push(donut);
        scene.linkTexts.push(linkText);
    });
}

function setupDonutInteractions(scene, donut, label) {
    donut.on('pointerover', () => {
        clearTimeout(scene._hideDonutsTimer);
        scene.setCursorStyle('pointer');
        EventBus.emit('donut-hovered', true);
    });

    donut.on('pointerout', () => {
        scene.setCursorStyle('default');
        EventBus.emit('donut-hovered', false);
        scheduleAutoHide(scene);
    });

    // pointerup is the reliable trigger on both mouse and touch.
    donut.on('pointerup', () => {
        if (label === 'Home') {
            localStorage.removeItem('donutClicked');
            EventBus.emit('home-menu-clicked', false);
        }
        scene.animateDonutRotation(donut, () => navigateToDestination(label));
    });
}

function setupLogoInteractions(scene) {
    // Cursor feedback only; never swaps the box texture, so hover can't close it.
    scene.logo.on('pointerover', () => {
        scene.setCursorStyle('pointer');
        EventBus.emit('donut-hovered', true);
    });

    scene.logo.on('pointerdown', () => {
        if (scene._menuStaysOut) {
            hideDonuts(scene);
            scene._menuStaysOut = false;
        } else {
            clearTimeout(scene._hideDonutsTimer);
            showDonuts(scene);
            scene._menuStaysOut = true;
        }
    });

    scene.logo.on('pointerout', () => {
        scene.setCursorStyle('default');
        EventBus.emit('donut-hovered', false);
        scheduleAutoHide(scene);
    });
}

function scheduleAutoHide(scene) {
    if (scene._menuStaysOut) {
        return;
    }
    scene._hideDonutsTimer = setTimeout(() => hideDonuts(scene), MENU_AUTO_HIDE_DELAY);
}

function showDonuts(scene) {
    scene.donuts.forEach((donut, index) => {
        const pos = donutPosition(index);
        scene.animateUIElement(donut, { x: pos.x, y: pos.y, alpha: 1 });
        scene.animateUIElement(scene.linkTexts[index], { x: pos.x, y: pos.y + 85, alpha: 1 });
    });
}

function hideDonuts(scene) {
    scene.donuts.forEach((donut, index) => {
        const x = isSmallScreen() ? 100 : 250 + index * 125;
        scene.animateUIElement(donut, { x, alpha: 0 });
        scene.animateUIElement(scene.linkTexts[index], { x, alpha: 0 });
    });
}
