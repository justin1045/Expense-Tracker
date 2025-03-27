// Select all DOM elements
const signupNameInput = document.getElementById("signup-name");
const signupEmailInput = document.getElementById("signup-email");
const signupUsernameInput = document.getElementById("signup-username");
const signupPasswordInput = document.getElementById("signup-password");

const loginUsernameInput = document.getElementById("login-username");
const loginPasswordInput = document.getElementById("login-password");

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const authContainer = document.getElementById("auth-container");
const dashboard = document.getElementById("dashboard");
const welcomeUser = document.getElementById("welcome-user");

//  User Registration
function registerUser() {
  const name = signupNameInput.value;
  const email = signupEmailInput.value;
  const username = signupUsernameInput.value;
  const password = signupPasswordInput.value;

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
  const username = loginUsernameInput.value;
  const password = loginPasswordInput.value;

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
  loginForm.classList.toggle("hidden", formType !== "login");
  signupForm.classList.toggle("hidden", formType !== "signup");
}

//  Show Dashboard After Login
function showDashboard() {
  authContainer.classList.add("hidden");
  dashboard.classList.remove("hidden");

  // Get logged-in user info
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  welcomeUser.innerText = `Welcome, ${loggedInUser.name}! 🎉`;
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
