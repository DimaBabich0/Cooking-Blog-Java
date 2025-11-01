import { ForkKnife, Timer, Heart } from '../../iconComponents';
import styles from './Card.module.scss';

type Props = {
    cookingTime?: string;
    foodType?: string;
    name?: string;
    imageSrc?: string;
    withBlueBg?: boolean;
}


const Card = ({cookingTime, foodType, name, imageSrc, withBlueBg = false} : Props) => {
    return (
        <div className={`${styles.card} ${withBlueBg ? styles.blue_bg : ''}`}>
            <div className={`${styles.heart} ${styles.liked}`}>
                <Heart />
            </div>
            <img src={`${imageSrc}`} alt="" />
            <div className={styles.card_info}>
                <h4>{name}</h4>
                <div className={styles.card_details}>
                    <div>
                        <Timer />
                        <span>{cookingTime} mins</span>
                    </div>
                    <div>
                        <ForkKnife />
                        <span>{foodType}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;