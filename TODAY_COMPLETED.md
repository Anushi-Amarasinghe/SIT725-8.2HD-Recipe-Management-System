# 🎯 Development Summary – All Completed Tasks

**Date:** Multiple Sessions  
**Focus:** Authentication, Security, Validation, Error Handling, and Route Protection

This document provides a comprehensive summary of all completed work, including detailed code explanations, implementation details, and **time estimates for human developers**.

---

## ⏱️ Time Estimates Overview

| Task | Estimated Time (Human Developer) |
|------|----------------------------------|
| Task #1: Email Normalization | 20-30 minutes |
| Task #2: Add Role Field | 15-20 minutes |
| Task #3: Include Role in JWT | 15-20 minutes |
| Task #4: Fix JWT Expiry | 5-10 minutes |
| Task #5: Generate JWT on Registration | 20-30 minutes |
| Task #6: Password Policy Validation | 1.5-2 hours |
| Task #7: Rate Limiting | 30-45 minutes |
| Task #8: Payload Size Limits | 15-20 minutes |
| Task #9: Email Format Validation | 30-45 minutes |
| Task #10: Standardized Error Format | 1-1.5 hours |
| Task #11: Validation Middleware | 1-1.5 hours |
| Task #12: Role-Based Middleware | 30-45 minutes |
| Task #14: Recipe Route Bug Fix | 15-20 minutes |
| **Total Estimated Time** | **~8-10 hours** |

---

## 📋 Table of Contents

