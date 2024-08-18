import { useRef } from 'react';
import { PhaserGame } from './game/PhaserGame';
import { EventBus } from './game/EventBus';

function Info() {
    const phaserRef = useRef();

    return (
        <div className="parallax">
        <div id="intro">

<p class="name">Hi, my name is</p>

<p> I am a software engineer with a huge passion for philosophy and learning. I am also an artist. During my
  time in graduate school for philosophy, my focus was on the Philosophy of Artifical Intelligence and
  Cognitive Science.
</p>
</div>
        </div>
        
    );
}

export default Info;
