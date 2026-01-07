import styles from "./AdSection.module.scss";
import adImage from "../../assets/1.png";
import maskGroup from "../../assets/Mask Group.svg";

export default function AdSection() {
  return (
    <div className={styles.ad_section}>
      <div className={styles.ad_image}>
        <h3 className={styles.ad_title}>Don't forget to eat healthy food</h3>
        <img src={maskGroup} alt="" className={styles.ad_bg} />
        <img
          src={adImage}
          alt="Healthy food"
          className={styles.ad_main_image}
        />
        <p>www.foodieland.com</p>
      </div>
    </div>
  );
}
