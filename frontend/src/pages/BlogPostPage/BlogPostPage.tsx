import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlog, BlogDto } from "../../api/blogApi";
import { getRecipes, RecipeDto } from "../../api/recipeApi";
import { getImageUrl } from "../../api/filesApi";
import { Facebook, Twitter, Instagram, Share } from "../../iconComponents";
import Subscription from "../../components/Subscribtion/Subscription";
import RecipesSlider from "../../components/RecipesSlider/RecipesSlider";
import styles from "./BlogPostPage.module.scss";

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogDto | null>(null);
  const [relatedRecipes, setRelatedRecipes] = useState<RecipeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Blog ID is missing");
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        if (!id) return;
        const [blogData, recipesData] = await Promise.all([
          getBlog(id),
          getRecipes(),
        ]);
        setBlog(blogData);
        setRelatedRecipes(recipesData.slice(0, 12));
      } catch (err) {
        setError("Failed to load blog post");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <section className={styles.blogPost}>
        <div className="container">
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  if (error || !blog) {
    return (
      <section className={styles.blogPost}>
        <div className="container">
          <p>{error || "Blog post not found"}</p>
        </div>
      </section>
    );
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
    blog.userDto.firstName && blog.userDto.lastName
      ? `${blog.userDto.firstName} ${blog.userDto.lastName}`
      : blog.userDto.username;

  const authorPhotoUrl = blog.userDto.photoUrl
    ? getImageUrl(blog.userDto.photoUrl)
    : undefined;

  const blogImageUrl = blog.photoUrl ? getImageUrl(blog.photoUrl) : undefined;

  return (
    <>
      <section className={styles.blogPost}>
        <div className="container">
          <div className={styles.main_content}>
            <h1 className={styles.title}>{blog.title}</h1>

            <div className={styles.meta}>
              <div className={styles.author}>
                {authorPhotoUrl && (
                  <img
                    src={authorPhotoUrl}
                    alt={authorName}
                    className={styles.author_avatar}
                  />
                )}
                <span className={styles.author_name}>{authorName}</span>
              </div>
              <span className={styles.date}>{formatDate(blog.createdAt)}</span>
            </div>

            <p className={styles.intro}>{blog.description}</p>

            {blogImageUrl && (
              <div className={styles.hero_image}>
                <img src={blogImageUrl} alt={blog.title} />
              </div>
            )}

            <div className={styles.content_wrapper}>
              <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: blog.text }}
              />

              <div className={styles.share_section}>
                <h3>SHARE THIS ON</h3>
                <div className={styles.social_icons}>
                  <a href="#" aria-label="Share on Facebook">
                    <Facebook />
                  </a>
                  <a href="#" aria-label="Share on Twitter">
                    <Twitter />
                  </a>
                  <a href="#" aria-label="Share on Instagram">
                    <Instagram />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Subscription />

      {relatedRecipes.length > 0 && (
        <section className={styles.related_recipes}>
          <div className="container">
            <h2>Check out the delicious recipe</h2>
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
