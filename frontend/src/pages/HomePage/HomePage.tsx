import styles from './HomePage.module.scss'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import postCardImg from '../../assets/postCardImg.png'
import authorImg from '../../assets/author.png'
import meal1 from '../../assets/meal1.jpg'
import RecipesSlider from '../../components/RecipesSlider/RecipesSlider'
import PostCard from '../../components/PostCard/PostCard'
import Subscription from '../../components/Subscribtion/Subscription'
export default function HomePage() {

  const recipes = [
  {
    id: 1,
    title: 'Pumpkin Oatmeal',
    description: 'Warm and cozy fall breakfast with spices.',
    image: meal1,
    author: 'Wade Warren',
    date: '12 November 2021',
  },
  {
    id: 2,
    title: 'Avocado Toast',
    description: 'Crispy sourdough topped with fresh avocado.',
    image: meal1,
    author: 'Courtney Henry',
    date: '13 November 2021',
  },
  {
    id: 3,
    title: 'Miso Ramen',
    description: 'Authentic Japanese noodles with rich umami broth.',
    image: meal1,
    author: 'Marvin McKinney',
    date: '15 November 2021',
  },
    {
    id: 34,
    title: 'Miso Ramen',
    description: 'Authentic Japanese noodles with rich umami broth.',
    image: meal1,
    author: 'Marvin McKinney',
    date: '15 November 2021',
  },
    {
    id: 5,
    title: 'Miso Ramen',
    description: 'Authentic Japanese noodles with rich umami broth.',
    image: meal1,
    author: 'Marvin McKinney',
    date: '15 November 2021',
  },
    {
    id: 6,
    title: 'Miso Ramen',
    description: 'Authentic Japanese noodles with rich umami broth.',
    image: meal1,
    author: 'Marvin McKinney',
    date: '15 November 2021',
  },
]

  return (
    <div className={`${styles.home_container} container`}>
      <h1>Welcome to Culinary Blog</h1>
      <h2>Welcome to Culinary Blog</h2>
      <h3>Welcome to Culinary Blog</h3>
      <h4>Welcome to Culinary Blog</h4>

      <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae, maiores blanditiis? Reiciendis magnam odit nostrum, minus reprehenderit beatae doloribus earum qui, quasi atque, similique velit! Repellendus officiis adipisci ullam labore.</p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button as='a'>Simple Button</Button>
        <Button as='a' showIcon iconPosition='right'>Play Video</Button>
      </div>
      <div style={{width: "400px"}}>
          <Card cookingTime='15' foodType="Snack" name='Fruity Pancake with Orange & Blueberry' imageSrc={meal1} />
          <Card withBlueBg={true} cookingTime='15' foodType="Snack" name='Fruity Pancake with Orange & Blueberry' imageSrc={meal1} />
      </div>

      <div style={{width: "840px"}}>
        <PostCard title='Crochet Projects for Noodle Lovers' description='Lorem ipsum dolor sit amet, consectetuipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqut enim' author='Wade Warren' date='12 November 2021' imageSrc={postCardImg} authorImgSrc={authorImg} />
        <PostCard title='Crochet Projects for Noodle Lovers' description='Lorem ipsum dolor sit amet, consectetuipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqut enim' author='Wade Warren' date='12 November 2021' imageSrc={postCardImg} authorImgSrc={authorImg} />     
      </div>
      <div style={{width: "400px"}}>
        <PostCard small={true} title='Crochet Projects for Noodle Lovers'  description='Lorem ipsum dolor sit amet, consectetuipisicing elit, sed   do eiusmod tempor incididunt ut labore et dolore magna aliqut enim'   author='Wade Warren' date='12 November 2021' imageSrc={postCardImg}   authorImgSrc={authorImg} />
      </div>
      <Subscription />

      <RecipesSlider recipes={recipes} slidesPerView={4} autoplay={true} loop={true}/>
    </div>
  )
}
