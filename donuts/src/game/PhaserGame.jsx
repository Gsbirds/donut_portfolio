import PropTypes from 'prop-types';
import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import StartGame from './main';
import { EventBus } from './EventBus';

export const PhaserGame = forwardRef(function PhaserGame({ currentActiveScene, setDonutClicked }, ref) {
    const game = useRef();

    useLayoutEffect(() => {
        if (game.current === undefined) {
            game.current = StartGame("game-container", setDonutClicked);
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
    }, [ref, setDonutClicked]);

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

        return () => {
            EventBus.removeListener('current-scene-ready');
            EventBus.removeListener('donut-clicked');
        };
    }, [currentActiveScene, ref, setDonutClicked]);

    return <div id="game-container"></div>;
});

// Props definitions
PhaserGame.propTypes = {
    currentActiveScene: PropTypes.func,
    setDonutClicked: PropTypes.func.isRequired
};
