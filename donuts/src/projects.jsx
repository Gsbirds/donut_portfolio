import { useRef, useState, useEffect } from 'react';
import { PhaserGame } from './game/PhaserGame';
import { EventBus } from './game/EventBus';

function Projects() {
    const phaserRef = useRef();


    return (
        <div id="app">
            <section class="section-blue">
    <section id="projects">
      <article>
        <div class="text">
          <h4>PhilHub</h4>
          <h3></h3>
          <p class="blackbox">Like I mentioned, I have a passion for making education as free and accessible as
            possible. A huge problem I had during my time in academia was the fact that papers that should be in the
            public domain (written by people like Descartes and Hume) were, in fact, not so easy to access or not free if they were. I wanted
            to provide a place that made Philosophy free... again. My ultimate goal is also for people to upload their
            own works and to be able to collaborate and build a community that helps them learn, grow, and be better
            philosophers who write better papers. In this way, they will also be able to give back. You should not have
            to pay for college to be able to be a philosopher- this is antithetical to what a philosopher is.
            I constructed this website using Django.
          <a class="link" href="https://github.com/Gsbirds/Philhub">https://github.com/Gsbirds/Philhub</a>
          </p>
          <h4>Technologies used include:</h4>
          <ul>
            <li>Javascript, Python, Django, React</li>
          </ul>
        </div>
        <div class="projects">
          <div id="myCarousel" class="carousel slide">
            <div class="carousel-indicators">
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            {/* <div class="carousel-inner">
              <div class="carousel-item active">
                <img src="./donuts/public/assets/philhub1.png" id="first-phil" alt="..."/>
              </div>
              <div class="carousel-item">
                <img src=".//donuts/public/assets/philhub2.png" class="d-block" id="second-phil" alt="..."/>
              </div>
              <div class="carousel-item">
                <img src="./donuts/public/assets/philhub2.png" class="d-block" alt="..."/>
              </div>
            </div> */}
            <button class="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
         </div>
      </article>
    </section>
  </section>
        </div>
    );
}

export default Projects;