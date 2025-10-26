<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Login</title>
  <link rel="stylesheet" href="css/sign.css">
</head>
<body class="login-page">

  <div class="login-container">
    <form action="login" method="post" class="login-form">
      <h2 class="form-title">Sign In</h2>

      <label for="email">Email</label>
      <input type="email" id="email" name="email" placeholder="Enter your email" required class="form-input" value="test@example.com">

      <label for="password">Password</label>
      <input type="password" id="password" name="password" placeholder="Enter your password" required class="form-input" value="123456">

      <button type="submit" class="btn-sign-in">Login</button>

      <p class="form-footer">No account? <a href="register.jsp">Register</a></p>
    </form>
  </div>

</body>
</html>
