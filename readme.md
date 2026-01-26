Recipe Management System



A modern, user-friendly web application to create, organize, and manage recipes. Users can add recipes with ingredients, instructions, categories, and images, making it easy to build a personal cookbook or manage recipes for home or professional use.

📌 Features

User Authentication – Login and registration

CRUD Recipes – Create, read, update, and delete recipes

Categorization – Breakfast, Desserts, Vegetarian, etc.

Step-by-step Instructions – For every recipe

Image Upload – Upload photos for recipes

Search & Filter – Quickly find recipes

Responsive Design – Works on desktop and mobile

Creative UI – Modern, glassmorphism login screen with icons and gradients


                                                API LIST

Auth APIs

| Method | Path                        | Access | Purpose                                                            |
| ------ | --------------------------- | ------ | ------------------------------------------------------------------ |
| POST   | `/api/auth/register`        | Public | Register new user (supply `f_name`, `l_name`, `email`, `password`) |
| POST   | `/api/auth/login`           | Public | Login user (returns JWT token)                                     |
| POST   | `/api/auth/logout`          | Auth   | Logout user / invalidate token (optional)                          |
| POST   | `/api/auth/forgot-password` | Public | Request password reset (send OTP/email)                            |
| POST   | `/api/auth/reset-password`  | Public | Reset password using OTP                                           |

User APIs

| Method | Path                    | Access     | Purpose                                                |
| ------ | ----------------------- | ---------- | ------------------------------------------------------ |
| GET    | `/api/users/public/:id` | Public     | Get **public info** of any user (name, role, avatar)   |
| GET    | `/api/users/me`         | Auth       | Get **current logged-in user info** (exclude password) |
| PATCH  | `/api/users/me`         | Auth       | Update logged-in user profile (name, email, avatar)    |
| GET    | `/api/users`            | Admin only | Get list of all users (for admin dashboard)            |
| DELETE | `/api/users/:id`        | Admin only | Delete a user by ID                                    |
| PUT    | `/api/users/me`         | Auth       | Replace the entire user profile (optional, less common)|


Recipe APIs

| Method | Path                         | Access | Purpose                                            |
| ------ | ---------------------------- | ------ | -------------------------------------------------- |
| GET    | `/api/recipes/`              | Auth   | Get **all recipes** (public recipes for all users) |
| GET    | `/api/recipes/mine`          | Auth   | Get **recipes created by current user**            |
| GET    | `/api/recipes/:id`           | Auth   | Get **recipe details by ID**                       |
| POST   | `/api/recipes/`              | Auth   | Create new recipe                                  |
| PATCH  | `/api/recipes/:id`           | Auth   | Update recipe (must belong to user or admin)       |
| DELETE | `/api/recipes/:id`           | Auth   | Delete recipe (must belong to user or admin)       |
| POST   | `/api/recipes/:id/like`      | Auth   | Like a recipe                                      |
| POST   | `/api/recipes/:id/dislike`   | Auth   | Dislike a recipe                                   |
| POST   | `/api/recipes/:id/favourite` | Auth   | Save recipe to favourites                          |
| GET    | `/api/recipes/:id/comments`  | Auth   | Get all comments of a recipe                       |
| POST   | `/api/recipes/:id/comments`  | Auth   | Add comment to recipe                              |
| PUT    | `/api/recipes/:id`           | Auth   | Replace the entire recipe (must send all fields)   |



