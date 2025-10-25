import styles from './ContactPage.module.scss'

export default function ContactPage() {
  return (
    <div className={styles.contact}>
      <h1>Contact Us</h1>
      <p>We’d love to hear from you! Reach out via the form below.</p>

      <form className={styles.form}>
        <input type="text" placeholder="Your Name" />
        <input type="email" placeholder="Your Email" />
        <textarea placeholder="Your Message" rows={5}></textarea>
        <button type="submit">Send Message</button>
      </form>
    </div>
  )
}
