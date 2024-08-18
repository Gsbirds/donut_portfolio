import { useRef, useState, useEffect } from 'react';
import { PhaserGame } from './game/PhaserGame';
import { EventBus } from './game/EventBus';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Projects from './projects';
import Info from './info';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Contact from './contact';

function App() {
    const phaserRef = useRef();
    const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0 });
    const [sceneReady, setSceneReady] = useState(false);
    const [donutClicked, setDonutClicked] = useState(false);

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
        EventBus.on('donut-clicked', (clicked) => {
            setDonutClicked(clicked);
            localStorage.setItem('donutClicked', JSON.stringify(clicked));
        });

        return () => {
            EventBus.off('current-scene-ready', handleCurrentSceneReady);
            EventBus.off('logo-position', handleLogoPosition);
            EventBus.removeListener('donut-clicked');
        };
    }, []);

    const changeScene = () => {
        const scene = phaserRef.current.scene;
        if (scene) {
            scene.changeScene();
        }
    }

    return (
        <div>
            <div id="app">
                <div className="phaser-container">
                    <PhaserGame ref={phaserRef} donutClicked={donutClicked} setDonutClicked={setDonutClicked} />
                    {sceneReady && <div></div>}
                </div>
            </div>
            <Router>
                <Routes>
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/about" element={<Info />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </Router>

            {(location.pathname === '/contact' || location.pathname === '/projects' ||location.pathname === '/about') &&(
                <footer>
                    <p><i className="fa-solid fa-copyright"></i><b> 2024 Gabrielle Burgard. All Rights Reserved.</b></p>
                </footer>
            )}
        </div>
    );
}

export default App;
