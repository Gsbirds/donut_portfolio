import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import StartGame from './main';
import { EventBus } from './EventBus';

/**
 * Bridge component between React and the Phaser game.
 *
 * It boots the game exactly once into the #game-container element and forwards
 * the active scene to `currentActiveScene`. All application state (donut
 * clicked, menu open, hover) is owned by the parent and driven through the
 * EventBus, so this component intentionally holds no state of its own.
 */
export const PhaserGame = forwardRef(function PhaserGame({ currentActiveScene }, ref) {
    const game = useRef();

    useLayoutEffect(() => {
        if (game.current === undefined) {
            game.current = StartGame('game-container');

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
    }, [ref]);

    useEffect(() => {
        const handleSceneReady = (scene) => {
            if (currentActiveScene instanceof Function) {
                currentActiveScene(scene);
            }
            if (ref?.current) {
                ref.current.scene = scene;
            }
        };

        EventBus.on('current-scene-ready', handleSceneReady);

        return () => {
            EventBus.off('current-scene-ready', handleSceneReady);
        };
    }, [currentActiveScene, ref]);

    return <div id="game-container"></div>;
});

PhaserGame.propTypes = {
    currentActiveScene: PropTypes.func,
};
