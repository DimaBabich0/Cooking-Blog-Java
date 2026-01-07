import React, { useState, useEffect } from "react";
import Button from "../../components/Button/Button";
import styles from "./ContactPage.module.scss";
import chef from "../../assets/Group 13936.png";
import Subscription from "../../components/Subscribtion/Subscription";
import RecipesSlider from "../../components/RecipesSlider/RecipesSlider";
import { getRecipes, RecipeDto } from "../../api/recipeApi";
import { getImageUrl } from "../../api/filesApi";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    enquiryType: "Advertising",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [relatedRecipes, setRelatedRecipes] = useState<RecipeDto[]>([]);

  useEffect(() => {
    async function loadRecipes() {
      try {
        const recipes = await getRecipes();
        setRelatedRecipes(recipes); // Берем все рецепты для слайдера
      } catch (err) {
        console.error("Error loading recipes:", err);
      }
    }
    loadRecipes();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // TODO: Implement actual form submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess("Message sent! We will contact you soon.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        enquiryType: "Advertising",
        message: "",
      });
    } catch (err) {
      setError("Error sending message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className={styles.contact}>
        <div className="container">
          <h1 className={styles.title}>Contact us</h1>

          <div className={styles.contact_content}>
            <div className={styles.contact_image_wrapper}>
              <img className={styles.contact_image} src={chef} alt="chef" />
            </div>

            <div className={styles.contact_form_wrapper}>
              {error && <div className={styles.error}>{error}</div>}
              {success && <div className={styles.success}>{success}</div>}

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.form_row}>
                  <div className={styles.field}>
                    <label htmlFor="name">NAME</label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Enter your name..."
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="email">EMAIL ADDRESS</label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="Your email address..."
                      required
                    />
                  </div>
                </div>

                <div className={styles.form_row}>
                  <div className={styles.field}>
                    <label htmlFor="subject">SUBJECT</label>
                    <input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleChange("subject", e.target.value)}
                      placeholder="Enter subject..."
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="enquiryType">ENQUIRY TYPE</label>
                    <select
                      id="enquiryType"
                      value={formData.enquiryType}
                      onChange={(e) =>
                        handleChange("enquiryType", e.target.value)
                      }
                      className={styles.select}
                    >
                      <option value="Advertising">Advertising</option>
                      <option value="General">General</option>
                      <option value="Support">Support</option>
                      <option value="Partnership">Partnership</option>
                    </select>
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="message">MESSAGES</label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    placeholder="Enter your messages..."
                    rows={6}
                    required
                  />
                </div>

                <div className={styles.submit_wrapper}>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Submit"}
                  </Button>
                </div>
              </form>
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
