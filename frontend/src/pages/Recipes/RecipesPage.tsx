import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getRecipe, RecipeDto, IngredientDto } from "../../api/recipeApi";
import { getRecipes } from "../../api/recipeApi";
import { getBlogs, BlogDto } from "../../api/blogApi";
import { getImageUrl } from "../../api/filesApi";
import Button from "../../components/Button/Button";
import PostCard from "../../components/PostCard/PostCard";
import Card from "../../components/Card/Card";
import RecipesSlider from "../../components/RecipesSlider/RecipesSlider";
import Subscription from "../../components/Subscribtion/Subscription";
import { Timer, ForkKnife, Printer, Share } from "../../iconComponents";
import styles from "./RecipesPage.module.scss";
import blogStyles from "../BlogPage/BlogPage.module.scss";
import adImage from "../../assets/1.png";
import maskGroup from "../../assets/Mask Group.svg";

const RECIPES_PER_PAGE = 6;

export default function RecipesPage() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<RecipeDto | null>(null);
  const [allRecipes, setAllRecipes] = useState<RecipeDto[]>([]);
  const [relatedRecipes, setRelatedRecipes] = useState<RecipeDto[]>([]);
  const [blogs, setBlogs] = useState<BlogDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        if (id) {
          // Загружаем один рецепт
          console.log("Loading recipe with id:", id);
          const [recipeData, recipesData] = await Promise.all([
            getRecipe(id),
            getRecipes(),
          ]);
          console.log("Recipe loaded:", recipeData);
          setRecipe(recipeData);
          // Исключаем текущий рецепт из related
          setRelatedRecipes(
            recipesData.filter((r) => r.id !== recipeData.id).slice(0, 4)
          );
        } else {
          // Загружаем список рецептов и блоги для сайдбара
          const [recipesData, blogsData] = await Promise.all([
            getRecipes(),
            getBlogs(),
          ]);
          setAllRecipes(recipesData);
          setBlogs(blogsData.slice(0, 3)); // Для sidebar
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err instanceof Error ? err.message : "Failed to load recipes");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  // Сбрасываем страницу при изменении поискового запроса
  useEffect(() => {
    if (!id) {
      setCurrentPage(1);
    }
  }, [searchQuery, id]);

  const filteredRecipes = allRecipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Вычисляем пагинацию
  const totalPages = Math.ceil(filteredRecipes.length / RECIPES_PER_PAGE);
  const startIndex = (currentPage - 1) * RECIPES_PER_PAGE;
  const endIndex = startIndex + RECIPES_PER_PAGE;
  const currentRecipes = filteredRecipes.slice(startIndex, endIndex);

  // Генерируем номера страниц для отображения
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // Максимум видимых страниц

    if (totalPages <= maxVisible) {
      // Если страниц мало, показываем все
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Если страниц много, показываем с многоточием
      if (currentPage <= 3) {
        // В начале
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // В конце
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // В середине
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Если нет id - показываем список рецептов
  if (!id) {
    if (loading) {
      return (
        <section className={blogStyles.list_content}>
          <div className="container">
            <p>Loading...</p>
          </div>
        </section>
      );
    }

    return (
      <>
        {/* Header Section */}
        <section className={blogStyles.list_header}>
          <div className="container">
            <div className={blogStyles.section_title}>
              <h1>Recipes</h1>
              <p>
                Discover our best culinary creations — from appetizers to
                desserts.
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className={blogStyles.list_search}>
          <div className="container">
            <div className={blogStyles.search}>
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={blogStyles.search_input}
              />
              <Button
                as="input"
                value="Search"
                inputType="submit"
                variant="primary"
              />
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className={blogStyles.list_content}>
          <div className="container">
            <div className={blogStyles.content}>
              {/* Main Content - Recipes */}
              <div className={blogStyles.list_main}>
                {error && <div className={blogStyles.error}>{error}</div>}

                {loading ? (
                  <p>Загрузка...</p>
                ) : filteredRecipes.length === 0 ? (
                  <p>Рецепты не найдены</p>
                ) : (
                  <>
                    {currentRecipes.map((r) => (
                      <Link
                        key={r.id}
                        to={`/recipes/${r.id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <PostCard
                          title={r.title}
                          description={r.description || ""}
                          author={r.userDto?.username || "Неизвестно"}
                          authorImgSrc={
                            r.userDto?.photoUrl
                              ? getImageUrl(r.userDto.photoUrl)
                              : undefined
                          }
                          date={
                            r.createdAt
                              ? new Date(r.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )
                              : undefined
                          }
                          imageSrc={
                            r.photoUrl ? getImageUrl(r.photoUrl) : undefined
                          }
                        />
                      </Link>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className={blogStyles.list_pagination}>
                        {getPageNumbers().map((page, index) => {
                          if (page === "...") {
                            return (
                              <span
                                key={`ellipsis-${index}`}
                                className={blogStyles.ellipsis}
                              >
                                ...
                              </span>
                            );
                          }
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page as number)}
                              className={
                                currentPage === page
                                  ? `${blogStyles.pagination_btn} ${blogStyles.active}`
                                  : blogStyles.pagination_btn
                              }
                            >
                              {page}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Sidebar */}
              <div className={blogStyles.list_sidebar}>
                <div className={blogStyles.sidebar_section}>
                  <h3>Blog & Article</h3>
                  <div className={blogStyles.sidebar_list}>
                    {blogs.map((blog) => (
                      <Link
                        key={blog.id}
                        to={`/blog/${blog.id}`}
                        className={blogStyles.sidebar_item}
                      >
                        <PostCard
                          small={true}
                          title={blog.title}
                          description={blog.description}
                          imageSrc={
                            blog.photoUrl
                              ? getImageUrl(blog.photoUrl)
                              : undefined
                          }
                        />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Ad Section */}
                <div className={blogStyles.ad_section}>
                  <div className={blogStyles.ad_image}>
                    <h3 className={blogStyles.ad_title}>
                      Don't forget to eat healthy food
                    </h3>
                    <img src={maskGroup} alt="" className={blogStyles.ad_bg} />
                    <img
                      src={adImage}
                      alt="Healthy food"
                      className={blogStyles.ad_main_image}
                    />
                    <p>www.foodieland.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Subscription />
      </>
    );
  }

  // Если есть id - показываем детали рецепта
  if (id) {
    if (loading) {
      return (
        <section className={styles.recipe}>
          <div className="container">
            <p>Loading recipe...</p>
          </div>
        </section>
      );
    }

    if (error) {
      return (
        <section className={styles.recipe}>
          <div className="container">
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <h2>Error</h2>
              <p>{error}</p>
              <p
                style={{
                  marginTop: "1rem",
                  fontSize: "0.875rem",
                  color: "#666",
                }}
              >
                Recipe ID: {id}
              </p>
            </div>
          </div>
        </section>
      );
    }

    if (!recipe) {
      return (
        <section className={styles.recipe}>
          <div className="container">
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <h2>Recipe not found</h2>
              <p
                style={{
                  marginTop: "1rem",
                  fontSize: "0.875rem",
                  color: "#666",
                }}
              >
                Recipe ID: {id}
              </p>
            </div>
          </div>
        </section>
      );
    }

    // Если дошли сюда, значит id есть, loading false, error нет, recipe есть
    // Продолжаем с отображением рецепта
  } else {
    // Если нет id, мы уже вернули список выше
    return null;
  }

  // В этом месте мы уверены, что id есть, loading false, error нет, recipe не null
  // TypeScript guard
  if (!recipe) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const authorName =
    recipe.userDto?.firstName && recipe.userDto?.lastName
      ? `${recipe.userDto.firstName} ${recipe.userDto.lastName}`
      : recipe.userDto?.username || "Unknown";

  // Парсим directions из text (предполагаем, что это HTML или простой текст)
  const parseDirections = (text: string) => {
    if (!text) return [];
    // Если текст содержит HTML, парсим его
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = text;
    const paragraphs = tempDiv.querySelectorAll("p, div");

    if (paragraphs.length > 0) {
      return Array.from(paragraphs).map((p, idx) => ({
        number: idx + 1,
        text: p.textContent || p.innerHTML,
        html: p.innerHTML,
      }));
    }

    // Если это простой текст, разбиваем по строкам
    const lines = text.split("\n").filter((line) => line.trim());
    return lines.map((line, idx) => ({
      number: idx + 1,
      text: line.trim(),
      html: line.trim(),
    }));
  };

  const directions = parseDirections(recipe.text || "");

  // Группируем ингредиенты (пока просто все в одну группу "For main dish")
  const ingredients = recipe.ingredientsDto || [];
  const mainDishIngredients = ingredients.slice(
    0,
    Math.ceil(ingredients.length / 2)
  );
  const sauceIngredients = ingredients.slice(Math.ceil(ingredients.length / 2));

  return (
    <>
      <section className={styles.recipe}>
        <div className="container">
          <div className={styles.recipe_wrapper}>
            <div className={styles.recipe_main}>
              <h1>{recipe.title}</h1>

              <div className={styles.recipe_meta}>
                <div className={styles.author_info}>
                  {recipe.userDto?.photoUrl && (
                    <img
                      src={getImageUrl(recipe.userDto.photoUrl)}
                      alt={authorName}
                      className={styles.author_img}
                    />
                  )}
                  <div>
                    <div className={styles.author_name}>{authorName}</div>
                    <div className={styles.date}>
                      {formatDate(recipe.createdAt)}
                    </div>
                  </div>
                </div>

                <div className={styles.recipe_stats}>
                  {recipe.cookingTime && (
                    <div className={styles.stat_item}>
                      <Timer />
                      <span>PREP TIME {recipe.cookingTime} Minutes</span>
                    </div>
                  )}
                  {recipe.cookingTime && (
                    <div className={styles.stat_item}>
                      <Timer />
                      <span>COOK TIME {recipe.cookingTime} Minutes</span>
                    </div>
                  )}
                  {recipe.categoryDtos && recipe.categoryDtos.length > 0 && (
                    <div className={styles.stat_item}>
                      <span>{recipe.categoryDtos[0].name}</span>
                    </div>
                  )}
                </div>
              </div>

              {recipe.photoUrl && (
                <div className={styles.recipe_image}>
                  <img src={getImageUrl(recipe.photoUrl)} alt={recipe.title} />
                  <div className={styles.play_overlay}>
                    <button className={styles.play_btn}>▶</button>
                  </div>
                </div>
              )}

              <p className={styles.recipe_description}>
                {recipe.description || "Delicious recipe for your table"}
              </p>

              <div className={styles.recipe_content_main}>
                <section className={styles.ingredients_section}>
                  <h2>Ingredients</h2>
                  <div className={styles.ingredients_list}>
                    {mainDishIngredients.length > 0 && (
                      <div className={styles.ingredient_group}>
                        <h3>For main dish</h3>
                        <div className={styles.ingredient_items}>
                          {mainDishIngredients.map((ing, idx) => (
                            <label key={idx} className={styles.ingredient_item}>
                              <input type="checkbox" />
                              <span>
                                {ing.productName}
                                {ing.quantity &&
                                  ` - ${ing.quantity}${ing.unit || "g"}`}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    {sauceIngredients.length > 0 && (
                      <div className={styles.ingredient_group}>
                        <h3>For the sauce</h3>
                        <div className={styles.ingredient_items}>
                          {sauceIngredients.map((ing, idx) => (
                            <label key={idx} className={styles.ingredient_item}>
                              <input type="checkbox" />
                              <span>
                                {ing.productName}
                                {ing.quantity &&
                                  ` - ${ing.quantity}${ing.unit || "g"}`}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    {ingredients.length === 0 && (
                      <div className={styles.ingredient_group}>
                        <h3>For main dish</h3>
                        <div className={styles.ingredient_items}>
                          <p className={styles.no_ingredients}>
                            No ingredients specified
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                <section className={styles.directions_section}>
                  <h2>Directions</h2>
                  <div className={styles.directions_list}>
                    {directions.length > 0 ? (
                      directions.map((step) => (
                        <div
                          key={step.number}
                          className={styles.direction_step}
                        >
                          <div className={styles.step_number}>
                            {step.number}
                          </div>
                          <div className={styles.step_content}>
                            <p
                              dangerouslySetInnerHTML={{ __html: step.html }}
                            />
                            {step.number === 1 && recipe.photoUrl && (
                              <div className={styles.step_image}>
                                <img
                                  src={getImageUrl(recipe.photoUrl)}
                                  alt={`Step ${step.number}`}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={styles.direction_step}>
                        <div className={styles.step_number}>1</div>
                        <div className={styles.step_content}>
                          <p
                            dangerouslySetInnerHTML={{
                              __html: recipe.text || "No directions provided",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>

            <aside className={styles.recipe_sidebar}>
              <div className={styles.sidebar_actions}>
                <button className={styles.action_btn} title="Print">
                  <Printer />
                  <span>PRINT</span>
                </button>
                <button className={styles.action_btn} title="Share">
                  <Share />
                  <span>SHARE</span>
                </button>
              </div>

              <div className={styles.nutrition}>
                <h3>Nutrition Information</h3>
                <div className={styles.nutrition_list}>
                  <div className={styles.nutrition_item}>
                    <span>Calories</span>
                    <span>219.8 kcal</span>
                  </div>
                  <div className={styles.nutrition_item}>
                    <span>Total Fat</span>
                    <span>19.7 g</span>
                  </div>
                  <div className={styles.nutrition_item}>
                    <span>Protein</span>
                    <span>7.8 g</span>
                  </div>
                  <div className={styles.nutrition_item}>
                    <span>Carbohydrates</span>
                    <span>22.3 g</span>
                  </div>
                  <div className={styles.nutrition_item}>
                    <span>Cholesterol</span>
                    <span>214 mg</span>
                  </div>
                </div>
                <p className={styles.nutrition_note}>
                  Lorem ipsum dolor sit amet, consectetuipisicing elit
                </p>
              </div>

              <div className={styles.other_recipes}>
                <h3>Other Recipe</h3>
                <div className={styles.other_recipes_list}>
                  {relatedRecipes.slice(0, 3).map((r) => (
                    <Link
                      key={r.id}
                      to={`/recipes/${r.id}`}
                      className={styles.other_recipe_item}
                    >
                      {r.photoUrl && (
                        <img
                          src={getImageUrl(r.photoUrl)}
                          alt={r.title}
                          className={styles.other_recipe_img}
                        />
                      )}
                      <div className={styles.other_recipe_info}>
                        <h4>{r.title}</h4>
                        <p>By {r.userDto?.username || "Unknown"}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <Subscription />
        </div>
      </section>

      {relatedRecipes.length > 0 && (
        <section className={styles.related_section}>
          <div className="container">
            <h2>You may like these recipe too</h2>
            <RecipesSlider
              recipes={relatedRecipes.map((r) => ({
                id: r.id,
                title: r.title,
                description: r.description || "",
                image: r.photoUrl ? getImageUrl(r.photoUrl) : "",
                author: r.userDto?.username || "Unknown",
                date: new Date(r.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }),
                cookingTime: r.cookingTime?.toString() || "30",
                foodType: r.categoryDtos?.[0]?.name || "General",
              }))}
              slidesPerView={4}
              autoplay={true}
              loop={true}
            />
          </div>
        </section>
      )}
    </>
  );
}
