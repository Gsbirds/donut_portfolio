import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import StartGame from './main';
import { EventBus } from './EventBus';
export const PhaserGame = forwardRef(function PhaserGame({ currentActiveScene, setDonutClicked, sethomeMenuClicked, setDonutHovered }, ref) { // Added setDonutHovered
    const game = useRef();
    const [homeMenuClicked, setHomeMenuClicked] = useState(JSON.parse(localStorage.getItem('homeMenuClicked')));

    useLayoutEffect(() => {
        if (game.current === undefined) {
            const containerId = homeMenuClicked ? 'game-container-adjust' : 'game-container';
            game.current = StartGame(containerId, setDonutClicked, sethomeMenuClicked, setDonutHovered);

            if (ref !== null) {
                ref.current = { game: game.current, scene: null };
            }
        }

        return () => {
            if (game.current) {
                game.current.destroy(true);
                game.current = undefined;
            }
        };
    }, [ref, setDonutClicked, sethomeMenuClicked, setDonutHovered]);

    useEffect(() => {
        EventBus.on('current-scene-ready', (currentScene) => {
            if (currentActiveScene instanceof Function) {
                currentActiveScene(currentScene);
            }
            ref.current.scene = currentScene;
        });

        EventBus.on('donut-clicked', (clicked) => {
            setDonutClicked(clicked);
            localStorage.setItem('donutClicked', JSON.stringify(clicked));
        });

        EventBus.on('home-menu-clicked', (clicked) => {
            setHomeMenuClicked(clicked);
            localStorage.setItem('homeMenuClicked', JSON.stringify(clicked));
        });
        EventBus.on('donut-hovered', (hovered) => {
            setDonutHovered(hovered);
            localStorage.setItem('donutHovered', JSON.stringify(hovered));
        });

        return () => {
            EventBus.removeListener('current-scene-ready');
            EventBus.removeListener('donut-clicked');
            EventBus.removeListener('home-menu-clicked');
            EventBus.removeListener('donut-hovered');
        };
    }, [currentActiveScene, ref, setDonutClicked, sethomeMenuClicked, setDonutHovered]);

    const containerId = homeMenuClicked ? 'game-container-adjust' : 'game-container';

    return <div id={containerId}></div>;
});
