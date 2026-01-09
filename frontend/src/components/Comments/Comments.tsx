import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  getCommentsByRecipe,
  getCommentsByBlog,
  createComment,
  deleteComment,
  CommentDto,
} from "../../api/commentApi";
import { getImageUrl } from "../../api/filesApi";
import Button from "../Button/Button";
import styles from "./Comments.module.scss";

type CommentsProps = {
  recipeId?: number;
  blogId?: number;
};

export default function Comments({ recipeId, blogId }: CommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [recipeId, blogId]);

  async function loadComments() {
    try {
      setLoading(true);
      if (recipeId) {
        const data = await getCommentsByRecipe(recipeId);
        setComments(data.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      } else if (blogId) {
        const data = await getCommentsByBlog(blogId);
        setComments(data.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      }
    } catch (err) {
      console.error("Error loading comments:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      setSubmitting(true);
      await createComment({
        text: newComment.trim(),
        recipeId,
        blogId,
        userDto: {
          id: user.id,
          username: user.username,
        },
      });
      setNewComment("");
      await loadComments();
    } catch (err) {
      console.error("Error creating comment:", err);
      alert("Error creating comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(commentId: number) {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await deleteComment(commentId);
      await loadComments();
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Error deleting comment. Please try again.");
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className={styles.comments}>Loading comments...</div>;
  }

  return (
    <div className={styles.comments}>
      <h3 className={styles.title}>Comments ({comments.length})</h3>

      {user ? (
        <form onSubmit={handleSubmit} className={styles.comment_form}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            className={styles.comment_input}
            rows={4}
            required
          />
          <Button
            as="button"
            type="submit"
            variant="primary"
            disabled={submitting || !newComment.trim()}
          >
            {submitting ? "Posting..." : "Post Comment"}
          </Button>
        </form>
      ) : (
        <p className={styles.login_prompt}>
          Please <a href="/login">login</a> to leave a comment.
        </p>
      )}

      <div className={styles.comments_list}>
        {comments.length === 0 ? (
          <p className={styles.no_comments}>No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className={styles.comment_item}>
              <div className={styles.comment_header}>
                <div className={styles.comment_author}>
                  {comment.userDto?.photoUrl && (
                    <img
                      src={getImageUrl(comment.userDto.photoUrl)}
                      alt={comment.userDto.username}
                      className={styles.author_avatar}
                    />
                  )}
                  <div className={styles.author_info}>
                    <span className={styles.author_name}>
                      {comment.userDto?.username || "Unknown"}
                    </span>
                    <span className={styles.comment_date}>
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                </div>
                {user && user.id === comment.userDto?.id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className={styles.delete_btn}
                    title="Delete comment"
                  >
                    ×
                  </button>
                )}
              </div>
              <p className={styles.comment_text}>{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
