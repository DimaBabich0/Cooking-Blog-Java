import { ForkKnife, Timer, Heart } from "../../iconComponents";
import styles from "./Subscription.module.scss";
import subscribePhotoLeft from "../../assets/subscribePhotoLeft(cropped).png";
import subscribePhotoRight from "../../assets/subscribePhotoRight(cropped).png";
import Button from "../Button/Button";

const Subscription = () => {
  return (
    <div className="container">
      <div className={styles.subscription_block}>
        <div className={styles.inner}>
          <h2>Deliciousness to your inbox</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetuipisicing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqut enim ad minim{" "}
          </p>
          <form action="">
            <input type="email" placeholder="Your email address..." />
            <Button
              as="input"
              value="Subscribe"
              inputType="submit"
              variant="primary"
            />
          </form>
          <img className={styles.imageLeft} src={subscribePhotoLeft} alt="" />
          <img className={styles.imageRight} src={subscribePhotoRight} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Subscription;
