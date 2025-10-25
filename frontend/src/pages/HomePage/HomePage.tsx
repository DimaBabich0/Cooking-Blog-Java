import styles from './HomePage.module.scss'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import meal1 from '../../assets/meal1.jpg'

export default function HomePage() {
  return (
    <div className={`${styles.home_container} container`}>
      <h1>Welcome to Culinary Blog</h1>
      <h2>Welcome to Culinary Blog</h2>
      <h3>Welcome to Culinary Blog</h3>
      <h4>Welcome to Culinary Blog</h4>

      <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae, maiores blanditiis? Reiciendis magnam odit nostrum, minus reprehenderit beatae doloribus earum qui, quasi atque, similique velit! Repellendus officiis adipisci ullam labore.</p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button>Simple Button</Button>
        <Button showIcon iconPosition='right'>Play Video</Button>
      </div>
      <div style={{width: "400px"}}>
          <Card cookingTime='15' foodType="Snack" name='Fruity Pancake with Orange & Blueberry' imageSrc={meal1} />
      </div>

    </div>
  )
}
