import { Facebook, Instagram, Twitter } from '../../iconComponents';
import styles from './Footer.module.scss';
import { Link } from 'react-router-dom';
const Footer = () => {
    return <footer>
        <div className={`${styles.footer_container} container`}>
            <div className={styles.footer_top}>
                <div className={styles.menu}>
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
                </div>
                <div>
                    <p>Lorem ipsum dolor sit amet, consectetuipisicing elit, </p>
                </div>
            </div>
            <hr />
            <div className={styles.footer_bottom}>
                {/* empty block for flexempty block for flex */}
                <div></div>
                <p>© 2020 Flowbase. Powered by <span>Me</span></p>
                <div className={styles.socials}>
                    <Facebook />
                    <Twitter />
                    <Instagram />
                </div>
            </div>

        </div>
    </footer>
}

export default Footer