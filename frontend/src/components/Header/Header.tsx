import { Facebook, Instagram, Twitter } from '../../iconComponents';
import HomePage from '../../pages/HomePage/HomePage';
import styles from './Header.module.scss';  
import { Link } from 'react-router-dom';
const Header = () => {
    return <header>
        <div className={`${styles.header_container} container`}>
            <span className={styles.logo}>Foodieland</span>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/recipes">Recipes</Link></li>
                    <li><Link to="/blog">Blog</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    <li><Link to="/about-us">About us</Link></li>
                </ul>
            </nav>
            <div className={styles.socials}>
                <Facebook />
                <Twitter />
                <Instagram />
            </div>
        </div>
    </header>
}

export default Header