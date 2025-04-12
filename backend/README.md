# User Management System - Backend

## Overview
This is the backend API for the User Management System built with Node.js and MySQL. The API provides functionality for email sign-up, verification, authentication, role-based authorization, forgot password/reset password, and CRUD operations for account management.

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
