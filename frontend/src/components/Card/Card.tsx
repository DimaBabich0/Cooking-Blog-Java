import { ForkKnife, Timer } from '../../iconComponents';
import styles from './Card.module.scss';

type Props = {
    cookingTime?: string;
    foodType?: string;
    name?: string;
    imageSrc?: string;
}


const Card = ({cookingTime, foodType, name, imageSrc} : Props) => {
    return (
        <div className={styles.card}>
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