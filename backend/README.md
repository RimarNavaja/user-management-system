# User Management System - Backend

## Introduction
A full-stack application for managing user accounts with features like email sign-up, verification, authentication, role-based authorization, and CRUD operations. This backend API built with Node.js and MySQL provides comprehensive user account management functionality.

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/your-username/user-management-system.git
   ```

2. Install Node.js and npm from https://nodejs.org/

3. Install MySQL Community Server from https://dev.mysql.com/downloads/mysql/

4. Navigate to the backend directory:
   ```
   cd user-management-system/backend
   ```

5. Install dependencies:
   ```
   npm install
   ```

6. Configure MySQL database settings in `config.json`

7. Configure email SMTP settings in `config.json` (Ethereal recommended for testing)

8. Start the backend server:
   ```
   npm start
   ```

9. For development with auto-restart:
   ```
   npm run start:dev
   ```

## Usage
1. Register a new account at `/accounts/register`
   - The first registered account automatically becomes an Admin
   - Required fields: title, firstName, lastName, email, password, confirmPassword, acceptTerms

2. Verify your email using the link sent to your inbox
   - Submit the token received in your email to `/accounts/verify-email`

3. Log in at `/accounts/authenticate`
   - Submit email and password
   - Receive a JWT token valid for 15 minutes
   - A refresh token (valid for 7 days) is set as an HTTP-only cookie

4. Password Management
   - Request password reset: `/accounts/forgot-password`
   - Reset password with token: `/accounts/reset-password`

5. Account Management
   - Get all accounts (Admin only): GET `/accounts`
   - Get account by ID: GET `/accounts/:id`
   - Create new account (Admin only): POST `/accounts`
   - Update account: PUT `/accounts/:id`
   - Delete account: DELETE `/accounts/:id`

## Testing
### Functional Testing Results
The backend API has been tested for the following functionality:

1. User Registration
   - ✅ New users can register with valid information
   - ✅ First user automatically receives Admin role
   - ✅ Validation prevents incomplete/invalid registrations
   - ✅ Duplicate email addresses are rejected

2. Email Verification
   - ✅ Verification emails are sent with valid tokens
   - ✅ Accounts are properly marked as verified after token validation
   - ✅ Invalid tokens are rejected

3. Authentication
   - ✅ Valid credentials return JWT and refresh tokens
   - ✅ Invalid credentials are rejected with appropriate error messages
   - ✅ JWT tokens expire after 15 minutes
   - ✅ Refresh tokens work to obtain new JWT tokens
   - ✅ Refresh token rotation prevents token reuse

4. Authorization
   - ✅ Role-based access control functions as expected
   - ✅ Admin users can access admin-only endpoints
   - ✅ Regular users are restricted from admin functionality
   - ✅ Users can only access their own account information

5. Password Management
   - ✅ Password reset flow works end-to-end
   - ✅ Reset tokens expire after 24 hours
   - ✅ Passwords are properly hashed and verified

## Security Testing Results (Tester 2)

### ✅ Unauthorized Access
- All protected endpoints correctly rejected unauthorized access.
- Role-based access control confirmed.

### ✅ SQL Injection
- Input fields protected against SQL injections via ORM & validation.
- Malicious payloads failed to compromise the database.

### ✅ Cross-Site Scripting (XSS)
- Angular frontend automatically escapes HTML.
- User input with script tags or event handlers is rendered harmlessly.

### Conclusion
The system is resilient against basic common vulnerabilities. Recommend routine testing, code linting, and dependency audits for continued protection.


### Bug Fixes
1. Fixed an issue with refresh token validation where active tokens were being incorrectly rejected
   - Problem: The `getRefreshToken` function was checking for `refreshToken.isActive` when it should have been checking for `!refreshToken.isActive`
   - Fix: Changed the condition to properly validate active tokens
   
2. Fixed controller function nesting issue in accounts.controller.js
   - Problem: Functions like `validateResetToken` were incorrectly nested inside other functions
   - Fix: Moved all controller functions to the top level scope for proper routing

3. When testing with Postman:
   - Make sure to enable cookies in Postman settings to properly handle refresh tokens
   - If JWT token changes with every request, verify you're not hitting the authentication endpoint repeatedly
   - For protected endpoints, use Bearer token authentication with the JWT token from login

## Contributing
### Git and GitHub Workflow
1. Create a new branch for each feature or bugfix:
   ```
   git checkout -b feature/feature-name
   ```
   or
   ```
   git checkout -b fix/bug-name
   ```

2. Make small, focused commits with descriptive messages:
   ```
   git commit -m "Add email verification functionality"
   ```

3. Regularly pull changes from main to avoid conflicts:
   ```
   git pull origin main
   ```

4. Push your branch to GitHub:
   ```
   git push origin feature/feature-name
   ```

5. Create a pull request in GitHub for code review.

6. After approval, merge the pull request into main.

### Best Practices
1. **Commit Often:** Make small, frequent commits with clear messages.
2. **Use Descriptive Branch Names:** Name branches based on their purpose.
3. **Review Code Before Merging:** Always review pull requests.
4. **Keep Branches Updated:** Regularly pull from main.
5. **Communicate with Your Team:** Use GitHub issues or comments to discuss tasks and updates.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

---

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