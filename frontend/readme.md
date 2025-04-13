# User Management System

## Introduction

This project provides a comprehensive boilerplate for an Angular application featuring a robust sign-up and authentication system. It's designed to run out-of-the-box with a fake backend for easy testing and development, but can be easily configured to connect to a real backend API.

## Team Members & Responsibilities
### Frontend Developers
1. **Rimar Navaja** - Email Sign-Up, Verification, and Authentication
   - Implement email sign-up functionality
   - Implement email verification process
   - Implement authentication system
   - Branch: `frontend-signup-auth`

2. *Therese Andrei Arcenal* - Profile Management, Admin Dashboard, and Fake Backend
   - Implement profile management system
   - Implement admin dashboard
   - Implement fake backend for development
   - Branch: frontend-profile-admin-fake-backend


### Key Features

### Authentication (Developer 1)
- User registration
- Email verification
- Login/Logout
- JWT token management

### User Management (Developer 2)
- Profile management
- Admin dashboard
- User list and management
- Role-based access control
- Fake backend implementation




## Installation

1. Clone the repository:

```bash
git clone https://github.com/RimarNavaja/user-management-system
cd user-management-system/frontend
```

2. Install dependencies:

```bash
npm install
```

- **Troubleshooting:** If you encounter peer dependency errors during `npm install` (common with different Node/npm versions), npm might suggest running the command with `--force` or `--legacy-peer-deps`. Use these flags cautiously as they might lead to unexpected behavior.
  ```bash
  npm install --force # OR
  npm install --legacy-peer-deps
  ```

3. Start the development server:

```bash
ng serve
```

- This typically runs `ng serve --open`. The application will be available at `http://localhost:4200/`.
- **Troubleshooting:** If `npm start` fails because the Angular CLI (`ng`) is not globally installed or found in the path, you can try running it directly using `npx`:
  ```bash
  npx ng serve --open
  ```

4. Open your browser and navigate to:

```
http://localhost:4200
```

5. **(Optional) Switch to a Real Backend:**
   - The application uses a fake backend by default, configured in `/src/app/app.module.ts`.
   - To connect to a real backend API, remove or comment out the fake backend provider lines in `app.module.ts` as indicated by the comments in the file.
   - Ensure your backend API base URL is correctly configured in the environment files (`/src/environments/environment.ts` and `/src/environments/environment.prod.ts`).

## Usage

1. **Registration**

   - Navigate to `/account/register`
   - Fill in required details (name, email, password)
   - Accept terms and conditions
   - Verify email through the link sent to your inbox

2. **Verification:**
   Because the default setup uses a fake backend that cannot send real emails, a "verification email" message will be displayed directly on the screen after registration. Click the verification link provided in this message.

3. **Authentication**

   - Login at `/account/login`
   - Use forgot password feature if needed
   - Automatic token refresh handling

4. *User Features:* Logged-in users can:
   - View the home page.
   - Access their profile section to view details.
   - Update their profile information (name, email, password).
   - Log out.
   - Use the forgot/reset password flow if needed.
5. *Admin Features:* Users logged in with the Admin role can perform all user actions, plus:
   - Access the Admin section.
   - View a list of all registered user accounts.
   - Create new user accounts.
   - Edit existing user accounts.
   - Delete user accounts.


## tester-functional-testing

###  Registration
 - Successful registration with valid data
 -  Error on duplicate email


### Login
 - Successful login with correct credentials
 - Error shown with wrong password


### Profile Update
 - Can update name and email
 - Password change works


### Admin Dashboard
 - Admin can view all users
 - Admin can delete users






## Contributing

1.  **Fork** the repository.
2.  Create a new **branch** for your feature or bug fix (`git checkout -b feature/your-feature-name` or `bugfix/issue-description`).
3.  Make your changes, adhering to the project's coding style and conventions.
4.  Ensure your changes are well-tested.
5.  **Commit** your changes with descriptive messages.
6.  **Push** your branch to your fork (`git push origin feature/your-feature-name`).
7.  Submit a **Pull Request** (PR) to the main repository's `main` or `develop` branch.
8.  Clearly describe the purpose and changes of your PR.

### Coding Standards

- Follow Angular style guide
- Write meaningful commit messages
- Include tests for new features
- Update documentation as needed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Angular team for the framework
- Bootstrap for UI components
- Group D for development contributions
