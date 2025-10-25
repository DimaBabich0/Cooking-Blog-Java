import styles from './BlogPage.module.scss'

export default function BlogPage() {
  return (
    <div className={styles.blog}>
      <h1>Our Blog</h1>
      <p>
        Dive into our latest cooking tips, kitchen hacks, and stories from passionate chefs.
      </p>

      <div className={styles.posts}>
        <div className={styles.post}>
          <h3>🍝 The Secret of Perfect Pasta</h3>
          <p>Learn how to make al dente pasta every single time.</p>
        </div>
        <div className={styles.post}>
          <h3>🥖 Homemade Bread Journey</h3>
          <p>From dough to crust — everything you need to know about baking.</p>
        </div>
      </div>
    </div>
  )
}
