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

const WISHLIST_KEY = 'recipe_wishlist';

const Card = ({recipeId, cookingTime, foodType, name, imageSrc, withBlueBg = false} : Props) => {
    const { user } = useAuth();
    const [isInWishlist, setIsInWishlist] = useState(false);

    useEffect(() => {
        if (user && recipeId) {
            const wishlist = getWishlist();
            setIsInWishlist(wishlist.includes(recipeId));
        }
    }, [user, recipeId]);

    const getWishlist = (): number[] => {
        const stored = localStorage.getItem(WISHLIST_KEY);
        return stored ? JSON.parse(stored) : [];
    };

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!user || !recipeId) return;

        const wishlist = getWishlist();
        const index = wishlist.indexOf(recipeId);
        
        if (index > -1) {
            wishlist.splice(index, 1);
        } else {
            wishlist.push(recipeId);
        }
        
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
        setIsInWishlist(!isInWishlist);
    };

    const showHeart = user !== null && user !== undefined;
    const heartClass = isInWishlist ? styles.liked : '';

    return (
        <div className={`${styles.card} ${withBlueBg ? styles.blue_bg : ''}`}>
            {showHeart && (
                <div 
                    className={`${styles.heart} ${heartClass}`}
                    onClick={toggleWishlist}
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