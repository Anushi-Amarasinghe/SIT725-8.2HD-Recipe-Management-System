// settings.js

/* ===========================
   Utility functions
=========================== */
function showMessage(msg, type = "success", container) {
  const div = document.createElement("div");
  div.textContent = msg;
  div.className = `inline-alert ${type === "error" ? "error" : "success"} show`;
  container.appendChild(div);
  setTimeout(() => div.remove(), 3000);
}

/* ===========================
   Profile Update
=========================== */
document.getElementById("updateProfileBtn")?.addEventListener("click", async () => {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const container = document.getElementById("updateProfileBtn").closest(".edit-card");

  if (!firstName || !lastName || !email) {
    showMessage("All fields are required.", "error", container);
    return;
  }

  try {
    // Example API call
    const token = localStorage.getItem("token");
    const res = await fetch("/api/user/update", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ firstName, lastName, email })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update profile");

    showMessage("Profile updated successfully!", "success", container);
  } catch (err) {
    console.error(err);
    showMessage(err.message || "Error updating profile", "error", container);
  }
});

/* ===========================
   Change Password
=========================== */
document.getElementById("changePasswordBtn")?.addEventListener("click", async () => {
  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const container = document.getElementById("changePasswordBtn").closest(".edit-card");

  if (!currentPassword || !newPassword || !confirmPassword) {
    showMessage("All fields are required.", "error", container);
    return;
  }

  if (newPassword !== confirmPassword) {
    showMessage("New password and confirm password do not match.", "error", container);
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/user/change-password", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to change password");

    // Clear inputs after success
    document.getElementById("currentPassword").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";

    showMessage("Password changed successfully!", "success", container);
  } catch (err) {
    console.error(err);
    showMessage(err.message || "Error changing password", "error", container);
  }
});

/* ===========================
   Preferences
=========================== */
document.getElementById("savePreferencesBtn")?.addEventListener("click", () => {
  const darkMode = document.getElementById("darkModeToggle").checked;
  const emailNotifications = document.getElementById("emailNotifications").checked;
  const container = document.getElementById("savePreferencesBtn").closest(".edit-card");

  // Save to localStorage or call API
  localStorage.setItem("darkMode", darkMode);
  localStorage.setItem("emailNotifications", emailNotifications);

  // Apply dark mode instantly
  if (darkMode) document.body.classList.add("dark-mode");
  else document.body.classList.remove("dark-mode");

  showMessage("Preferences saved successfully!", "success", container);
});

/* ===========================
   Load saved preferences
=========================== */
document.addEventListener("DOMContentLoaded", () => {
  const darkMode = localStorage.getItem("darkMode") === "true";
  const emailNotifications = localStorage.getItem("emailNotifications") === "true";

  document.getElementById("darkModeToggle").checked = darkMode;
  document.getElementById("emailNotifications").checked = emailNotifications;

  if (darkMode) document.body.classList.add("dark-mode");
});
