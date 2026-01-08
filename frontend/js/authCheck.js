// authCheck.js

// Get token from localStorage
const token = localStorage.getItem("token");

if (!token) {
  // Not logged in, redirect to login page
  window.location.href = "login.html";
}

async function loadUser() {
  try {
    const res = await fetch("/api/auth/me", {
      headers: { "Authorization": "Bearer " + token }
    });

    if (!res.ok) throw new Error("Not authorized");

    const data = await res.json();

    // If there’s a greeting element, show username
    const greetingEl = document.getElementById("greeting");
    if (greetingEl) greetingEl.textContent = `Hello, ${data.f_name}!`;

    return data; // return user data if needed
  } catch (err) {
    console.error(err);
    localStorage.removeItem("token");
    window.location.href = "login.html";
  }
}

// Logout button handling (if present)
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });
}

// Run immediately
loadUser();
