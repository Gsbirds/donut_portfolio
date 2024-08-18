import { useRef } from 'react';

function Contact() {
    const phaserRef = useRef();

    return (
        <div className="parallax">
          <section id="contact">
    <h2>Contact me</h2>
    <p class="message">I'd love to hear your thoughts!</p>
    <button class="contact_btn" type="button">
      <a href="mailto: gabbyburgard@the-gabby.com">Contact me</a>
    </button>
  </section>

  <footer>
    <h1 class="fullstack">Gabby Burgard <i id="heart" class="fa-solid fa-heart"></i> Fullstack Developer and Artist.</h1>
    <img class="inkpad" src="assets/inkpad1.png"></img>
    <p> <i class="fa-solid fa-copyright"></i><b> 2024 Gabrielle Burgard. All Rights Reserved.</b></p>
  </footer>
        </div>
        
    );
}

export default Contact;
