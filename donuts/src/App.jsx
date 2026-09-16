import { useRef, useEffect } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { PhaserGame } from './game/PhaserGame';
import { EventBus } from './game/EventBus';
import Projects from './projects';
import Info from './info';
import Contact from './contact';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

/** Normalise the mixed boolean/object payloads emitted for donut-hovered. */
const isHovered = (payload) =>
    typeof payload === 'object' && payload !== null ? Boolean(payload.hovered) : Boolean(payload);

function App() {
    const phaserRef = useRef();

    // Single source of truth for state shared between React and Phaser.
    useEffect(() => {
        const handleDonutClicked = (clicked) => {
            localStorage.setItem('donutClicked', JSON.stringify(clicked));
        };

        const handleHomeMenuClicked = (clicked) => {
            localStorage.setItem('homeMenuClicked', JSON.stringify(clicked));
        };

        const handleDonutHovered = (payload) => {
            localStorage.setItem('donutHovered', JSON.stringify(isHovered(payload)));
        };

        EventBus.on('donut-clicked', handleDonutClicked);
        EventBus.on('home-menu-clicked', handleHomeMenuClicked);
        EventBus.on('donut-hovered', handleDonutHovered);

        return () => {
            EventBus.off('donut-clicked', handleDonutClicked);
            EventBus.off('home-menu-clicked', handleHomeMenuClicked);
            EventBus.off('donut-hovered', handleDonutHovered);
        };
    }, []);

    return (
        <div>
            <div id="app">
                <div className="phaser-container">
                    <PhaserGame ref={phaserRef} />
                </div>
                <ul className="icon-container">
                    <li>
                        <a href="https://www.linkedin.com/in/gabby-burgard-14924abb/">
                            <i className="fa-brands fa-linkedin"></i>
                        </a>
                    </li>
                    <li>
                        <a href="https://github.com/Gsbirds">
                            <i className="fa-brands fa-github"></i>
                        </a>
                    </li>
                </ul>
            </div>

            <div id="pages">
                <Router>
                    <Routes>
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/about" element={<Info />} />
                        <Route path="/contact" element={<Contact />} />
                    </Routes>
                </Router>
            </div>
        </div>
    );
}

export default App;
