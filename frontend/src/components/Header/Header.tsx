import { Facebook, Instagram, Twitter } from "../../iconComponents";
import styles from "./Header.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getImageUrl } from "../../api/filesApi";
import Button from "../Button/Button";

const Header = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header>
      <div className={`${styles.header_container} container`}>
        <Link to="/" className={styles.logo}>
          Foodieland
        </Link>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/recipes">Recipes</Link>
            </li>
            <li>
              <Link to="/blog">Blog</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/about-us">About us</Link>
            </li>
          </ul>
        </nav>
        <div className={styles.rightSection}>
          {!loading && (
            <>
              {user ? (
                <div className={styles.userMenu}>
                  <Link to="/profile" className={styles.userInfo}>
                    {user.photoUrl && (
                      <img
                        src={getImageUrl(user.photoUrl)}
                        alt={user.username}
                        className={styles.avatar}
                      />
                    )}
                    <span className={styles.username}>{user.username}</span>
                  </Link>
                  {/* TODO: Uncomment when admin panel is ready
                  {(user.role === "ADMIN" || user.role === "MODERATOR") && (
                    <Link to="/admin" className={styles.adminLink}>
                      Admin
                    </Link>
                  )}
                  */}
                  <button onClick={handleLogout} className={styles.logoutBtn}>
                    Logout
                  </button>
                </div>
              ) : (
                <div className={styles.authButtons}>
                  <Link to="/login" className={styles.loginBtn}>
                    Login
                  </Link>
                  <Link to="/signup">
                    <Button as="button" value="Sign up">
                      Sign up
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
          <div className={styles.socials}>
            <Facebook />
            <Twitter />
            <Instagram />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
