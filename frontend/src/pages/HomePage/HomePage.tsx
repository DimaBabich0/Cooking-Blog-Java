import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import PostCard from "../../components/PostCard/PostCard";
import Subscription from "../../components/Subscribtion/Subscription";
import RecipesSlider from "../../components/RecipesSlider/RecipesSlider";
import { getRecipes, RecipeDto } from "../../api/recipeApi";
import { getBlogs, BlogDto } from "../../api/blogApi";
import { getCategories, CategoryDto } from "../../api/categoryApi";
import { getImageUrl } from "../../api/filesApi";
import styles from "./HomePage.module.scss";

export default function HomePage() {
  const [topRecipe, setTopRecipe] = useState<RecipeDto | null>(null);
  const [recipes, setRecipes] = useState<RecipeDto[]>([]);
  const [blogs, setBlogs] = useState<BlogDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [recipesData, blogsData, categoriesData] = await Promise.all([
        getRecipes(),
        getBlogs(),
        getCategories(),
      ]);

      setRecipes(recipesData);
      setBlogs(blogsData.slice(0, 3)); // Берем первые 3 блога
      setCategories(categoriesData);

      // Берем первый рецепт как топовый
      if (recipesData.length > 0) {
        setTopRecipe(recipesData[0]);
      }
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  }

  // Берем первые 3 рецепта для слайдера
  const sliderRecipes = recipes.slice(0, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <section className={styles.recipies_slider}>
        <div className="container">
          <p>Загрузка...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className={styles.recipies_slider}>
        <div className="container">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            loop={sliderRecipes.length > 1}
            autoplay={{
              delay: 10000,
              disableOnInteraction: false,
            }}
            className={styles.swiper}
          >
            {sliderRecipes.map((recipe) => (
              <SwiperSlide key={recipe.id}>
                <div className={styles.recipe}>
                  <div className={styles.recipe_info}>
                    <div className={styles.recipe_category}>
                      <span>
                        {recipe.categoryDtos && recipe.categoryDtos.length > 0
                          ? recipe.categoryDtos[0].name
                          : "Hot Recipes"}
                      </span>
                    </div>
                    <h1>{recipe.title}</h1>
                    <p>
                      {recipe.description ||
                        "Lorem ipsum dolor sit amet, consectetuipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqut enim ad minim"}
                    </p>
                    <div className={styles.recipe_tags}>
                      {recipe.cookingTime && (
                        <div className={styles.tag}>
                          <img src="" alt="" />
                          <p>{recipe.cookingTime} Minutes</p>
                        </div>
                      )}
                      {recipe.categoryDtos &&
                        recipe.categoryDtos.length > 0 && (
                          <div className={styles.tag}>
                            <img src="" alt="" />
                            <p>{recipe.categoryDtos[0].name}</p>
                          </div>
                        )}
                    </div>
                    <div className={styles.recipe_bottom}>
                      <div className={styles.author}>
                        {recipe.userDto?.photoUrl && (
                          <img
                            src={getImageUrl(recipe.userDto.photoUrl)}
                            alt={recipe.userDto.username || "Author"}
                          />
                        )}
                        <div>
                          <span>
                            {recipe.userDto?.firstName &&
                            recipe.userDto?.lastName
                              ? `${recipe.userDto.firstName} ${recipe.userDto.lastName}`
                              : recipe.userDto?.username || "Unknown"}
                          </span>
                          <p>
                            {recipe.createdAt
                              ? formatDate(recipe.createdAt)
                              : "15 March 2022"}
                          </p>
                        </div>
                      </div>
                      <Button as="a" href={`/recipes/${recipe.id}`}>
                        View Recipe
                      </Button>
                    </div>
                  </div>
                  <div className={styles.recipe_image}>
                    {recipe.photoUrl ? (
                      <img
                        src={getImageUrl(recipe.photoUrl)}
                        alt={recipe.title}
                      />
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <section className={styles.categories}>
        <div className="container">
          <div className={styles.categories_header}>
            <h2>Categories</h2>
            <Button as="a" href="/recipes" variant="secondary">
              View All Categories
            </Button>
          </div>
          <div className={styles.categories_list}>
            {categories.length > 0
              ? categories.slice(0, 6).map((category) => (
                  <Link
                    key={category.id}
                    to={`/recipes?category=${category.id}`}
                    className={styles.category_item}
                  >
                    {category.photoUrl && (
                      <img
                        src={getImageUrl(category.photoUrl)}
                        alt={category.name}
                      />
                    )}
                    <span>{category.name}</span>
                  </Link>
                ))
              : // Заглушки для верстки, когда категорий нет
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className={styles.category_item}>
                    <div className={styles.category_placeholder}>
                      {/* Placeholder для изображения */}
                    </div>
                    <span>Category {index + 1}</span>
                  </div>
                ))}
          </div>
        </div>
      </section>
    </>
  );
}
