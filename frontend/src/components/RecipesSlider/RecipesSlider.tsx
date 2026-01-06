import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import styles from './RecipesSlider.module.scss'
import Card from '../Card/Card'

type Recipe = {
  id: number
  title: string
  description: string
  image: string
  author: string
  date: string
  cookingTime?: string
  foodType?: string
}

type RecipesSliderProps = {
  recipes: Recipe[]
  slidesPerView?: number
  autoplay?: boolean
  loop?: boolean
}

export default function RecipesSlider({
  recipes,
  slidesPerView = 3,
  autoplay = true,
  loop = true,
}: RecipesSliderProps) {
  return (
    <div className={styles.slider_wrapper}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={slidesPerView}
        navigation
        pagination={{ clickable: true }}
        loop={loop}
        autoplay={
          autoplay
            ? { delay: 3000, disableOnInteraction: false }
            : false
        }
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 16 },
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: slidesPerView, spaceBetween: 30 },
        }}
      >
        {recipes.map((recipe) => (
          <SwiperSlide key={recipe.id}>
            <Card 
              cookingTime={recipe.cookingTime || '30'} 
              foodType={recipe.foodType || 'General'} 
              name={recipe.title} 
              imageSrc={recipe.image} 
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
