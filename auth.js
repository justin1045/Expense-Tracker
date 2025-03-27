//  User Registration
function registerUser() {
    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;
  
    // Validate inputs
    if (!name || !email || !username || !password) {
      alert("Please fill in all fields.");
      return;
    }
  
    // Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
  
    // Check if username already exists
    const userExists = users.some((user) => user.username === username);
    if (userExists) {
      alert("Username already exists. Choose another one.");
      return;
    }
  
    // Save new user
    users.push({ name, email, username, password });
    localStorage.setItem("users", JSON.stringify(users));
  
    alert("Sign-up successful! Please login.");
    toggleForm("login"); // Switch to login form
  }
  
  //  User Login
  function loginUser() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
  
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
  
    // Check if user exists and password matches
    const validUser = users.find(
      (user) => user.username === username && user.password === password
    );
  
    if (validUser) {
      // Store logged-in user in localStorage
      localStorage.setItem("loggedInUser", JSON.stringify(validUser));
      alert("Login successful!");
      showDashboard(); // Show dashboard
    } else {
      alert("Invalid username or password.");
    }
  }
  
  //  Logout User
  function logoutUser() {
    localStorage.removeItem("loggedInUser");
    location.reload(); // Reload page to go back to login
  }
  
  //  Toggle Between Login and Sign-up Forms
  function toggleForm(formType) {
    document.getElementById("login-form").classList.toggle("hidden", formType !== "login");
    document.getElementById("signup-form").classList.toggle("hidden", formType !== "signup");
  }
  
  //  Show Dashboard After Login
  function showDashboard() {
    document.getElementById("auth-container").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
  
    // Get logged-in user info
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    document.getElementById("welcome-user").innerText = `Welcome, ${loggedInUser.name}! 🎉`;
  }
  
  // Check Auth Status on Page Load
  window.onload = function () {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      showDashboard(); // Show dashboard if logged in
    } else {
      toggleForm("login"); // Show login form by default
    }
  };
  