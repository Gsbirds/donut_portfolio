import Phaser from 'phaser';
import { isHomeUrl, navigateToDestination } from '../routing';
import {
    MENU_ITEMS,
    LINK_COLOR,
    LINK_HOVER_COLOR,
    OPEN_SEQUENCE,
    CLOSE_SEQUENCE,
    FRAME_DELAY,
    isSmallScreen,
    degToRad,
} from '../menuConfig';

// Open-box view (home): the animated box with cursive link labels.
export function showOpenBox(scene, playAnimation = false) {
    if (playAnimation) {
        playOpenSequence(scene, () => buildOpenBox(scene));
    } else {
        buildOpenBox(scene);
    }
}

export function buildOpenBox(scene) {
    const logoX = isSmallScreen() ? 254 : 442;
    const logoY = isSmallScreen() ? 712 : 744;

    const baseLogoSize = 480;
    const logoWidth = scene.textures.get('logo').getSourceImage().width;
    const scale = Math.max(baseLogoSize / logoWidth, 0.75);

    scene.logo = scene.add.image(logoX, logoY, 'logo').setDepth(100).setScale(scale);

    MENU_ITEMS.forEach((item) => createLink(scene, item, scale));
}

function createLink(scene, item, scale) {
    const { dx, dy, deg } = item.open;
    const fontSize = Math.max(20, 36 * scale);

    const linkText = scene.add.text(
        scene.logo.x + dx * scene.logo.scaleX,
        scene.logo.y + dy * scene.logo.scaleY,
        item.label,
        { fontSize: `${fontSize}px`, fontFamily: 'Cedarville Cursive', fill: LINK_COLOR },
    ).setOrigin(0.5).setDepth(101).setRotation(degToRad(deg));

    // Tight hit area on the glyphs only, so the box lid isn't clickable.
    linkText.setInteractive(
        new Phaser.Geom.Rectangle(0, 0, linkText.width, linkText.height),
        Phaser.Geom.Rectangle.Contains,
    );
    linkText.input.cursor = 'pointer';

    linkText.on('pointerover', () => {
        scene.setCursorStyle('pointer');
        linkText.setStyle({ fill: LINK_HOVER_COLOR });
    });
    linkText.on('pointerout', () => {
        scene.setCursorStyle('default');
        linkText.setStyle({ fill: LINK_COLOR });
        scene._pressedLink = null;
    });

    // Require press and release on the same link so a drag over the box
    // can't trigger a selection.
    linkText.on('pointerdown', () => {
        scene._pressedLink = item.label;
    });
    linkText.on('pointerup', () => {
        if (scene._pressedLink === item.label) {
            scene._pressedLink = null;
            selectOpenBoxItem(scene, item);
        }
    });

    scene.linkTexts.push(linkText);
}

function selectOpenBoxItem(scene, item) {
    if (item.label === 'Home' && isHomeUrl()) {
        window.location.reload();
        return;
    }

    scene.cleanUpUIElements();

    scene.logo = scene.add.image(612, 495, item.donut).setScale(0.75);
    addFlyingDonut(scene, item.sprite);

    playCloseSequence(scene, () => {
        scene.tweens.add({
            targets: scene.logo,
            x: 100,
            y: 50,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => navigateToDestination(item.label),
        });
    });
}

function playOpenSequence(scene, onComplete, index = 0) {
    if (index >= OPEN_SEQUENCE.length) {
        onComplete();
        return;
    }

    const image = scene.add.image(scene.worldCenterX, scene.worldCenterY, OPEN_SEQUENCE[index])
        .setDepth(200)
        .setScale(0.75);

    scene.time.delayedCall(FRAME_DELAY, () => {
        image.destroy();
        playOpenSequence(scene, onComplete, index + 1);
    });
}

function playCloseSequence(scene, onComplete, index = 0) {
    if (index >= CLOSE_SEQUENCE.length) {
        onComplete();
        return;
    }

    const step = CLOSE_SEQUENCE[index];
    scene.logo.setTexture(step.key).setScale(step.scale);

    scene.time.delayedCall(FRAME_DELAY, () => {
        playCloseSequence(scene, onComplete, index + 1);
    });
}

function addFlyingDonut(scene, spriteName) {
    const x = isSmallScreen() ? scene.worldCenterX - 200 : scene.worldCenterX + 80;
    const y = scene.worldCenterY;

    const donut = scene.add.sprite(x, y, spriteName).setDepth(1000);
    if (isSmallScreen()) {
        donut.setScale(1 / 3);
    }

    scene.tweens.add({
        targets: donut,
        y: { start: y - 200, to: y + 200 },
        duration: 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
    });
    scene.tweens.add({ targets: donut, angle: 360, duration: 1000, repeat: -1 });

    scene.time.delayedCall(4000, () => donut.destroy());
}
