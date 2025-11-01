
import styles from './PostCard.module.scss';
type Props = {
    small?: boolean;
    author?: string;
    authorImgSrc?: string;
    date?: string;
    title?: string;
    description: string;
    imageSrc?: string;
}
const PostCard = ({author, authorImgSrc, date, title, description, imageSrc, small} : Props ) => {
    return (
        <div className={`${styles.post_card}  ${small ? styles.small_post_card : ''}`}>
            <img className={styles.post_card_image} src={imageSrc} alt="" />
            <div className={styles.post_card_info}>
                <h4>{title}</h4>
                <p className={styles.description}>{description}</p>
                <div className={styles.bottom}>
                    <div className={styles.author}>
                        <img src={authorImgSrc} alt="" />
                        <p>{author}</p>
                    </div>
                    <div className={styles.separator}></div>
                    <p>{date}</p>
                </div>
                <div className={styles.small_card_bottom}>
                    By {author}
                </div>
            </div>
        </div>
    );
};

export default PostCard;