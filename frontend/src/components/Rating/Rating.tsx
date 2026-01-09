import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  getRatingsByRecipe,
  getRatingsByBlog,
  getUserRatingForRecipe,
  getUserRatingForBlog,
  createRating,
  updateRating,
  getAverageRatingByRecipe,
  getAverageRatingByBlog,
  RatingDto,
} from "../../api/ratingApi";
import styles from "./Rating.module.scss";

type RatingProps = {
  recipeId?: number;
  blogId?: number;
  onRatingChange?: (averageRating: number, totalRatings: number) => void;
};

export default function Rating({
  recipeId,
  blogId,
  onRatingChange,
}: RatingProps) {
  const { user } = useAuth();
  const [userRating, setUserRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [existingRatingId, setExistingRatingId] = useState<number | null>(null);

  useEffect(() => {
    loadRatings();
  }, [recipeId, blogId, user]);

  async function loadRatings() {
    try {
      setLoading(true);
      if (recipeId) {
        const [ratings, avg, userRatingData] = await Promise.all([
          getRatingsByRecipe(recipeId),
          getAverageRatingByRecipe(recipeId),
          user
            ? getUserRatingForRecipe(user.id, recipeId)
            : Promise.resolve(null),
        ]);
        setAverageRating(avg);
        setTotalRatings(ratings.length);
        if (userRatingData) {
          setUserRating(userRatingData.rating);
          setExistingRatingId(userRatingData.id);
        } else {
          setUserRating(null);
          setExistingRatingId(null);
        }
        if (onRatingChange) {
          onRatingChange(avg, ratings.length);
        }
      } else if (blogId) {
        const [ratings, avg, userRatingData] = await Promise.all([
          getRatingsByBlog(blogId),
          getAverageRatingByBlog(blogId),
          user ? getUserRatingForBlog(user.id, blogId) : Promise.resolve(null),
        ]);
        setAverageRating(avg);
        setTotalRatings(ratings.length);
        if (userRatingData) {
          setUserRating(userRatingData.rating);
          setExistingRatingId(userRatingData.id);
        } else {
          setUserRating(null);
          setExistingRatingId(null);
        }
        if (onRatingChange) {
          onRatingChange(avg, ratings.length);
        }
      }
    } catch (err) {
      console.error("Error loading ratings:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStarClick(rating: number) {
    if (!user) {
      alert("Please login to rate");
      return;
    }

    try {
      if (existingRatingId) {
        await updateRating(existingRatingId, {
          rating,
          userId: user.id,
          recipeId,
          blogId,
        });
      } else {
        await createRating({
          rating,
          userId: user.id,
          recipeId,
          blogId,
        });
      }
      await loadRatings();
    } catch (err) {
      console.error("Error saving rating:", err);
      alert("Error saving rating. Please try again.");
    }
  }

  const displayRating = hoveredStar !== null ? hoveredStar : (userRating !== null ? userRating : Math.round(averageRating));
  const stars = [1, 2, 3, 4, 5];

  if (loading) {
    return <div className={styles.rating}>Loading...</div>;
  }

  return (
    <div className={styles.rating}>
      <div className={styles.stars}>
        {stars.map((star) => (
          <button
            key={star}
            type="button"
            className={`${styles.star} ${
              star <= displayRating ? styles.filled : ""
            }`}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(null)}
            disabled={!user}
            title={user ? `Rate ${star} star${star > 1 ? "s" : ""}` : "Login to rate"}
          >
            ★
          </button>
        ))}
      </div>
      {(averageRating > 0 || totalRatings > 0) && (
        <div className={styles.rating_info}>
          <span className={styles.average}>
            {averageRating > 0 ? averageRating.toFixed(1) : "0.0"}
          </span>
          <span className={styles.count}>({totalRatings})</span>
        </div>
      )}
    </div>
  );
}
