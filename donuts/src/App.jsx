import { useRef, useEffect, useState } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { PhaserGame } from './game/PhaserGame';
import Projects from './projects';
import Info from './info';
import Contact from './contact';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const CONTENT_ROUTES = ['projects', 'about', 'contact'];
const onContentRoute = () => CONTENT_ROUTES.some((r) => window.location.hash.includes(r));

function App() {
    const phaserRef = useRef();
    const [contentRoute, setContentRoute] = useState(onContentRoute());

    // Content routes clip the canvas to the top menu band so the page below
    // stays clickable; home keeps the full canvas.
    useEffect(() => {
        const sync = () => setContentRoute(onContentRoute());
        window.addEventListener('hashchange', sync);
        return () => window.removeEventListener('hashchange', sync);
    }, []);

    return (
        <div>
            <div id="app">
                <div className={contentRoute ? 'phaser-container phaser-container--page' : 'phaser-container'}>
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
