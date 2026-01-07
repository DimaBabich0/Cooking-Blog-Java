import { useState, useEffect, useRef } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { getRecipe, RecipeDto, IngredientDto } from "../../api/recipeApi";
import { getRecipes } from "../../api/recipeApi";
import { getBlogs, BlogDto } from "../../api/blogApi";
import { getCategories, CategoryDto } from "../../api/categoryApi";
import { getImageUrl } from "../../api/filesApi";
import Button from "../../components/Button/Button";
import PostCard from "../../components/PostCard/PostCard";
import Card from "../../components/Card/Card";
import RecipesSlider from "../../components/RecipesSlider/RecipesSlider";
import Subscription from "../../components/Subscribtion/Subscription";
import AdSection from "../../components/AdSection/AdSection";
import { Timer, ForkKnife, Printer, Share, Filter } from "../../iconComponents";
import styles from "./RecipesPage.module.scss";
import blogStyles from "../BlogPage/BlogPage.module.scss";

const RECIPES_PER_PAGE = 6;

export default function RecipesPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipe, setRecipe] = useState<RecipeDto | null>(null);
  const [allRecipes, setAllRecipes] = useState<RecipeDto[]>([]);
  const [relatedRecipes, setRelatedRecipes] = useState<RecipeDto[]>([]);
  const [blogs, setBlogs] = useState<BlogDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    searchParams.get("category")
      ? parseInt(searchParams.get("category")!)
      : null
  );
  const [cookingTimeFilter, setCookingTimeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);

  // Close filters dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filtersOpen &&
        filtersRef.current &&
        !filtersRef.current.contains(event.target as Node)
      ) {
        setFiltersOpen(false);
      }
    }

    if (filtersOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [filtersOpen]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        if (id) {
          // Load single recipe
          console.log("Loading recipe with id:", id);
          const [recipeData, recipesData] = await Promise.all([
            getRecipe(id),
            getRecipes(),
          ]);
          console.log("Recipe loaded:", recipeData);
          setRecipe(recipeData);
          // Exclude current recipe from related
          setRelatedRecipes(
            recipesData.filter((r) => r.id !== recipeData.id).slice(0, 12)
          );
        } else {
          // Load recipes list and blogs for sidebar
          const [recipesData, blogsData, categoriesData] = await Promise.all([
            getRecipes(),
            getBlogs(),
            getCategories(),
          ]);
          setAllRecipes(recipesData);
          setBlogs(blogsData.slice(0, 3)); // For sidebar
          setCategories(categoriesData);
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

  // Reset page when filters change
  useEffect(() => {
    if (!id) {
      setCurrentPage(1);
    }
  }, [searchQuery, selectedCategory, cookingTimeFilter, sortBy, id]);

  // Update URL when category changes
  useEffect(() => {
    if (selectedCategory) {
      setSearchParams({ category: selectedCategory.toString() });
    } else {
      setSearchParams({});
    }
  }, [selectedCategory, setSearchParams]);

  // Фильтрация рецептов
  const filteredRecipes = allRecipes
    .filter((recipe) => {
      // Поиск по тексту
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // Фильтр по категории
      const matchesCategory =
        !selectedCategory ||
        (recipe.categoryDtos &&
          recipe.categoryDtos.some((cat) => cat.id === selectedCategory));

      // Фильтр по времени готовки
      const cookingTime = recipe.cookTime || recipe.cookingTime || 0;
      let matchesTime = true;
      if (cookingTimeFilter === "quick") {
        matchesTime = cookingTime <= 30;
      } else if (cookingTimeFilter === "medium") {
        matchesTime = cookingTime > 30 && cookingTime <= 60;
      } else if (cookingTimeFilter === "long") {
        matchesTime = cookingTime > 60;
      }

      return matchesSearch && matchesCategory && matchesTime;
    })
    .sort((a, b) => {
      // Сортировка
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (sortBy === "oldest") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else if (sortBy === "time-asc") {
        const timeA = a.cookTime || a.cookingTime || 0;
        const timeB = b.cookTime || b.cookingTime || 0;
        return timeA - timeB;
      } else if (sortBy === "time-desc") {
        const timeA = a.cookTime || a.cookingTime || 0;
        const timeB = b.cookTime || b.cookingTime || 0;
        return timeB - timeA;
      }
      return 0;
    });

  // Calculate pagination
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

        {/* Filters Section */}
        <section className={styles.filters_section}>
          <div className="container">
            <div className={styles.filters_wrapper}>
              <div className={styles.filters_bar} ref={filtersRef}>
                <button
                  className={styles.filters_icon_btn}
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  aria-label="Toggle filters"
                >
                  <Filter />
                </button>
                {filtersOpen && (
                  <div className={styles.filters_dropdown}>
                    {/* Category Filter */}
                    <div className={styles.filter_item}>
                      <select
                        value={selectedCategory || ""}
                        onChange={(e) =>
                          setSelectedCategory(
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        className={styles.filter_select}
                      >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Cooking Time Filter */}
                    <div className={styles.filter_item}>
                      <select
                        value={cookingTimeFilter}
                        onChange={(e) => setCookingTimeFilter(e.target.value)}
                        className={styles.filter_select}
                      >
                        <option value="all">All Times</option>
                        <option value="quick">Quick (≤30 min)</option>
                        <option value="medium">Medium (31-60 min)</option>
                        <option value="long">Long (&gt;60 min)</option>
                      </select>
                    </div>

                    {/* Clear Filters Button */}
                    {(selectedCategory || cookingTimeFilter !== "all") && (
                      <button
                        onClick={() => {
                          setSelectedCategory(null);
                          setCookingTimeFilter("all");
                        }}
                        className={styles.clear_btn}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Sort Filter - отдельно справа */}
              <div className={styles.sort_wrapper}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={styles.sort_select}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="time-asc">Time: Low to High</option>
                  <option value="time-desc">Time: High to Low</option>
                </select>
              </div>
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
                  <p>Loading...</p>
                ) : filteredRecipes.length === 0 ? (
                  <p>No recipes found</p>
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
                          author={r.userDto?.username || "Unknown"}
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
                <AdSection />
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

    const tempDiv = document.createElement("div");
    // Если HTML экранирован, декодируем его
    // Проверяем, есть ли экранированные теги
    let decodedText = text;
    if (text.includes("&lt;") || text.includes("&gt;")) {
      // Декодируем HTML сущности
      const txt = document.createElement("textarea");
      txt.innerHTML = text;
      decodedText = txt.value;
    }
    tempDiv.innerHTML = decodedText;

    // Ищем все заголовки (h2, h3, h4) как разделители шагов
    const headings = tempDiv.querySelectorAll("h2, h3, h4");

    if (headings.length > 0) {
      const steps: Array<{
        number: number;
        title: string;
        contentBeforeImage: string;
        image: string | null;
        contentAfterImage: string;
      }> = [];

      // Разбиваем контент по заголовкам
      headings.forEach((heading, idx) => {
        const stepNumber = idx + 1;
        const title = heading.textContent || "";

        // Находим следующий заголовок
        const nextHeading = headings[idx + 1];

        // Используем более простой подход - извлекаем HTML напрямую
        // Находим индекс текущего заголовка в исходном HTML
        const headingHTML = heading.outerHTML;
        const nextHeadingHTML = nextHeading ? nextHeading.outerHTML : "";

        // Получаем весь HTML исходного контейнера
        const fullHTML = tempDiv.innerHTML;

        // Находим позиции заголовков в HTML
        const headingIndex = fullHTML.indexOf(headingHTML);
        const nextHeadingIndex = nextHeading
          ? fullHTML.indexOf(nextHeadingHTML, headingIndex + headingHTML.length)
          : fullHTML.length;

        // Извлекаем HTML между заголовками (исключая сам заголовок)
        const stepHTML = fullHTML
          .substring(headingIndex + headingHTML.length, nextHeadingIndex)
          .trim();

        // Создаем временный контейнер для парсинга изображений
        const stepContainer = document.createElement("div");
        stepContainer.innerHTML = stepHTML;

        // Ищем изображение в контенте
        const image = stepContainer.querySelector("img");
        const imageSrc = image ? image.getAttribute("src") : null;

        // Разделяем контент на части: до изображения и после
        let contentBeforeImage = "";
        let contentAfterImage = "";

        if (image && imageSrc) {
          // Разделяем HTML по тегу изображения
          const imageHTML = image.outerHTML;
          const parts = stepHTML.split(imageHTML);
          contentBeforeImage = parts[0] || "";
          contentAfterImage = parts.slice(1).join(imageHTML) || "";
        } else {
          // Если нет изображения, весь контент идет в contentBeforeImage
          contentBeforeImage = stepHTML;
        }

        steps.push({
          number: stepNumber,
          title,
          contentBeforeImage: contentBeforeImage.trim(),
          image: imageSrc,
          contentAfterImage: contentAfterImage.trim(),
        });
      });

      // Возвращаем шаги только если их больше 0
      if (steps.length > 0) {
        return steps;
      }
    }

    // Если нет заголовков, показываем весь контент как один шаг
    // или группируем по изображениям (каждое изображение = новый шаг)
    const allImages = tempDiv.querySelectorAll("img");

    if (allImages.length > 0) {
      // Группируем по изображениям - каждое изображение создает новый шаг
      const steps: Array<{
        number: number;
        title: string;
        contentBeforeImage: string;
        image: string | null;
        contentAfterImage: string;
      }> = [];

      let currentHTML = tempDiv.innerHTML;
      let stepNumber = 1;

      allImages.forEach((img) => {
        const imageHTML = img.outerHTML;
        const imageSrc = img.getAttribute("src");
        const parts = currentHTML.split(imageHTML, 2);

        if (parts.length >= 2) {
          steps.push({
            number: stepNumber++,
            title: "",
            contentBeforeImage: parts[0].trim(),
            image: imageSrc,
            contentAfterImage: parts[1].trim(),
          });
          // Обновляем currentHTML для следующей итерации
          currentHTML = parts[1];
        } else {
          // Последнее изображение
          steps.push({
            number: stepNumber++,
            title: "",
            contentBeforeImage: parts[0].trim(),
            image: imageSrc,
            contentAfterImage: "",
          });
        }
      });

      // Если остался контент после последнего изображения
      if (currentHTML.trim() && steps.length > 0) {
        steps[steps.length - 1].contentAfterImage = currentHTML.trim();
      }

      return steps.length > 0
        ? steps
        : [
            {
              number: 1,
              title: "",
              contentBeforeImage: tempDiv.innerHTML.trim(),
              image: null,
              contentAfterImage: "",
            },
          ];
    }

    // Если нет изображений и заголовков, показываем весь контент как один шаг
    return [
      {
        number: 1,
        title: "",
        contentBeforeImage: tempDiv.innerHTML.trim(),
        image: null,
        contentAfterImage: "",
      },
    ];
  };

  const directions = parseDirections(recipe.text || "");

  // Все ингредиенты в одном списке
  const ingredients = recipe.ingredientsDto || [];

  return (
    <>
      <div className="container">
        <div className={styles.recipe_header}>
          <div className={styles.recipe_header_left}>
            <h1>{recipe.title}</h1>
            <div className={styles.recipe_stats}>
              <div className={`${styles.recipe_author} ${styles.stat_item}`}>
                <img
                  src={getImageUrl(recipe.userDto?.photoUrl)}
                  alt={recipe.userDto?.username}
                />
                <div>
                  <span>{authorName}</span>
                  <p>{formatDate(recipe.createdAt)}</p>
                </div>
              </div>
              {recipe.prepTime && (
                <div className={styles.stat_item}>
                  <Timer />
                  <div>
                    <span>PREP TIME </span>
                    <p>{recipe.prepTime} Minutes</p>
                  </div>
                </div>
              )}
              {recipe.cookTime && (
                <div className={styles.stat_item}>
                  <Timer />
                  <div>
                    <span>COOK TIME </span>
                    <p>{recipe.cookTime} Minutes</p>
                  </div>
                </div>
              )}
              {recipe.categoryDtos && recipe.categoryDtos.length > 0 && (
                <div className={styles.stat_item}>
                  <ForkKnife />
                  <div>
                    <p>{recipe.categoryDtos[0].name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={styles.recipe_header_right}>
            <div className={styles.sidebar_actions}>
              <div>
                <a href="#" className={styles.action_btn} title="Print">
                  <Printer />
                </a>
                <span>PRINT</span>
              </div>
              <div>
                <a href="#" className={styles.action_btn} title="Share">
                  <Share />
                </a>
                <span>SHARE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className={styles.recipe}>
        <div className="container">
          <div className={styles.recipe_main}>
            <div className={styles.recipe_content}>
              {recipe.photoUrl && (
                <div className={styles.recipe_image}>
                  <img src={getImageUrl(recipe.photoUrl)} alt={recipe.title} />
                  {/* <div className={styles.play_overlay}>
                    <button className={styles.play_btn}>▶</button>
                  </div> */}
                </div>
              )}

              <p className={styles.recipe_description}>
                {recipe.description || "Delicious recipe for your table"}
              </p>

              <div className={styles.recipe_ingredients}>
                <h3>Ingredients</h3>
                {ingredients.length > 0 ? (
                  <ul className={styles.ingredients_list}>
                    {ingredients.map((ing, idx) => (
                      <li key={idx} className={styles.ingredient_item}>
                        <input
                          type="radio"
                          name="ingredients"
                          id={`ingredient-${idx}`}
                        />
                        <label htmlFor={`ingredient-${idx}`}>
                          {ing.productName}
                          {ing.quantity &&
                            ` - ${ing.quantity}${ing.unit || "g"}`}
                        </label>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.no_ingredients}>
                    No ingredients specified
                  </p>
                )}
              </div>

              <section className={styles.recipe_directions}>
                <h3>Directions</h3>
                <div className={styles.directions_list}>
                  {directions.length > 0 ? (
                    directions.map((step) => (
                      <div key={step.number} className={styles.direction_step}>
                        <input
                          type="radio"
                          name="directions"
                          id={`direction-${step.number}`}
                        />
                        <div className={styles.step_content}>
                          {step.title && (
                            <h4 className={styles.step_title}>{step.title}</h4>
                          )}
                          {step.contentBeforeImage && (
                            <div
                              className={styles.step_text}
                              dangerouslySetInnerHTML={{
                                __html: step.contentBeforeImage,
                              }}
                            />
                          )}
                          {step.image && (
                            <div className={styles.step_image}>
                              <img
                                src={
                                  step.image.startsWith("http")
                                    ? step.image
                                    : getImageUrl(step.image)
                                }
                                alt={`Step ${step.number}`}
                              />
                            </div>
                          )}
                          {step.contentAfterImage && (
                            <div
                              className={styles.step_text}
                              dangerouslySetInnerHTML={{
                                __html: step.contentAfterImage,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.direction_step}>
                      <input type="radio" name="directions" id="direction-1" />
                      <div className={styles.step_content}>
                        <div
                          className={styles.step_text}
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

            <div className={styles.recipe_sidebar}>
              <div className={styles.nutrition}>
                <h3>Nutrition Information</h3>
                <div className={styles.nutrition_list}>
                  {recipe.calories !== undefined &&
                    recipe.calories !== null && (
                      <div className={styles.nutrition_item}>
                        <span>Calories</span>
                        <span>{recipe.calories.toFixed(1)} kcal</span>
                      </div>
                    )}
                  {recipe.totalFat !== undefined &&
                    recipe.totalFat !== null && (
                      <div className={styles.nutrition_item}>
                        <span>Total Fat</span>
                        <span>{recipe.totalFat.toFixed(1)} g</span>
                      </div>
                    )}
                  {recipe.protein !== undefined && recipe.protein !== null && (
                    <div className={styles.nutrition_item}>
                      <span>Protein</span>
                      <span>{recipe.protein.toFixed(1)} g</span>
                    </div>
                  )}
                  {recipe.carbohydrates !== undefined &&
                    recipe.carbohydrates !== null && (
                      <div className={styles.nutrition_item}>
                        <span>Carbohydrates</span>
                        <span>{recipe.carbohydrates.toFixed(1)} g</span>
                      </div>
                    )}
                  {recipe.cholesterol !== undefined &&
                    recipe.cholesterol !== null && (
                      <div className={styles.nutrition_item}>
                        <span>Cholesterol</span>
                        <span>{recipe.cholesterol.toFixed(1)} mg</span>
                      </div>
                    )}
                  {/* Если нет nutrition данных, показываем сообщение */}
                  {!recipe.calories &&
                    !recipe.totalFat &&
                    !recipe.protein &&
                    !recipe.carbohydrates &&
                    !recipe.cholesterol && (
                      <div className={styles.nutrition_item}>
                        <span style={{ fontStyle: "italic", color: "#999" }}>
                          Nutrition information not available
                        </span>
                      </div>
                    )}
                </div>
                <p className={styles.nutrition_note}>
                  adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua.
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
                      <Card
                        name={r.title}
                        imageSrc={
                          r.photoUrl ? getImageUrl(r.photoUrl) : undefined
                        }
                        cookingTime={
                          r.cookTime
                            ? r.cookTime.toString()
                            : r.cookingTime
                            ? r.cookingTime.toString()
                            : "30"
                        }
                        foodType={r.categoryDtos?.[0]?.name || "General"}
                      />
                    </Link>
                  ))}
                </div>
              </div>
              <AdSection />
            </div>
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
