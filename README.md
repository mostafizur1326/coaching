# User Authentication System

## Description
This project implements a user and admin registration and authentication system with optional email verification using OTP. It is built using **Node.js**, **Express.js**, **MongoDB**, and **Nodemailer**. Additionally, it includes an admin dashboard for managing students, teachers, posts, results, and fees.

---

## Features

### **User Features**
1. **User Registration**: New users can register with their details.
2. **Email Verification**: OTP-based email verification after registration.
3. **User Login**: Users can log in using their email and password.
4. **Password Encryption**: Secure password storage using bcrypt.js.
5. **JWT Authentication**: Token-based user sessions.
6. **Logout**: Token clearing for user logout.
7. **Error Handling**: Handles invalid inputs, mismatched passwords, and more.

---

### **Admin Features**
1. **Admin Registration**: Admin can register only once.
2. **Admin Login**: Secure login system for administrators.
3. **Admin Dashboard**: Provides quick access to management functionalities.
4. **Manage Students**: View and handle all student data.
5. **Manage Teachers**: View and handle all teacher data.
6. **Post Management**: Manage posts like announcements, blogs, or notices.
7. **Result Management**: Oversee student results or performance data.
8. **Fees Management**: Handle payment records and fee structures.
9. **Secure Access**: Admin routes are protected via token-based authentication and middleware.

---

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Security**: bcrypt.js, JWT (Token-based Authentication)
- **Email Service**: Nodemailer (Optional)
- **Middleware**: Custom middleware for session management and route protection.

---

## Live Demo

You can access the live version of the project here:  

[**Visit the Website**](https://stec.onrender.com)  

Simply click the link above to explore the full functionality of the user and admin authentication system, including management features.