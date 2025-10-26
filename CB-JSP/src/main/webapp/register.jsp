<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Register</title>
  <link rel="stylesheet" href="css/sign.css">
</head>
<body class="login-page">

  <div class="login-container">
    <form action="register" method="post" class="login-form">
      <h2 class="form-title">Create Account</h2>

      <label for="username">Username</label>
      <input type="text" id="username" name="username" placeholder="Username" required class="form-input"
             value="testuser">

      <label for="first_name">First Name</label>
      <input type="text" id="first_name" name="first_name" placeholder="First Name" class="form-input"
             value="John">

      <label for="last_name">Last Name</label>
      <input type="text" id="last_name" name="last_name" placeholder="Last Name" class="form-input"
             value="Doe">

      <label for="email">Email</label>
      <input type="email" id="email" name="email" placeholder="Email" required class="form-input"
             value="test@example.com">

      <label for="password">Password</label>
      <input type="password" id="password" name="password" placeholder="Password" required class="form-input"
             value="123456">

      <button type="submit" class="btn-sign-in">Register</button>

      <p class="form-footer">Already registered? <a href="login.jsp">Sign in</a></p>
    </form>
  </div>

</body>
</html>
