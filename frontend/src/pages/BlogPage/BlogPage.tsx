import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBlogs, BlogDto } from "../../api/blogApi";
import { getRecipes, RecipeDto } from "../../api/recipeApi";
import { getImageUrl } from "../../api/filesApi";
import { useAuth } from "../../contexts/AuthContext";
import PostCard from "../../components/PostCard/PostCard";
import Button from "../../components/Button/Button";
import styles from "./BlogPage.module.scss";
import Subscription from "../../components/Subscribtion/Subscription";
import adImage from "../../assets/1.png";
import maskGroup from "../../assets/Mask Group.svg";

const POSTS_PER_PAGE = 6;

export default function BlogPage() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<BlogDto[]>([]);
  const [recipes, setRecipes] = useState<RecipeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [blogsData, recipesData] = await Promise.all([
        getBlogs(),
        getRecipes(),
      ]);
      setBlogs(blogsData);
      setRecipes(recipesData.slice(0, 3)); // Для sidebar
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки данных");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Сбрасываем страницу при изменении поискового запроса
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Вычисляем пагинацию
  const totalPages = Math.ceil(filteredBlogs.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentBlogs = filteredBlogs.slice(startIndex, endIndex);

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

  return (
    <>
      {/* Header Section */}
      <section className={styles.list_header}>
        <div className="container">
          <div className={styles.section_title}>
            <h1>Blog & Article</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetuipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqut enim ad
              minim
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className={styles.list_search}>
        <div className="container">
          <div className={styles.search}>
            <input
              type="text"
              placeholder="Search blog posts"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.search_input}
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
      <section className={styles.list_content}>
        <div className="container">
          <div className={styles.content}>
            {/* Main Content - Blog Posts */}
            <div className={styles.list_main}>
              {error && <div className={styles.error}>{error}</div>}

              {loading ? (
                <p>Загрузка...</p>
              ) : filteredBlogs.length === 0 ? (
                <p>Посты не найдены</p>
              ) : (
                <>
                  {currentBlogs.map((blog) => (
                    <Link
                      key={blog.id}
                      to={`/blog/${blog.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <PostCard
                        title={blog.title}
                        description={blog.description}
                        author={blog.userDto?.username || "Неизвестно"}
                        authorImgSrc={
                          blog.userDto?.photoUrl
                            ? getImageUrl(blog.userDto.photoUrl)
                            : undefined
                        }
                        date={
                          blog.createdAt
                            ? new Date(blog.createdAt).toLocaleDateString(
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
                          blog.photoUrl ? getImageUrl(blog.photoUrl) : undefined
                        }
                      />
                    </Link>
                  ))}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className={styles.list_pagination}>
                      {getPageNumbers().map((page, index) => {
                        if (page === "...") {
                          return (
                            <span
                              key={`ellipsis-${index}`}
                              className={styles.ellipsis}
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
                                ? `${styles.pagination_btn} ${styles.active}`
                                : styles.pagination_btn
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
            <div className={styles.list_sidebar}>
              <div className={styles.sidebar_section}>
                <h3>Tasty Recipes</h3>
                <div className={styles.sidebar_list}>
                  {recipes.map((recipe) => (
                    <Link
                      key={recipe.id}
                      to={`/recipes/${recipe.id}`}
                      className={styles.sidebar_item}
                    >
                      <PostCard
                        small={true}
                        title={recipe.title}
                        description={recipe.description}
                        imageSrc={
                          recipe.photoUrl
                            ? getImageUrl(recipe.photoUrl)
                            : undefined
                        }
                      />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Ad Section */}
              <div className={styles.ad_section}>
                <div className={styles.ad_image}>
                  <h3 className={styles.ad_title}>
                    Don't forget to eat healthy food
                  </h3>
                  <img src={maskGroup} alt="" className={styles.ad_bg} />
                  <img
                    src={adImage}
                    alt="Healthy food"
                    className={styles.ad_main_image}
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
