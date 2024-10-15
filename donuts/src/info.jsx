import { useRef } from 'react';

function Info() {
    const phaserRef = useRef();

    return (
        <div className="parallax">
        <div id="intro">

        <p className='introbox'> 
        <p class="name">Hi, my name is Gabby</p>
          I am a software engineer with a huge passion for philosophy and learning. I am also an artist. During my
          time in graduate school for philosophy, my focus was on the Philosophy of Artifical Intelligence and
          Cognitive Science. There I was also able to recognize my interest in learning how to code.
          I have been writing code for about 4 years now, spending the last year at Allfly as a Fullstack
          engineer. 
        </p>
        <img class="inkpad2" src="assets/Inpkad2edit.png"></img>

        <footer>
                    <p><i className="fa-solid fa-copyright"></i><b> 2024 Gabrielle Burgard. All Rights Reserved.</b></p>
          </footer>
          
        </div>
        </div>
        
    );
}

export default Info;
