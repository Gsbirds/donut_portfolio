import { useRef } from 'react';

function Contact() {
    const phaserRef = useRef();

    return (
        <div className="parallax">
          <section id="contact">
    <h2>Contact me</h2>
    <p className="message">I'd love to hear your thoughts!</p>
    <button className="contact_btn" type="button">
      <a href="mailto: gabbyburgard@the-gabby.com">Contact me</a>
    </button>
  </section>

  <footer>
    <h1 className="fullstack">Gabby Burgard <i id="heart" className="fa-solid fa-heart"></i> Fullstack Developer and Artist.</h1>
    <img className="inkpad" src="assets/inkpad1.png"></img>
  </footer>
        </div>
        
    );
}

export default Contact;
