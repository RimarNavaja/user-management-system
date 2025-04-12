# User Management System - Backend

## What's this all about?
Hey there! This is the backend part of our User Management System built with Node.js and MySQL. I've implemented the email sign-up, verification, and authentication features. This API handles all the user account stuff like registering new users, verifying their emails, logging them in securely, and managing their accounts.

## What can this API do?
- Register new users and send verification emails ✉️
- Verify user emails with secure tokens 🔒
- Handle user login with JWT (those fancy tokens that keep you logged in) 🔑
- Support different user roles (Admin/User)
- Let users reset their password when they inevitably forget it 🤦‍♂️
- Manage user accounts with all the usual CRUD operations
- Comes with nice API docs via Swagger

## How it's organized
The code follows a pretty standard structure:
```
backend/
├── _helpers/           # Utility stuff
├── _middleware/        # Express middleware
├── accounts/           # All the account-related code
│   ├── account.model.js 
│   ├── refresh-token.model.js
│   ├── account.service.js      # Where the magic happens
│   └── accounts.controller.js  # Routes and request handling
├── config.json         # Settings for DB, email, etc.
├── server.js           # Starts everything up
└── swagger.yaml        # API documentation
```

## Getting started
1. Make sure you have Node.js and MySQL installed
2. Clone the repo
3. Run `npm install` to get all the dependencies
4. Set up your MySQL database credentials in `config.json` 
   (Pro tip: double-check your password - spent hours debugging once because of a typo here 😅)
5. For email testing, I recommend Ethereal (https://ethereal.email/) - super easy to set up!
6. Fire it up with `npm start` (or `npm run start:dev` if you're making changes)
7. Check if it's working by going to http://localhost:4000/api-docs

## My implementation of registration and authentication

### User Sign-Up
The sign-up process is pretty cool - the first person to register automatically becomes an Admin (so you might want to register yourself first!). Everyone else gets the regular User role.

How it works:
- Call `POST /accounts/register` with user details
- System checks if the email is already used
- Password gets encrypted (never store plain passwords!)
- A verification token is generated and emailed to the user
- User data is saved to the database

Watch out for: Make sure your email configuration is correct, otherwise verification emails won't be sent and users will be stuck!

### Email Verification
After registering, users need to verify their email before they can log in. This helps prevent fake accounts and ensures we have a valid email address.

How to test this:
1. Register a new account
2. Check the verification email (or console if using Ethereal)
3. Use the token to verify the account with `POST /accounts/verify-email`

I hit a small challenge with token generation - had to make sure they're random enough and can't be guessed.

### Login (Authentication)
The authentication system uses two types of tokens:
- A short-lived JWT token (15 minutes) for API access
- A longer-lived refresh token (7 days) stored in an HTTP-only cookie

This approach gives us good security while keeping users logged in. The refresh token can't be accessed by JavaScript (bye-bye XSS attacks!), and we use token rotation so each refresh token can only be used once.

If you're testing this and get a "token expired" error, just call the refresh-token endpoint to get a new JWT.

## A few tips from my experience
- When testing with Postman, remember to enable "cookies" in the settings to properly handle refresh tokens
- If you're getting database connection errors, check that your MySQL service is running
- The error messages are intentionally vague for security (e.g., "email or password is incorrect" instead of specifying which one)
- For quick testing, I found that using an Ethereal email account saves a ton of time

## What to improve next
- Add rate limiting to prevent brute force attacks
- Set up proper logging for security audits
- Maybe add social login options (Google, Facebook, etc.)

If you have any questions about my part of the implementation, feel free to reach out! Hope this helps you understand how the authentication system works.

## Features
- Email sign-up and verification
- JWT authentication with refresh tokens
- Role-based authorization (Admin and User roles)
- Forgot password and reset password functionality
- Account management (CRUD operations)
- Swagger API documentation

## Project Structure
```
backend/
├── _helpers/           # Helper files
│   ├── db.js           # MySQL database wrapper using Sequelize
│   ├── role.js         # Role object/enum
│   ├── send-email.js   # Email sending helper
│   └── swagger.js      # Swagger API docs route handler
├── _middleware/        # Express.js middleware
│   ├── authorize.js    # Authentication and authorization middleware
│   ├── error-handler.js # Global error handler middleware
│   └── validate-request.js # Request validation middleware
├── accounts/           # Accounts feature folder
│   ├── account.model.js # Sequelize account model
│   ├── refresh-token.model.js # Sequelize refresh token model
│   ├── account.service.js # Business logic for accounts
│   └── accounts.controller.js # Express.js accounts controller
├── config.json         # API configuration
├── package.json        # Project configuration
├── server.js           # Server startup file
└── swagger.yaml        # Swagger API documentation
```

## Installation
1. Install Node.js and npm from https://nodejs.org/
2. Install MySQL Community Server from https://dev.mysql.com/downloads/mysql/
3. Clone the repository
4. Install dependencies:
```
npm install
```
5. Configure MySQL database settings in config.json
6. Configure email SMTP settings in config.json
7. Start the server:
```
npm start
```

## API Documentation
Once the server is running, access the Swagger API documentation at:
```
http://localhost:4000/api-docs
```

## Development
To start the server in development mode with automatic restarting:
```
npm run start:dev
```

## Implemented Features

### Email Sign-Up
The registration feature allows users to create accounts in the system. The first registered account automatically becomes an Admin, and subsequent registrations are assigned the User role.

#### Implementation Details:
- Registration endpoint: `POST /accounts/register`
- Required fields: title, firstName, lastName, email, password, confirmPassword, acceptTerms
- Password is securely hashed using bcrypt before storage
- Verification token is generated and sent via email
- Registration prevents duplicate email addresses

#### Code Workflow:
1. The controller receives the registration request (`accounts.controller.js`)
2. Validation schema ensures all required fields are present (`registerSchema()`)
3. Account service processes the registration (`account.service.js:register()`)
4. Password is hashed for security
5. Account is created in the database
6. Verification email is sent to the user

### Email Verification
After registration, users must verify their email addresses before they can log in. This is done via a unique token sent to their email.

#### Implementation Details:
- Verification endpoint: `POST /accounts/verify-email`
- Required field: token (received via email)
- Verification marks the account as verified and allows login

#### Code Workflow:
1. User submits verification token from email
2. Controller validates the token format (`verifyEmailSchema()`)
3. Account service verifies the token (`verifyEmail()`)
4. Upon successful verification, account is updated with verification timestamp
5. User can now authenticate and access the system

### Authentication
The authentication system uses JWT tokens for securing API endpoints and stateless authentication.

#### Implementation Details:
- Authentication endpoint: `POST /accounts/authenticate`
- Required fields: email, password
- Upon successful authentication:
  - Returns a JWT token (valid for 15 minutes)
  - Sets a HTTP-only cookie with a refresh token (valid for 7 days)
- Security features:
  - JWT tokens are signed with a secret key
  - Refresh tokens implement rotation (each use creates a new token)
  - Password verification uses secure bcrypt comparison

#### Code Workflow:
1. User submits email and password
2. Controller validates input format (`authenticateSchema()`)
3. Account service authenticates the credentials (`authenticate()`)
4. Passwords are compared using bcrypt
5. JWT token and refresh token are generated
6. Refresh token is saved to database and set as an HTTP-only cookie
7. User details and JWT token are returned in the response

### Refresh Token Mechanism
The system implements token rotation for enhanced security. When a refresh token is used, it's revoked and replaced with a new one.
