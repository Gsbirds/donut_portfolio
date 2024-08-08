import { useRef, useState, useEffect } from 'react';
import { PhaserGame } from './game/PhaserGame';
import { EventBus } from './game/EventBus';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Projects from './projects';


function App() {
    const phaserRef = useRef();
    const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0 });
    const [sceneReady, setSceneReady] = useState(false);
    const [donutClicked, setDonutClicked]= useState(false);

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
            {/* <h5>Gabby's Donut Shop</h5> */}
            {/* {location.pathname !== "/" && donutClicked && ( */}
                <div id="app">
                    <PhaserGame ref={phaserRef} donutClicked={donutClicked} setDonutClicked={setDonutClicked} />
                    {sceneReady && <div></div>}
                </div>
            {/* )} */}
            <Router>
                <Routes>
                    <Route path="/projects" element={<Projects />} />
                </Routes>
            </Router>
        </div>
    );
    
}

export default App;