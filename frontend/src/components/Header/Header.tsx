import { useState } from "react";
import { Facebook, Instagram, Twitter, Menu, Close } from "../../iconComponents";
import styles from "./Header.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getImageUrl } from "../../api/filesApi";
import Button from "../Button/Button";

const Header = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header>
      <div className={`${styles.header_container} container`}>
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          Foodieland
        </Link>
        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}>
          <ul>
            <li>
              <Link to="/" onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/recipes" onClick={closeMenu}>
                Recipes
              </Link>
            </li>
            <li>
              <Link to="/blog" onClick={closeMenu}>
                Blog
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={closeMenu}>
                Contact
              </Link>
            </li>
            <li>
              <Link to="/about-us" onClick={closeMenu}>
                About us
              </Link>
            </li>
          </ul>
          <div className={styles.mobileUserSection}>
            {!loading && (
              <>
                {user ? (
                  <div className={styles.mobileUserMenu}>
                    <Link to="/profile" className={styles.mobileUserInfo} onClick={closeMenu}>
                      {user.photoUrl && (
                        <img
                          src={getImageUrl(user.photoUrl)}
                          alt={user.username}
                          className={styles.mobileAvatar}
                        />
                      )}
                      <span className={styles.mobileUsername}>{user.username}</span>
                    </Link>
                    {(user.role === "ADMIN" || user.role === "MODERATOR") && (
                      <Link to="/admin" className={styles.mobileAdminLink} onClick={closeMenu}>
                        Admin
                      </Link>
                    )}
                    <button onClick={handleLogout} className={styles.mobileLogoutBtn}>
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className={styles.mobileAuthButtons}>
                    <Link to="/login" className={styles.mobileLoginBtn} onClick={closeMenu}>
                      Login
                    </Link>
                    <Link to="/signup" onClick={closeMenu}>
                      <Button as="button" value="Sign up">
                        Sign up
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </nav>
        <div className={styles.rightSection}>
          {!loading && (
            <>
              {user ? (
                <div className={styles.userMenu}>
                  <Link to="/profile" className={styles.userInfo} onClick={closeMenu}>
                    {user.photoUrl && (
                      <img
                        src={getImageUrl(user.photoUrl)}
                        alt={user.username}
                        className={styles.avatar}
                      />
                    )}
                    <span className={styles.username}>{user.username}</span>
                  </Link>
                  {(user.role === "ADMIN" || user.role === "MODERATOR") && (
                    <Link to="/admin" className={styles.adminLink} onClick={closeMenu}>
                      Admin
                    </Link>
                  )}
                  <button onClick={handleLogout} className={styles.logoutBtn}>
                    Logout
                  </button>
                </div>
              ) : (
                <div className={styles.authButtons}>
                  <Link to="/login" className={styles.loginBtn} onClick={closeMenu}>
                    Login
                  </Link>
                  <Link to="/signup" onClick={closeMenu}>
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
        <button
          className={styles.burgerButton}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <Close /> : <Menu />}
        </button>
      </div>
      <div
        className={`${styles.overlay} ${isMenuOpen ? styles.overlayVisible : ""}`}
        onClick={closeMenu}
      />
    </header>
  );
};

export default Header;
