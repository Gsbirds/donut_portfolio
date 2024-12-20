function Projects() {

    return (
        <div className="parallax">
            <div className="projects-padding"> 
            <h2 className="worked"><b>Projects I've worked on</b></h2>
            <section className="section-blue">
                <section id="projects">
                    <article>
                        <div className="text">
                            <h4 className="project-title">Reproductive Health Policy</h4>
                            <p className="blackbox">
                                I used React and Django to make a website that allows people to find out the abortion
                                policies and insurance policies regarding abortion so they can be easily informed. I used an API from
                                Abortion Policy API in order to get this information. My belief is that everyone should have equal, easily
                                available and understandable information about their own healthcare options. I used web sockets to add a
                                chat feature as well. I deployed this on heroku, see the first link below.
                                <a className="link" href="https://glacial-shore-69830-91298bf010bb.herokuapp.com/">Reproductive Health Policy</a>
                                <a className="link" href="https://github.com/Gsbirds/ReproductiveHealthPolicy2">https://github.com/Gsbirds/ReproductiveHealthPolicy2</a>
                            </p>
                            <h4 className="tech">Technologies used include:</h4>
                            <ul>
                                <li className="tech2">Javascript, Python, Django, React</li>
                            </ul>
                        </div>
                        <div id="myCarousel2" className="carousel slide">
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                            </div>
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <img src="assets/reph1.png" className="d-block" id="first-phil" alt="..." />
                                </div>
                                <div className="carousel-item">
                                    <img src="assets/reph2.png" className="d-block" id="second-phil" alt="..." />
                                </div>
                                <div className="carousel-item">
                                    <img src="assets/reph3.png" className="d-block" alt="..." />
                                </div>
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel2" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#myCarousel2" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </article>
                </section>
            </section>

            {/* <section className="section-blue">
                <section id="projects">
                    <article>
                        <div className="text">
                            <h4 className="project-title">Reproductive Health App</h4>
                            <p className="blackbox">
                                I worked on an app in Java using Android studio that extends the capabilities of my
                                Reproductive Health Policy website. It offers the same information about abortion policies by state with the convenience of an app
                                on your phone. This was my first project using Java.
                                <a className="link" href="https://github.com/Gsbirds/ReproductiveHealthApp">https://github.com/Gsbirds/ReproductiveHealthApp</a>
                            </p>
                            <h4 className="tech">Technologies used include:</h4>
                            <ul>
                                <li className="tech2">Java, Android Studio</li>
                            </ul>
                        </div>
                        <img src="assets/Screenshot from 2023-08-31 11-29-52.png" className="d-block" alt="..." />
                    </article>
                </section>
            </section> */}

            <section className="section-blue">
                <section id="projects">
                    <article>
                        <div className="text">
                            <h4 className="project-title">An uninspired blog</h4>
                            <p className="blackbox">
                                I used React and Starlette to make a blog website. Here I intend to post about being a new developer in the current Job market as well as
                                about the more technical aspects of the projects I make. I also deployed this on heroku, see the second link below. 
                                <a className="link" href="https://github.com/Gsbirds/blog">https://github.com/Gsbirds/blog</a>
                                <a className="link" href="https://calm-reef-66202-3443b850ed8c.herokuapp.com/">https://calm-reef-66202-3443b850ed8c.herokuapp.com/</a>
                            </p>
                            <h4 className="tech">Technologies used include:</h4>
                            <ul>
                                <li className="tech2">Python, Javascript, React, Starlette</li>
                            </ul>
                        </div>
                        <img src="assets/blog.png" className="d-block" alt="..." />
                    </article>
                </section>
            </section>

            <section className="section-blue">
                <section id="projects">
                    <article>
                        <div className="text">
                            <h4 className="project-title">Checkit</h4>
                            <p className="blackbox">
                                For our final project at Hack Reactor, my group and I developed this fact-checking website
                                using Google's fact-checker API, FastAPI, and React. I am particularly proud of this project because we also
                                implemented the ability to log in and save your claims that you have fact-checked under specific categories.
                                <a className="link" href="https://gitlab.com/team-dogge/module3-project-gamma">https://gitlab.com/team-dogge/module3-project-gamma</a>
                            </p>
                            <h4 className="tech">Technologies used include:</h4>
                            <ul>
                                <li className="tech2">Javascript, Python, FastAPI, React</li>
                            </ul>
                        </div>
                        <div id="myCarousel1" className="carousel slide">
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                            </div>
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <img src="assets//checkit5.png" className="d-block" id="first-phil" alt="..." />
                                </div>
                                <div className="carousel-item">
                                    <img src="assets/checkit3.png" className="d-block" id="second-phil" alt="..." />
                                </div>
                                <div className="carousel-item">
                                    <img src="assets/checkit4.png" className="d-block" alt="..." />
                                </div>
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel1" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#myCarousel1" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </article>
                </section>
            </section>

            <section className="section-blue">
                <section id="projects">
                    <article>
                        <div className="text">
                            <h4 className="project-title">PhilHub</h4>
                            <p className="blackbox">
                                A huge problem I had during my time in academia was the fact that papers and learning materials that should be in the
                                public domain (written by people like Descartes and Hume) were, in fact, not so easy to access or not free if they were. I wanted
                                to provide a place that made Philosophy free... again. My ultimate goal is also for people to upload their
                                own works and to be able to collaborate and build a community that helps them learn, grow, and be better
                                philosophers who write better papers. In this way, they will also be able to give back. You should not have
                                to pay for college to be able to be a philosopher—this is antithetical to what a philosopher is.
                                I constructed this website using Django.
                                <a className="link" href="https://github.com/Gsbirds/Philhub">https://github.com/Gsbirds/Philhub</a>
                            </p>
                            <h4 className="tech">Technologies used include:</h4>
                            <ul>
                                <li className="tech2">Javascript, Python, Django, React</li>
                            </ul>
                        </div>
                        <div className="projects"> 
                            <div id="myCarousel" className="carousel slide">
                                <div className="carousel-indicators">
                                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                                </div>
                                <div className="carousel-inner">
                                    <div className="carousel-item active">
                                        <img src="assets/philhub1.png" className="d-block" id="first-phil" alt="..." />
                                    </div>
                                    <div className="carousel-item">
                                        <img src="assets/philhub2.png" className="d-block" id="second-phil" alt="..." />
                                    </div>
                                    <div className="carousel-item">
                                        <img src="assets/philhub3.png" className="d-block" alt="..." />
                                    </div>
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        </div> 
                    </article>
                </section>
            </section>

            <img className="inkpad2" src="assets/Ssssnakepad1.png"></img>
            </div>
            <footer>
                    <p><i className="fa-solid fa-copyright"></i><b> 2024 Gabrielle Burgard. All Rights Reserved.</b></p>
            </footer>
        </div>

        
    );
}

export default Projects;
