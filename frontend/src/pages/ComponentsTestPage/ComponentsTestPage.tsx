import { useState } from "react";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import PostCard from "../../components/PostCard/PostCard";
import RecipesSlider from "../../components/RecipesSlider/RecipesSlider";
import Subscription from "../../components/Subscribtion/Subscription";
import AdSection from "../../components/AdSection/AdSection";
import styles from "./ComponentsTestPage.module.scss";
import meal1 from "../../assets/meal1.jpg";
import postCardImg from "../../assets/postCardImg.png";
import authorImg from "../../assets/author.png";
import image01 from "../../assets/01.png";
import image1 from "../../assets/1.png";

export default function ComponentsTestPage() {
  const [buttonClicked, setButtonClicked] = useState("");

  // Test data for RecipesSlider
  const testRecipes = [
    {
      id: 1,
      title: "Recipe 1",
      description: "Test recipe description",
      image: meal1,
      author: "Chef 1",
      date: "2024-01-01",
      cookingTime: "30",
      foodType: "Breakfast",
    },
    {
      id: 2,
      title: "Recipe 2",
      description: "Test recipe description",
      image: image01,
      author: "Chef 2",
      date: "2024-01-02",
      cookingTime: "45",
      foodType: "Lunch",
    },
    {
      id: 3,
      title: "Recipe 3",
      description: "Test recipe description",
      image: image1,
      author: "Chef 3",
      date: "2024-01-03",
      cookingTime: "60",
      foodType: "Dinner",
    },
  ];

  return (
    <div className={styles.testPage}>
      <div className="container">
        <h1 className={styles.pageTitle}>Components and Their Variations</h1>

        {/* BUTTON COMPONENT */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Button Component</h2>

          <div className={styles.componentGroup}>
            <h3 className={styles.componentTitle}>Button - Primary (default)</h3>
            <Button onClick={() => setButtonClicked("Primary button clicked")}>
              Primary Button
            </Button>
            {buttonClicked && <p className={styles.feedback}>{buttonClicked}</p>}
          </div>

          <div className={styles.componentGroup}>
            <h3 className={styles.componentTitle}>Button - Secondary</h3>
            <Button variant="secondary" onClick={() => setButtonClicked("Secondary button clicked")}>
              Secondary Button
            </Button>
          </div>

          <div className={styles.componentGroup}>
            <h3 className={styles.componentTitle}>Button - Primary with icon on left</h3>
            <Button showIcon iconPosition="left" onClick={() => setButtonClicked("Button with left icon clicked")}>
              Button with Icon Left
            </Button>
          </div>

          <div className={styles.componentGroup}>
            <h3 className={styles.componentTitle}>Button - Primary with icon on right</h3>
            <Button showIcon iconPosition="right" onClick={() => setButtonClicked("Button with right icon clicked")}>
              Button with Icon Right
            </Button>
          </div>

          <div className={styles.componentGroup}>
            <h3 className={styles.componentTitle}>Button - Secondary with icon</h3>
            <Button variant="secondary" showIcon iconPosition="left">
              Secondary with Icon
            </Button>
          </div>

          <div className={styles.componentGroup}>
            <h3 className={styles.componentTitle}>Button - Disabled</h3>
            <Button disabled>Disabled Button</Button>
          </div>

          <div className={styles.componentGroup}>
            <h3 className={styles.componentTitle}>Button - as link (as="a")</h3>
            <Button as="a" href="/" variant="primary">
              Button as Link
            </Button>
          </div>

          <div className={styles.componentGroup}>
            <h3 className={styles.componentTitle}>Button - as input (as="input")</h3>
            <Button as="input" value="Submit Input" inputType="submit" variant="primary" />
          </div>

          <div className={styles.componentGroup}>
            <h3 className={styles.componentTitle}>Button - как input submit</h3>
            <form onSubmit={(e) => { e.preventDefault(); setButtonClicked("Form submitted"); }}>
              <Button as="input" value="Submit Form" inputType="submit" variant="primary" />
            </form>
          </div>
        </section>

        {/* CARD COMPONENT */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Card Component</h2>

          <div className={styles.componentGroup}>
            <h3 className={styles.componentTitle}>Card - Regular</h3>
            <div className={styles.cardWrapper}>
              <Card
                name="Recipe Name"
                imageSrc={meal1}
                cookingTime="30"
                foodType="Breakfast"
              />
            </div>
          </div>

          <div className={styles.componentGroup}>
            <h3 className={styles.componentTitle}>Card - With blue background (withBlueBg)</h3>
            <div className={styles.cardWrapper}>
              <Card
                name="Recipe with Blue BG"
                imageSrc={image01}
                cookingTime="45"
                foodType="Lunch"
                withBlueBg={true}
              />
            </div>
          </div>

          <div className={styles.componentGroup}>
            <h3 className={styles.componentTitle}>Card - Without image</h3>
            <div className={styles.cardWrapper}>
              <Card
                name="Recipe without Image"
                cookingTime="60"
                foodType="Dinner"
              />
            </div>
          </div>
        </section>

        {/* POSTCARD COMPONENT */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>PostCard Component</h2>

          <div className={styles.componentGroup}>
            <h3 className={styles.componentTitle}>PostCard - Regular (full)</h3>
            <div className={styles.postCardWrapper}>
              <PostCard
                title="Blog Post Title"
                description="This is a full post card with all information including author, date, and image."
                author="John Doe"
                authorImgSrc={authorImg}
                date="January 15, 2024"
                imageSrc={postCardImg}
              />
            </div>
          </div>

          <div className={styles.componentGroup}>
            <h3 className={styles.componentTitle}>PostCard - Small version</h3>
            <div className={styles.postCardWrapper}>
              <PostCard
                title="Small Post Card"
                description="This is a small version of the post card."
                author="Jane Smith"
                authorImgSrc={authorImg}
                date="January 16, 2024"
                imageSrc={postCardImg}
                small={true}
              />
            </div>
          </div>

          <div className={styles.componentGroup}>
            <h3 className={styles.componentTitle}>PostCard - Without image</h3>
            <div className={styles.postCardWrapper}>
              <PostCard
                title="Post Without Image"
                description="This post card doesn't have an image, so it shows a placeholder."
                author="Bob Johnson"
                authorImgSrc={authorImg}
                date="January 17, 2024"
              />
            </div>
          </div>

          <div className={styles.componentGroup}>
            <h3 className={styles.componentTitle}>PostCard - Minimal data</h3>
            <div className={styles.postCardWrapper}>
              <PostCard
                description="Post card with only description (required field)."
              />
            </div>
          </div>
        </section>

        {/* RECIPES SLIDER COMPONENT */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>RecipesSlider Component</h2>

          <div className={styles.componentGroup}>
            <h3 className={styles.componentTitle}>RecipesSlider - With autoplay (default)</h3>
            <RecipesSlider recipes={testRecipes} slidesPerView={3} autoplay={true} loop={true} />
          </div>

          <div className={styles.componentGroup}>
            <h3 className={styles.componentTitle}>RecipesSlider - Without autoplay</h3>
            <RecipesSlider recipes={testRecipes} slidesPerView={3} autoplay={false} loop={true} />
          </div>

          <div className={styles.componentGroup}>
            <h3 className={styles.componentTitle}>RecipesSlider - 2 slides on screen</h3>
            <RecipesSlider recipes={testRecipes} slidesPerView={2} autoplay={true} loop={true} />
          </div>

          <div className={styles.componentGroup}>
            <h3 className={styles.componentTitle}>RecipesSlider - 1 slide on screen</h3>
            <RecipesSlider recipes={testRecipes} slidesPerView={1} autoplay={true} loop={true} />
          </div>
        </section>

        {/* SUBSCRIPTION COMPONENT */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Subscription Component</h2>
          <div className={styles.componentGroup}>
            <h3 className={styles.componentTitle}>Subscription - Subscription form</h3>
            <Subscription />
          </div>
        </section>

        {/* AD SECTION COMPONENT */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>AdSection Component</h2>
          <div className={styles.componentGroup}>
            <h3 className={styles.componentTitle}>AdSection - Advertisement block</h3>
            <AdSection />
          </div>
        </section>
      </div>
    </div>
  );
}
