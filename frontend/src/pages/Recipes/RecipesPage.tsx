import styles from './RecipesPage.module.scss'

export default function RecipesPage() {
  return (
    <div className={styles.recipes}>
      <h1>Recipes</h1>
      <p>Discover our best culinary creations — from appetizers to desserts.</p>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>🥗 Caesar Salad</h3>
          <p>Classic salad with a homemade dressing.</p>
        </div>
        <div className={styles.card}>
          <h3>🍰 Chocolate Cake</h3>
          <p>Rich, moist, and absolutely irresistible.</p>
        </div>
      </div>
    </div>
  )
}
