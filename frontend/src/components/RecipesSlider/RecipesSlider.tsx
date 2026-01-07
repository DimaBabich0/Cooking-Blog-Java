import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import styles from "./RecipesSlider.module.scss";
import Card from "../Card/Card";

type Recipe = {
  id: number;
  title: string;
  description: string;
  image: string;
  author: string;
  date: string;
  cookingTime?: string;
  foodType?: string;
};

type RecipesSliderProps = {
  recipes: Recipe[];
  slidesPerView?: number;
  autoplay?: boolean;
  loop?: boolean;
};

export default function RecipesSlider({
  recipes,
  slidesPerView = 4,
  autoplay = true,
  loop = true,
}: RecipesSliderProps) {
  // Автоматически уменьшаем slidesPerView если элементов недостаточно
  const actualSlidesPerView = Math.min(slidesPerView, recipes.length);
  const canSlide = recipes.length > actualSlidesPerView;
  const shouldLoop = loop && canSlide;
  const shouldAutoplay = autoplay && canSlide;

  // Если рецептов меньше или равно slidesPerView, дублируем их для loop
  const recipesForSlider = canSlide
    ? recipes
    : [
        ...recipes,
        ...recipes.slice(0, Math.max(1, slidesPerView - recipes.length)),
      ];

  return (
    <div className={styles.slider_wrapper}>
      <Swiper
        modules={[Autoplay]}
        spaceBetween={30}
        slidesPerView={actualSlidesPerView}
        loop={shouldLoop}
        autoplay={
          shouldAutoplay
            ? {
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        allowTouchMove={canSlide}
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 16 },
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: slidesPerView, spaceBetween: 30 },
        }}
      >
        {recipesForSlider.map((recipe, index) => (
          <SwiperSlide key={`${recipe.id}-${index}`}>
            <Link
              to={`/recipes/${recipe.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Card
                recipeId={recipe.id}
                cookingTime={recipe.cookingTime || "30"}
                foodType={recipe.foodType || "General"}
                name={recipe.title}
                imageSrc={recipe.image}
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
