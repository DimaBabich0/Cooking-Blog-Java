import { useState, useEffect } from 'react';
import { ForkKnife, Timer, Heart } from '../../iconComponents';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Card.module.scss';

type Props = {
    recipeId?: number;
    cookingTime?: string;
    foodType?: string;
    name?: string;
    imageSrc?: string;
    withBlueBg?: boolean;
}

const BOOKMARKS_KEY = 'recipe_bookmarks';

const Card = ({recipeId, cookingTime, foodType, name, imageSrc, withBlueBg = false} : Props) => {
    const { user } = useAuth();
    const [isInBookmarks, setIsInBookmarks] = useState(false);

    useEffect(() => {
        if (user && recipeId) {
            const bookmarks = getBookmarks();
            setIsInBookmarks(bookmarks.includes(recipeId));
        }
    }, [user, recipeId]);

    const getBookmarks = (): number[] => {
        const stored = localStorage.getItem(BOOKMARKS_KEY);
        return stored ? JSON.parse(stored) : [];
    };

    const toggleBookmark = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!user || !recipeId) return;

        const bookmarks = getBookmarks();
        const index = bookmarks.indexOf(recipeId);
        
        if (index > -1) {
            bookmarks.splice(index, 1);
        } else {
            bookmarks.push(recipeId);
        }
        
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
        setIsInBookmarks(!isInBookmarks);
    };

    const showHeart = user !== null && user !== undefined;
    const heartClass = isInBookmarks ? styles.liked : '';

    return (
        <div className={`${styles.card} ${withBlueBg ? styles.blue_bg : ''}`}>
            {showHeart && (
                <div 
                    className={`${styles.heart} ${heartClass}`}
                    onClick={toggleBookmark}
                    style={{ cursor: 'pointer' }}
                >
                    <Heart />
                </div>
            )}
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