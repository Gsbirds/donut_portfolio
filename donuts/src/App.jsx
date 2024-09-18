import { useRef, useState, useEffect } from 'react';
import { PhaserGame } from './game/PhaserGame';
import { EventBus } from './game/EventBus';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
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
    const [homeMenuClicked, sethomeMenuClicked] = useState(false)

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
        EventBus.on('home-menu-clicked', (clicked) => {
            sethomeMenuClicked(clicked);
            localStorage.setItem('homeMenuClicked', JSON.stringify(clicked));
        });

        return () => {
            EventBus.off('current-scene-ready', handleCurrentSceneReady);
            EventBus.off('logo-position', handleLogoPosition);
            EventBus.removeListener('donut-clicked');
            EventBus.removeListener('home-menu-clicked');
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
                    <PhaserGame ref={phaserRef} donutClicked={donutClicked} setDonutClicked={setDonutClicked} homeMenuClicked={homeMenuClicked} sethomeMenuClicked={sethomeMenuClicked}/>
                    {sceneReady && <div></div>}
                </div>
            </div>
            <Router>
            <nav>
            <Link to="/projects">Projects</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            </nav>
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
