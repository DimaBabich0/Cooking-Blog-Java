<%@ page import="jakarta.servlet.http.Cookie" %>
<%
	String username = null;
	Cookie[] cookies = request.getCookies();
	if (cookies != null) {
	  for (Cookie c : cookies) {
	    if (c.getName().equals("user")) {
	      username = c.getValue();
	      break;
	    }
	  }
	}
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Foodieland</title>
  <link rel="stylesheet" href="css/styles.css" />
</head>
<body>
  <!-- HEADER -->
  <header class="header">
    <div class="logo">Foodieland<span>.</span></div>
    <nav class="nav">
      <a href="#">Home</a>
      <a href="#">Recipes</a>
      <a href="#">Blog</a>
      <a href="#">Contact</a>
      <a href="#">About us</a>
    </nav>

    <div class="social">
      <% if (username != null) { %>
        <img src="img/photo_profile.png" style="width:40px;border-radius:50%;">
        <span><%= username %></span>
        <a href="logout" class="btn-sign-in" style="margin-left:10px;">Logout</a>
      <% } else { %>
        <a href="login.jsp" class="btn-sign-in">Sign In</a>
      <% } %>
    </div>
  </header>

  <!-- HERO -->
  <section class="hero">
    <div class="hero-content">
      <h2>Spicy delicious chicken wings</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      <div class="hero-info">
        <span>30 Minutes</span> - <span>Chicken</span>
      </div>
      <div class="hero-author">
        <img src="img/photo_profile.png" alt="author">
        <div>
          <h4>John Smith</h4>
          <p>15 March 2022</p>
        </div>
        <button>View Recipe</button>
      </div>
    </div>
    <div class="hero-image">
      <img src="img/thumbnail.jpg" alt="chicken wings">
    </div>
  </section>

  <!-- CATEGORIES -->
  <section class="categories">
    <div class="div-line">
      <h3>Categories</h3>
      <a href="#" class="btn-view-categories">View all categories</a>
    </div>

    <div class="cat-list">
      <!-- first obj -->
      <div class="cat-item">
        <img src="img/categories/breakfast.png" alt="">
        <p>Breakfast</p>
      </div>

      <div class="cat-item"><img src="img/categories/vegan.png" alt=""><p>Vegan</p></div>
      <div class="cat-item"><img src="img/categories/meat.png" alt=""><p>Meat</p></div>
      <div class="cat-item"><img src="img/categories/dessert.png" alt=""><p>Dessert</p></div>
      <div class="cat-item"><img src="img/categories/lunch.png" alt=""><p>Lunch</p></div>
      <div class="cat-item"><img src="img/categories/chocolate.png" alt=""><p>Chocolate</p></div>
    </div>

    
  </section>

  <!-- RECIPES -->
  <section class="recipes">
    <h3>Simple and tasty recipes</h3>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

    <div class="recipe-grid">
      <div class="recipe-card">
        <img src="img/food1.png" alt="">
        <h4>Big and Juicy Wagyu Beef Cheeseburger</h4>
        <p>30 Minutes | Snack</p>
      </div>
      <div class="recipe-card">
        <img src="img/food2.png" alt="">
        <h4>Fresh Lime Roasted Salmon with Ginger Sauce</h4>
        <p>30 Minutes | Fish</p>
      </div>
      <div class="recipe-card">
        <img src="img/food3.png" alt="">
        <h4>Strawberry Oatmeal Pancake with Honey Syrup</h4>
        <p>30 Minutes | Breakfast</p>
      </div>
      <div class="recipe-card">
        <img src="img/food1.png" alt="">
        <h4>Chicken Meatballs with Cream Cheese</h4>
        <p>45 Minutes | Meat</p>
      </div>
      <div class="recipe-card">
        <img src="img/food2.png" alt="">
        <h4>Fruity Pancake with Orange & Blueberry</h4>
        <p>30 Minutes | Sweet</p>
      </div>
      <div class="recipe-card">
        <img src="img/food3.png" alt="">
        <h4>The Best Easy One Pot Chicken and Rice</h4>
        <p>30 Minutes | Lunch</p>
      </div>
    </div>
  </section>

  <!-- SUBSCRIBE -->
  <section class="subscribe">
    <h3>Deliciousness to your inbox</h3>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    <form>
      <input type="email" placeholder="Your email address">
      <button type="submit">Subscribe</button>
    </form>
  </section>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="footer-left">© 2025 Foodieland. Powered by Webflow</div>
    <div class="footer-right">
      <a href="#">Privacy</a>
      <a href="#">Blog</a>
      <a href="#">Contact</a>
      <a href="#">About us</a>
    </div>
  </footer>

  <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
</body>
</html>
