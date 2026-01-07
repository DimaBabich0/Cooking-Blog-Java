import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import chefPhoto from "../../assets/chef.png";
import post1 from "../../assets/Post.jpg";
import post2 from "../../assets/Post-1.jpg";
import post3 from "../../assets/Post-2.jpg";
import post4 from "../../assets/Post-3.jpg";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const [recipesData, blogsData, categoriesData] = await Promise.all([
        getRecipes(),
        getBlogs(),
        getCategories(),
      ]);

      setRecipes(recipesData);
      setBlogs(blogsData.slice(0, 3)); // Take first 3 blogs
      setCategories(categoriesData);

      // Take first recipe as top recipe
      if (recipesData.length > 0) {
        setTopRecipe(recipesData[0]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Error loading data:", err);
      setError(
        `Error loading data: ${errorMessage}. Make sure the backend is running on http://localhost:8080`
      );
    } finally {
      setLoading(false);
    }
  }

  // Take first 3 recipes for slider
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
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.recipies_slider}>
        <div className="container">
          <div
            style={{
              padding: "2rem",
              background: "#fee",
              border: "1px solid #fcc",
              borderRadius: "8px",
              margin: "2rem 0",
            }}
          >
            <h2 style={{ color: "#c00", marginBottom: "1rem" }}>
              Error loading data
            </h2>
            <p style={{ color: "#800", marginBottom: "1rem" }}>{error}</p>
            <button
              onClick={loadData}
              style={{
                padding: "0.5rem 1rem",
                background: "#0066cc",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
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
            spaceBetween={30}
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
                      <Button
                        showIcon
                        iconPosition="right"
                        as="a"
                        href={`/recipes/${recipe.id}`}
                      >
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
        <div className={`${styles.categories_container} container`}>
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
              : // Placeholders for layout when no categories
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className={styles.category_item}>
                    <div className={styles.category_placeholder}>
                      {/* Image placeholder */}
                    </div>
                    <span>Category {index + 1}</span>
                  </div>
                ))}
          </div>
        </div>
      </section>

      <section className={styles.recipes}>
        <div className="container">
          <div className={styles.recipes_header}>
            <h2>Simple and tasty recipes</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          <div className={styles.recipies_grid}>
            {recipes.slice(0, 9).map((recipe) => (
              <Link
                key={recipe.id}
                to={`/recipes/${recipe.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Card
                  recipeId={recipe.id}
                  withBlueBg={true}
                  name={recipe.title}
                  imageSrc={
                    recipe.photoUrl ? getImageUrl(recipe.photoUrl) : undefined
                  }
                  cookingTime={
                    recipe.cookTime
                      ? recipe.cookTime.toString()
                      : recipe.cookingTime
                      ? recipe.cookingTime.toString()
                      : "30"
                  }
                  foodType={
                    recipe.categoryDtos && recipe.categoryDtos.length > 0
                      ? recipe.categoryDtos[0].name
                      : "General"
                  }
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.chef}>
        <div className={`${styles.chef_container} container`}>
          <div className={styles.chef_content}>
            <h2>Everyone can be a chef in their own kitchen</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetuipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqut enim ad
              minim{" "}
            </p>
            <Button as="a" href="/recipes" variant="primary">
              Learn more
            </Button>
          </div>
          <div className={styles.chef_image_wrapper}>
            <img src={chefPhoto} alt="" />
          </div>
        </div>
      </section>

      <section className={styles.instagram}>
        <div className="container">
          <div className={styles.instagram_header}>
            <h2>Check out @foodieland on Instagram</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetuipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqut enim ad
              minim{" "}
            </p>
          </div>
          <div className={styles.instagram_grid}>
            <img src={post1} alt="Instagram post 1" />
            <img src={post2} alt="Instagram post 2" />
            <img src={post3} alt="Instagram post 3" />
            <img src={post4} alt="Instagram post 4" />
          </div>
          <Button as="a" href="/instagram" variant="primary">
            Visit Our Instagram
          </Button>
        </div>
      </section>

      <section className={styles.recipes_tasty_grid}>
        <div className="container">
          <div className={styles.recipes_tasty_grid_header}>
            <h2>Try this delicious recipe to make your day</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetuipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqut enim ad
              minim{" "}
            </p>
          </div>
          <div className={styles.recipes_tasty_grid_list}>
            {recipes.slice(0, 8).map((recipe) => (
              <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
                <Card
                  recipeId={recipe.id}
                  name={recipe.title}
                  imageSrc={
                    recipe.photoUrl ? getImageUrl(recipe.photoUrl) : undefined
                  }
                  cookingTime={
                    recipe.cookTime
                      ? recipe.cookTime.toString()
                      : recipe.cookingTime
                      ? recipe.cookingTime.toString()
                      : "30"
                  }
                  foodType={
                    recipe.categoryDtos && recipe.categoryDtos.length > 0
                      ? recipe.categoryDtos[0].name
                      : "General"
                  }
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Subscription></Subscription>
    </>
  );
}
