import styles from './AboutUsPage.module.scss'

export default function AboutUsPage() {
  return (
    <section className={styles.about}>
      <div className="container">
        <h1>About Us</h1>
        <p>
          Welcome to our Culinary Blog! 🍳  
          Here we share our love for cooking, inspiring recipes, and kitchen stories.
        </p>
        <p>
          Our mission is to bring people together through food — from traditional recipes to modern dishes.
        </p>
      </div>
    </section>
  )
}
