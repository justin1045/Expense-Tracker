// 🌟 Register New User
function registerUser() {
    // Get user details from the signup form
    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;
  
    // Check if any field is empty
    if (!name || !email || !username || !password) {
      alert("Please fill in all fields.");
      return;
    }
  
    // Get existing users from localStorage or set empty array
    let users = JSON.parse(localStorage.getItem("users")) || [];
  
    // Check if username already exists
    const userExists = users.some((user) => user.username === username);
    if (userExists) {
      alert("Username already taken. Please choose another.");
      return;
    }
  
    // Add new user to the list
    users.push({ name, email, username, password });
  
    // Save updated users list to localStorage
    localStorage.setItem("users", JSON.stringify(users));
  
    alert("Sign-up successful! You can now log in.");
    toggleForm("login"); // Switch to login form after sign-up
  }
  
  // 🔐 Log in User
  function loginUser() {
    // Get login details from the login form
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
  
    // Get registered users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
  
    // Check if username and password match any user
    const validUser = users.find(
      (user) => user.username === username && user.password === password
    );
  
    if (validUser) {
      // Store the logged-in user info in localStorage
      localStorage.setItem("loggedInUser", JSON.stringify(validUser));
      alert("Login successful!");
      showDashboard(); // Show the dashboard after login
    } else {
      alert("Incorrect username or password. Please try again.");
    }
  }
  
  // 🚪 Log out User
  function logoutUser() {
    localStorage.removeItem("loggedInUser"); // Remove user data
    location.reload(); // Reload page to return to login
  }
  
  // 🔄 Switch Between Login and Sign-up Forms
  function toggleForm(formType) {
    // Show login form if formType is "login"
    document.getElementById("login-form").classList.toggle("hidden", formType !== "login");
  
    // Show signup form if formType is "signup"
    document.getElementById("signup-form").classList.toggle("hidden", formType !== "signup");
  }
  
  // 🎉 Show Dashboard for Logged-in User
  function showDashboard() {
    document.getElementById("auth-container").classList.add("hidden"); // Hide login/signup
    document.getElementById("dashboard").classList.remove("hidden"); // Show dashboard
  
    // Get logged-in user details and show welcome message
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    document.getElementById("welcome-user").innerText = `Welcome, ${loggedInUser.name}! 🎉`;
  }
  
  // 🚨 Check If User is Already Logged In
  window.onload = function () {
    const loggedInUser = localStorage.getItem("loggedInUser");
  
    // If user is logged in, show dashboard
    if (loggedInUser) {
      showDashboard();
    } else {
      // Otherwise, show login form by default
      toggleForm("login");
    }
  };
  