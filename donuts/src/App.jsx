import { useRef, useState, useEffect } from 'react';
import { PhaserGame } from './game/PhaserGame';
import { EventBus } from './game/EventBus';

function App() {
    const phaserRef = useRef();
    const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0 });
    const [sceneReady, setSceneReady] = useState(false);

    useEffect(() => {
        const handleCurrentSceneReady = (scene) => {
            phaserRef.current.scene = scene;
            setSceneReady(true);
        };

        const handleLogoPosition = (position) => {
            setLogoPosition(position);
        };

        EventBus.on('current-scene-ready', handleCurrentSceneReady);
        EventBus.on('logo-position', handleLogoPosition);

        return () => {
            EventBus.off('current-scene-ready', handleCurrentSceneReady);
            EventBus.off('logo-position', handleLogoPosition);
        };
    }, []);

        const changeScene = () => {
        const scene = phaserRef.current.scene;
        if (scene) {
            scene.changeScene();
        }
    }

    const addSprite = () => {
        const scene = phaserRef.current.scene;

        if (scene) {
            const x = scene.scale.width / 2;
            const y = scene.scale.height / 2;

            const star = scene.add.sprite(x, y, 'pink-donut');
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
                scene.changeScene();
            });
        }
    };

     const getButtonStyle = (offsetX, offsetY) => {
        const canvasElement = document.getElementById('phaser-container');
        if (!canvasElement) {
            return {};
        }
        const canvasRect = canvasElement.getBoundingClientRect();
        const left = ((logoPosition.x + offsetX) / 1024) * canvasRect.width;
        const top = ((logoPosition.y + offsetY) / 768) * canvasRect.height;
        console.log(`Button position: left=${left}px, top=${top}px`); // Debug log
        return {
            position: 'absolute',
            left: `${left}px`,
            top: `${top}px`,
            width: '50px',
            height: '50px',
            opacity: 100,
            cursor: 'pointer'
        };
    };

    return (
        <div id="app">
            <PhaserGame ref={phaserRef} />
            {sceneReady && (
                <div>
                    
                </div>
            )}
        </div>
    );
}

export default App;