### Previous Session Tasks
1. [Task #1: Email Normalization](#task-1-email-normalization)
2. [Task #2: Add Role Field to User Model](#task-2-add-role-field-to-user-model)
3. [Task #3: Include Role in JWT Token](#task-3-include-role-in-jwt-token)
4. [Task #4: Fix JWT Expiry to 24 Hours](#task-4-fix-jwt-expiry-to-24-hours)
5. [Task #5: Generate JWT on Registration](#task-5-generate-jwt-on-registration)
6. [Task #6: Password Policy Validation](#task-6-password-policy-validation)

### Today's Session Tasks
7. [Task #7: Rate Limiting for Auth Endpoints](#task-7-rate-limiting-for-auth-endpoints)
8. [Task #8: Payload Size Limits](#task-8-payload-size-limits)
9. [Task #9: Email Format Validation](#task-9-email-format-validation)
10. [Task #10: Standardized Error Response Format](#task-10-standardized-error-response-format)
11. [Task #11: Validation Middleware with express-validator](#task-11-validation-middleware-with-express-validator)
12. [Task #12: Role-Based Middleware & Auth Enhancements](#task-12-role-based-middleware--auth-enhancements)
13. [Task #14: Recipe Route Bug Fix](#task-14-recipe-route-bug-fix)
14. [Summary](#summary)

---

## Task #1: Email Normalization

**⏱️ Estimated Time: 20-30 minutes**

### ✅ What Was Implemented

- Made all emails lowercase before saving to database
- Emails are now trimmed (no extra spaces)
- Works in both registration and login endpoints
- Prevents duplicate accounts with different email cases

### 📝 Code Explanation

**File Modified: `backend/models/User.js`**

```javascript
const userSchema = new mongoose.Schema({
  // ... other fields
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,  // ✅ Automatically converts to lowercase
    trim: true       // ✅ Removes leading/trailing whitespace
  },
  // ... other fields
});

// Pre-save hook to ensure email is always lowercase and trimmed
userSchema.pre("save", function(next) {
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }
  next();
});
```

**File Modified: `backend/routes/auth.js`**

**Registration Endpoint:**
```javascript
router.post("/register", async (req, res) => {
  // Normalize email to lowercase and trim
  const normalizedEmail = email.toLowerCase().trim();
  
  // Check existing user with normalized email
  const existingUser = await User.findOne({ email: normalizedEmail });
  
  // Create user with normalized email
  const newUser = await User.create({
    // ...
    email: normalizedEmail,
    // ...
  });
});
```

**Login Endpoint:**
```javascript
router.post("/login", async (req, res) => {
  // Normalize email to lowercase and trim
  const normalizedEmail = email.toLowerCase().trim();
  
  // Find user with normalized email
  const user = await User.findOne({ email: normalizedEmail });
});
```

**Why This Matters:**
- **Data Integrity:** Prevents duplicate accounts (e.g., "John@Email.com" and "john@email.com")
- **User Experience:** Users can login with any email case
- **Database Efficiency:** Consistent email format in database
- **Security:** Prevents email-based account enumeration attacks

---

## Task #2: Add Role Field to User Model

**⏱️ Estimated Time: 15-20 minutes**

### ✅ What Was Implemented

- Added a "role" field to the User model
- Default role is "user"
- Can be "user" or "admin"
- Ready for role-based access control

### 📝 Code Explanation

**File Modified: `backend/models/User.js`**

```javascript
const userSchema = new mongoose.Schema({
  // ... other fields
  role: {
    type: String,
    enum: ["user", "admin"],  // ✅ Only allows these two values
    default: "user"           // ✅ Defaults to "user" if not specified
  },
  // ... other fields
});
```

**How It Works:**
- When a user is created without specifying a role, it defaults to "user"
- Only "user" or "admin" values are allowed (enum validation)
- Can be set to "admin" manually in database or during user creation

**Usage Example:**
```javascript
// User with default role (user)
const newUser = await User.create({
  f_name: "John",
  l_name: "Doe",
  email: "john@example.com",
  password: hashedPassword
  // role will be "user" by default
});

// User with admin role
const adminUser = await User.create({
  f_name: "Admin",
  l_name: "User",
  email: "admin@example.com",
  password: hashedPassword,
  role: "admin"  // ✅ Explicitly set to admin
});
```

**Why This Matters:**
- **Foundation for RBAC:** Enables role-based access control
- **Scalability:** Easy to add more roles in the future
- **Security:** Can restrict admin features to admin users only

---

## Task #3: Include Role in JWT Token

**⏱️ Estimated Time: 15-20 minutes**

### ✅ What Was Implemented

- JWT token now includes the user's role
- Token payload contains: `{ id: user_id, role: "user" }`
- Role can be checked from token without database query

### 📝 Code Explanation

**File Modified: `backend/routes/auth.js`**

**Login Endpoint:**
```javascript
router.post("/login", async (req, res) => {
  // ... authentication logic
  
  // Generate JWT with user id and role, 24-hour expiry
  const token = jwt.sign(
    { 
      id: user._id,              // ✅ User ID
      role: user.role || "user"  // ✅ User role (NEW!)
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
  
  return res.json({ token });
});
```

**Registration Endpoint:**
```javascript
router.post("/register", async (req, res) => {
  // ... user creation logic
  
  // Generate JWT token with user id and role, 24-hour expiry
  const token = jwt.sign(
    { 
      id: newUser._id,                    // ✅ User ID
      role: newUser.role || "user"         // ✅ User role (NEW!)
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
  
  return res.status(201).json({ 
    message: "Registered successfully",
    token: token
  });
});
```

**Token Payload Structure:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "role": "user",
  "iat": 1234567890,
  "exp": 1234654290
}
```

**Why This Matters:**
- **Performance:** No need to query database to check user role
- **Authorization:** Can check role directly from token
- **Efficiency:** Reduces database queries for role checks

---

## Task #4: Fix JWT Expiry to 24 Hours

**⏱️ Estimated Time: 5-10 minutes**

### ✅ What Was Implemented

- Changed token expiry from 1 hour to 24 hours
- Tokens now last a full day
- Applied to both registration and login endpoints

### 📝 Code Explanation

**File Modified: `backend/routes/auth.js`**

**Before:**
```javascript
const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }  // ❌ Only 1 hour
);
```

**After:**
```javascript
const token = jwt.sign(
  { 
    id: user._id,
    role: user.role || "user"
  },
  process.env.JWT_SECRET,
  { expiresIn: "24h" }  // ✅ 24 hours
);
```

**Why This Matters:**
- **User Experience:** Users stay logged in longer (full day)
- **Convenience:** Less frequent re-authentication required
- **Balance:** 24 hours is reasonable security vs. convenience trade-off

---

## Task #5: Generate JWT on Registration

**⏱️ Estimated Time: 20-30 minutes**

### ✅ What Was Implemented

- After successful registration, a JWT token is created
- Token is sent back to frontend in response
- Frontend saves token and automatically logs user in
- User goes straight to dashboard (no manual login needed)

### 📝 Code Explanation

**File Modified: `backend/routes/auth.js`**

**Registration Endpoint:**
```javascript
router.post("/register", async (req, res) => {
  try {
    // ... validation and user creation
    
    // Create user
    const newUser = await User.create({
      f_name,
      l_name,
      email: normalizedEmail,
      password: hashedPassword,
      active: 1,
      created_date: new Date()
    });

    // ✅ Generate JWT token after user creation
    const token = jwt.sign(
      { 
        id: newUser._id,
        role: newUser.role || "user"
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // ✅ Return token in response
    return res.status(201).json({ 
      message: "Registered successfully",
      token: token  // ✅ Token included in response
    });
  } catch (error) {
    // ... error handling
  }
});
```

**File Modified: `frontend/register.html`**

```javascript
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  // ... form data collection and validation
  
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ f_name, l_name, email, password, confirm_password })
    });

    const data = await res.json();

    if (!res.ok) {
      // Handle errors
      return;
    }

    // ✅ Auto-login: Save token and redirect to dashboard
    if (data.token) {
      localStorage.setItem('token', data.token);  // ✅ Save token
      window.location.href = 'dashboard.html';   // ✅ Redirect to dashboard
    } else {
      // Fallback if token not received
      alert("Registration successful! Please login.");
      window.location.href = "login.html";
    }
  } catch (err) {
    // ... error handling
  }
});
```

**Why This Matters:**
- **User Experience:** Seamless registration → automatic login
- **Reduced Friction:** No need to login separately after registration
- **Modern UX:** Matches expectations of modern web applications

---

## Task #6: Password Policy Validation

**⏱️ Estimated Time: 1.5-2 hours**

### ✅ What Was Implemented

- Password must meet strict requirements:
  - At least 8 characters long
  - At least one uppercase letter (A-Z)
  - At least one lowercase letter (a-z)
  - At least one number (0-9)
  - At least one special character (!@#$%^&* etc.)
- Real-time validation on frontend (shows as user types)
- Backend validation before saving user
- Visual password strength indicator (Weak/Medium/Strong)
- Password requirements checklist (turns green when met)
- Password match checker

### 📝 Code Explanation

**File Modified: `backend/routes/auth.js`**

**Password Validation Function:**
```javascript
function validatePassword(password) {
  const errors = [];
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}
```

**Applied in Registration:**
```javascript
router.post("/register", async (req, res) => {
  // ... other validation
  
  // Password policy validation
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return res.status(400).json({ 
      message: "Password does not meet requirements",
      errors: passwordValidation.errors
    });
  }
  
  // ... continue with user creation
});
```

**File Modified: `frontend/register.html`**

**HTML Structure:**
```html
<div class="input-group">
  <input type="password" id="password" placeholder="Password" required />
  
  <!-- Password Requirements Checklist -->
  <div class="password-requirements" id="passwordRequirements" style="display: none;">
    <small>Password must contain:</small>
    <ul id="requirementList">
      <li id="req-length">At least 8 characters</li>
      <li id="req-upper">One uppercase letter</li>
      <li id="req-lower">One lowercase letter</li>
      <li id="req-number">One number</li>
      <li id="req-special">One special character</li>
    </ul>
  </div>
  
  <!-- Password Strength Indicator -->
  <div class="password-strength" id="passwordStrength" style="display: none;">
    <div class="strength-bar">
      <div class="strength-fill" id="strengthFill"></div>
    </div>
    <span class="strength-text" id="strengthText"></span>
  </div>
</div>

<div class="input-group">
  <input type="password" id="confirm_password" placeholder="Confirm Password" required />
  <div class="password-match" id="passwordMatch" style="display: none;"></div>
</div>
```

**JavaScript Validation:**
```javascript
// Password validation function
function validatePassword(password) {
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };
  return checks;
}

// Calculate password strength
function calculateStrength(checks) {
  const validCount = Object.values(checks).filter(v => v).length;
  if (validCount <= 2) return { level: 'weak', text: 'Weak' };
  if (validCount <= 4) return { level: 'medium', text: 'Medium' };
  return { level: 'strong', text: 'Strong' };
}

// Update password requirements display
function updatePasswordRequirements(password) {
  if (password.length === 0) {
    passwordRequirements.style.display = 'none';
    passwordStrength.style.display = 'none';
    return;
  }

  passwordRequirements.style.display = 'block';
  passwordStrength.style.display = 'block';

  const checks = validatePassword(password);
  const strength = calculateStrength(checks);

  // Update requirement list (turns green when met)
  document.getElementById('req-length').classList.toggle('valid', checks.length);
  document.getElementById('req-upper').classList.toggle('valid', checks.upper);
  document.getElementById('req-lower').classList.toggle('valid', checks.lower);
  document.getElementById('req-number').classList.toggle('valid', checks.number);
  document.getElementById('req-special').classList.toggle('valid', checks.special);

  // Update strength bar
  strengthFill.className = 'strength-fill ' + strength.level;
  strengthText.textContent = `Password Strength: ${strength.text}`;
}

// Check password match
function checkPasswordMatch() {
  const password = passwordInput.value;
  const confirm = confirmPasswordInput.value;

  if (confirm.length === 0) {
    passwordMatch.style.display = 'none';
    return;
  }

  passwordMatch.style.display = 'block';
  if (password === confirm) {
    passwordMatch.textContent = '✓ Passwords match';
    passwordMatch.className = 'password-match match';
  } else {
    passwordMatch.textContent = '✗ Passwords do not match';
    passwordMatch.className = 'password-match no-match';
  }
}

// Real-time validation as user types
passwordInput.addEventListener('input', (e) => {
  updatePasswordRequirements(e.target.value);
  checkPasswordMatch();
});

confirmPasswordInput.addEventListener('input', checkPasswordMatch);
```

**CSS Styling:**
```css
.password-requirements li {
  color: #ff6b6b;  /* Red for unmet requirements */
  transition: color 0.3s;
}
.password-requirements li.valid {
  color: #51cf66;  /* Green for met requirements */
}

.strength-fill.weak { width: 33%; background-color: #ff6b6b; }
.strength-fill.medium { width: 66%; background-color: #ffd93d; }
.strength-fill.strong { width: 100%; background-color: #51cf66; }

.password-match.match {
  color: #51cf66;  /* Green for match */
}
.password-match.no-match {
  color: #ff6b6b;  /* Red for no match */
}
```

**Why This Matters:**
- **Security:** Strong passwords required (prevents brute force)
- **User Experience:** Real-time feedback guides users
- **Visual Feedback:** Color-coded requirements and strength meter
- **Backend Validation:** Server validates even if frontend is bypassed

---

## Task #7: Rate Limiting for Auth Endpoints

### ✅ What Was Implemented

- Created a dedicated rate limiter middleware for authentication endpoints
- Applied rate limiting to `/api/auth/register` and `/api/auth/login` endpoints
- Configured limits: **5 requests per 15 minutes per IP address**
- Returns standardized error response when limit is exceeded

### 📝 Code Explanation

**File Created: `backend/middleware/rateLimiter.js`**

```javascript
const rateLimit = require("express-rate-limit");

/**
 * Rate limiter for authentication endpoints
 * Limits: 5 requests per 15 minutes per IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
  max: 5, // Maximum 5 requests per window
  message: {
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests from this IP, please try again later.",
      details: "Maximum 5 requests per 15 minutes allowed"
    }
  },
  standardHeaders: true, // Adds RateLimit-* headers to response
  legacyHeaders: false
});

module.exports = authLimiter;
```

**How It Works:**
- `express-rate-limit` tracks requests per IP address
- When an IP exceeds 5 requests in 15 minutes, it blocks further requests
- Returns a standardized error message matching our error format
- Adds `RateLimit-*` headers to responses for client information

**Applied in `backend/routes/auth.js`:**

```javascript
const authLimiter = require("../middleware/rateLimiter");

// Applied to registration endpoint
router.post("/register", authLimiter, validateRegister, async (req, res) => {
  // ... registration logic
});

// Applied to login endpoint
router.post("/login", authLimiter, validateLogin, async (req, res) => {
  // ... login logic
});
```

**Why This Matters:**
- **Security:** Prevents brute force attacks and credential stuffing
- **DoS Protection:** Limits abuse from single IP addresses
- **User Experience:** Clear error messages when rate limit is hit
- **Consistency:** Uses standardized error format

---

## Task #8: Payload Size Limits

**⏱️ Estimated Time: 15-20 minutes**

### ✅ What Was Implemented

- Configured global Express body parser limit (1MB)
- Added 10KB payload size check for authentication endpoints
- Created body size limiter middleware (for future use)
- Returns standardized error when payload exceeds limit

### 📝 Code Explanation

**File Updated: `backend/app.js`**

```javascript
// Middleware
app.use(cors());
// Configure body parser with size limits (10kb for auth endpoints, 1mb for others)
app.use(express.json({ limit: "1mb" }));
```

**File Created: `backend/middleware/bodySizeLimiter.js`**

```javascript
const express = require("express");

/**
 * Body size limiter for authentication endpoints
 * Limits request body to 10kb
 */
const authBodyLimiter = express.json({ 
  limit: "10kb",
  verify: (req, res, buf) => {
    // Additional verification if needed
    if (buf.length > 10 * 1024) {
      throw new Error("Request body too large");
    }
  }
});

module.exports = authBodyLimiter;
```

**Applied in `backend/routes/auth.js`:**

```javascript
router.post("/register", authLimiter, validateRegister, async (req, res) => {
  try {
    // Check payload size (10kb limit)
    const contentLength = req.get("content-length");
    if (contentLength && parseInt(contentLength) > 10 * 1024) {
      return sendError(res, 413, ErrorCodes.PAYLOAD_TOO_LARGE, 
        "Request payload too large", 
        "Maximum 10kb allowed for registration");
    }
    // ... rest of registration logic
  }
});
```

**Why This Matters:**
- **Security:** Prevents DoS attacks via large payloads
- **Performance:** Limits memory usage on server
- **Resource Protection:** Prevents abuse of server resources

---

## Task #9: Email Format Validation

**⏱️ Estimated Time: 30-45 minutes**

### ✅ What Was Implemented

- Added backend email format validation using `validator` library
- Email validation integrated into validation middleware
- Prevents invalid email formats from being saved

### 📝 Code Explanation

**This is now handled by the validation middleware (Task #11) which uses `express-validator` that includes email validation.**

**File: `backend/middleware/validation.js`**

```javascript
body("email")
  .trim()
  .notEmpty().withMessage("Email is required")
  .isEmail().withMessage("Invalid email format")  // ✅ Email format validation
  .normalizeEmail(),  // Converts to lowercase and trims
```

**Why This Matters:**
- **Data Quality:** Ensures only valid emails are stored
- **User Experience:** Clear error messages for invalid emails
- **Security:** Prevents malformed data in database

---

## Task #10: Standardized Error Response Format

**⏱️ Estimated Time: 1-1.5 hours**

### ✅ What Was Implemented

- Created centralized error handling utility (`errorHandler.js`)
- Standardized all API error responses to follow consistent format
- Defined error codes enum for machine-readable error identification
- Updated all endpoints to use standardized error responses

### 📝 Code Explanation

**File Created: `backend/utils/errorHandler.js`**

```javascript
/**
 * Standardized Error Response Format
 * All API errors follow this structure:
 * {
 *   error: {
 *     code: string,
 *     message: string,
 *     details?: string | array
 *   }
 * }
 */

/**
 * Create standardized error response
 * @param {string} code - Error code (e.g., "VALIDATION_ERROR", "AUTH_ERROR")
 * @param {string} message - Human-readable error message
 * @param {string|array} details - Optional additional details
 * @returns {object} Standardized error object
 */
function createErrorResponse(code, message, details = null) {
  const error = { code, message };
  if (details) {
    error.details = details;
  }
  return { error };
}

/**
 * Send standardized error response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} code - Error code
 * @param {string} message - Error message
 * @param {string|array} details - Optional details
 */
function sendError(res, statusCode, code, message, details = null) {
  return res.status(statusCode).json(createErrorResponse(code, message, details));
}

/**
 * Common error codes
 */
const ErrorCodes = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTH_ERROR: "AUTH_ERROR",
  NOT_FOUND: "NOT_FOUND",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  SERVER_ERROR: "SERVER_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  PAYLOAD_TOO_LARGE: "PAYLOAD_TOO_LARGE"
};

module.exports = {
  createErrorResponse,
  sendError,
  ErrorCodes
};
```

**Usage Example in `backend/routes/auth.js`:**

**Before (Inconsistent):**
```javascript
return res.status(400).json({ message: "Email already exists" });
return res.status(500).json({ message: "Server error" });
```

**After (Standardized):**
```javascript
return sendError(res, 400, ErrorCodes.VALIDATION_ERROR, "Email already exists");
return sendError(res, 500, ErrorCodes.SERVER_ERROR, "Server error");
```

**Error Response Format:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      "Email is required",
      "Password must be at least 8 characters"
    ]
  }
}
```

**Why This Matters:**
- **Consistency:** All API errors follow the same structure
- **Frontend Integration:** Easier to handle errors in frontend code
- **Debugging:** Machine-readable error codes for programmatic handling
- **User Experience:** Clear, structured error messages

---

## Task #11: Validation Middleware with express-validator

**⏱️ Estimated Time: 1-1.5 hours**

### ✅ What Was Implemented

- Created reusable validation middleware using `express-validator`
- Defined comprehensive validation rules for registration and login
- Automatic error collection and standardized error response
- Email normalization and password strength validation

### 📝 Code Explanation

**File Created: `backend/middleware/validation.js`**

```javascript
const { body, validationResult } = require("express-validator");
const { sendError, ErrorCodes } = require("../utils/errorHandler");

/**
 * Validation result handler middleware
 * Checks validation results and sends standardized error if validation fails
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    return sendError(res, 400, ErrorCodes.VALIDATION_ERROR, 
      "Validation failed", 
      errorMessages);
  }
  next();
};

/**
 * Registration validation rules
 */
const validateRegister = [
  body("f_name")
    .trim()
    .notEmpty().withMessage("First name is required")
    .isLength({ min: 1, max: 50 }).withMessage("First name must be between 1 and 50 characters"),
  
  body("l_name")
    .trim()
    .notEmpty().withMessage("Last name is required")
    .isLength({ min: 1, max: 50 }).withMessage("Last name must be between 1 and 50 characters"),
  
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(), // Converts to lowercase and trims
  
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/).withMessage("Password must contain at least one special character"),
  
  body("confirm_password")
    .notEmpty().withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  
  handleValidationErrors // Must be last - checks all validation results
];

/**
 * Login validation rules
 */
const validateLogin = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),
  
  body("password")
    .notEmpty().withMessage("Password is required"),
  
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  handleValidationErrors
};
```

**How It Works:**
1. `express-validator` validates each field in `req.body`
2. Validation rules are chained (e.g., `.trim().notEmpty().isEmail()`)
3. If any validation fails, errors are collected
4. `handleValidationErrors` middleware checks results before route handler
5. If errors exist, returns standardized error response
6. If no errors, continues to route handler

**Applied in Routes:**

```javascript
const { validateRegister, validateLogin } = require("../middleware/validation");

// Registration with validation
router.post("/register", authLimiter, validateRegister, async (req, res) => {
  // If we reach here, all validation passed
  // req.body.email is already normalized (lowercase, trimmed)
  // All fields are validated and sanitized
});

// Login with validation
router.post("/login", authLimiter, validateLogin, async (req, res) => {
  // Email is validated and normalized
  // Password is checked for presence
});
```

**Why This Matters:**
- **DRY Principle:** Validation logic in one place, reusable
- **Consistency:** Same validation rules applied everywhere
- **Security:** Input sanitization and validation before processing
- **User Experience:** Clear, specific error messages for each validation failure

---

## Task #12: Role-Based Middleware & Auth Middleware Enhancements

**⏱️ Estimated Time: 30-45 minutes**

### ✅ What Was Implemented

- Enhanced `authMiddleware` to extract and attach user role from JWT token
- Created `adminOnly` middleware for admin-only routes
- Created `userOrAdmin` middleware for user/admin routes
- Foundation for role-based access control (RBAC)

### 📝 Code Explanation

**File Updated: `backend/middleware/authMiddleware.js`**

**Before:**
```javascript
req.userId = decoded.id; // Only user ID
```

**After:**
```javascript
const jwt = require("jsonwebtoken");
const { sendError, ErrorCodes } = require("../utils/errorHandler");

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, 401, ErrorCodes.UNAUTHORIZED, "Not authorized - No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;      // User ID from token
    req.userRole = decoded.role;   // User role from token (NEW!)
    next();
  } catch (err) {
    return sendError(res, 401, ErrorCodes.UNAUTHORIZED, "Not authorized - Invalid or expired token");
  }
}

module.exports = auth;
```

**File Created: `backend/middleware/roleMiddleware.js`**

```javascript
const { sendError, ErrorCodes } = require("../utils/errorHandler");

/**
 * Middleware to check if user has admin role
 * Must be used after authMiddleware
 */
const adminOnly = (req, res, next) => {
  if (!req.userRole) {
    return sendError(res, 401, ErrorCodes.UNAUTHORIZED, 
      "Authentication required");
  }
  
  if (req.userRole !== "admin") {
    return sendError(res, 403, ErrorCodes.FORBIDDEN, 
      "Admin access required");
  }
  
  next(); // User is admin, allow access
};

/**
 * Middleware to check if user has admin or user role
 * Must be used after authMiddleware
 */
const userOrAdmin = (req, res, next) => {
  if (!req.userRole) {
    return sendError(res, 401, ErrorCodes.UNAUTHORIZED, 
      "Authentication required");
  }
  
  if (req.userRole !== "admin" && req.userRole !== "user") {
    return sendError(res, 403, ErrorCodes.FORBIDDEN, 
      "Invalid user role");
  }
  
  next(); // User has valid role
};

module.exports = {
  adminOnly,
  userOrAdmin
};
```

**Usage Examples:**

```javascript
const authMiddleware = require("../middleware/authMiddleware");
const { adminOnly, userOrAdmin } = require("../middleware/roleMiddleware");

// Admin-only route
router.get("/admin/users", authMiddleware, adminOnly, async (req, res) => {
  // Only admins can access this
  // req.userId and req.userRole are available
});

// User or Admin route
router.get("/profile", authMiddleware, userOrAdmin, async (req, res) => {
  // Both users and admins can access
});

// Regular authenticated route
router.get("/recipes", authMiddleware, async (req, res) => {
  // Any authenticated user can access
  // req.userId and req.userRole available
});
```

**Why This Matters:**
- **Authorization:** Foundation for role-based access control
- **Security:** Prevents unauthorized access to admin features
- **Flexibility:** Easy to add new role-based routes
- **Scalability:** Ready for future admin features

---

## Task #14: Recipe Route Bug Fix

**⏱️ Estimated Time: 15-20 minutes**

### ✅ What Was Fixed

- Fixed bug where recipe creation used `req.user.id` (undefined) instead of `req.userId`
- Updated recipe route to use standardized error handling
- Ensured consistent error responses across all routes

### 📝 Code Explanation

**File Updated: `backend/routes/Recipe.js`**

**Before (Bug):**
```javascript
const recipe = new Recipe({
  // ...
  user: req.user.id,  // ❌ WRONG - authMiddleware sets req.userId, not req.user.id
});
```

**After (Fixed):**
```javascript
const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipe");
const authMiddleware = require("../middleware/authMiddleware");
const { sendError, ErrorCodes } = require("../utils/errorHandler");

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      ingredients,
      instructions,
      cookingTime,
      difficulty,
    } = req.body;

    const recipe = new Recipe({
      title,
      ingredients,
      instructions,
      cookingTime,
      difficulty,
      user: req.userId, // ✅ CORRECT - matches authMiddleware
    });

    const savedRecipe = await recipe.save();

    return res.status(201).json(savedRecipe);
  } catch (error) {
    // Field-specific validation errors
    if (error.name === "ValidationError") {
      const errors = [];

      Object.keys(error.errors).forEach((field) => {
        errors.push(`${field}: ${error.errors[field].message}`);
      });

      return sendError(res, 400, ErrorCodes.VALIDATION_ERROR, 
        "Recipe validation failed", 
        errors);
    }

    console.error("Recipe creation error:", error);
    return sendError(res, 500, ErrorCodes.SERVER_ERROR, 
      "Server error", 
      process.env.NODE_ENV === "development" ? error.message : undefined);
  }
});

module.exports = router;
```

**Why This Matters:**
- **Bug Fix:** Recipes now correctly linked to authenticated user
- **Consistency:** Recipe errors use same format as auth errors
- **Maintainability:** Easier to debug and maintain

---

## Summary

### 📦 Files Created (5 new files in today's session)

1. **`backend/middleware/rateLimiter.js`**
   - Rate limiting middleware for auth endpoints
   - 5 requests per 15 minutes per IP

2. **`backend/middleware/bodySizeLimiter.js`**
   - Body size limiting middleware (for future use)
   - 10KB limit for auth endpoints

3. **`backend/utils/errorHandler.js`**
   - Centralized error handling utility
   - Standardized error response format
   - Error codes enum

4. **`backend/middleware/validation.js`**
   - Express-validator middleware
   - Registration and login validation rules
   - Automatic error handling

5. **`backend/middleware/roleMiddleware.js`**
   - Role-based access control middleware
   - `adminOnly` and `userOrAdmin` functions

### 📝 Files Modified (4 files in today's session + 3 from previous session)

1. **`backend/routes/auth.js`**
   - Added rate limiting
   - Added validation middleware
   - Updated to use standardized errors
   - Added payload size checks

2. **`backend/middleware/authMiddleware.js`**
   - Added role extraction from JWT
   - Updated to use standardized errors
   - Attaches `req.userRole` to request

3. **`backend/routes/Recipe.js`**
   - Fixed `req.user.id` → `req.userId` bug
   - Updated to use standardized errors

4. **`backend/app.js`**
   - Added global body parser limit (1MB)

### 📚 Packages Installed (3 packages in today's session)

1. **`express-rate-limit`** - Rate limiting functionality
2. **`validator`** - Email validation (used by express-validator)
3. **`express-validator`** - Request validation middleware

### 🎯 Key Achievements

✅ **Security Enhancements:**
- Rate limiting prevents brute force attacks
- Payload size limits prevent DoS attacks
- Email validation prevents invalid data

✅ **Code Quality:**
- Standardized error handling across all endpoints
- Reusable validation middleware
- Consistent API responses

✅ **Foundation for Future:**
- Role-based access control ready
- Admin middleware available
- Scalable error handling system

### 🚀 What's Ready Now

1. **Secure Authentication:**
   - Rate-limited endpoints
   - Validated inputs
   - Standardized errors

2. **Role-Based Access:**
   - Admin-only routes can be created
   - User/admin routes can be created
   - Role checking middleware available

3. **Consistent API:**
   - All errors follow same format
   - Easy frontend integration
   - Better debugging experience

### 📋 Next Steps

1. **Complete Recipe API:**
   - GET all recipes
   - GET single recipe
   - PUT update recipe
   - DELETE recipe

2. **Update Frontend:**
   - Handle new error format
   - Display validation errors
   - Show rate limit messages

3. **Build Recipe Management UI:**
   - Recipe list display
   - Recipe creation form
   - Recipe editing
   - Recipe deletion

---

## 📊 Statistics

### Previous Session (Tasks #1-6)
- **Tasks Completed:** 6 major tasks
- **Files Modified:** 3 files (`User.js`, `auth.js`, `register.html`)
- **Estimated Time:** ~3-4 hours

### Today's Session (Tasks #7-14)
- **Tasks Completed:** 7 major tasks
- **Files Created:** 5 new files
- **Files Modified:** 4 existing files
- **Packages Installed:** 3 new dependencies
- **Estimated Time:** ~5-6 hours

### Total Project
- **Total Tasks Completed:** 13 major tasks
- **Total Files Created:** 5 new files
- **Total Files Modified:** 7 files
- **Total Packages Installed:** 3 new dependencies
- **Total Lines of Code Added:** ~1000+ lines
- **Total Estimated Time:** ~8-10 hours (for human developer)
- **Security Features:** 6+ major security improvements
- **Code Quality:** Standardized error handling, validation, and role-based access

---

**End of Document**

