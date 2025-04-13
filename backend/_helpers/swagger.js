const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');

// Define swagger JSON directly instead of loading from a file
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "User Management System API",
    description: "API for user management with authentication, verification, and account management",
    version: "1.0.0"
  },
  servers: [
    {
      url: "http://localhost:4000",
      description: "Development server"
    }
  ],
  paths: {
    "/accounts/register": {
      post: {
        summary: "Register a new user account",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string", example: "Mr" },
                  firstName: { type: "string", example: "John" },
                  lastName: { type: "string", example: "Doe" },
                  email: { type: "string", example: "john.doe@example.com" },
                  password: { type: "string", example: "Pass123!" },
                  confirmPassword: { type: "string", example: "Pass123!" },
                  acceptTerms: { type: "boolean", example: true }
                },
                required: ["title", "firstName", "lastName", "email", "password", "confirmPassword", "acceptTerms"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Registration successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Registration successful, please check your email for verification instructions"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/accounts/verify-email": {
      post: {
        summary: "Verify email address",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: {
                    type: "string",
                    example: "verification-token-from-email"
                  }
                },
                required: ["token"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Verification successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Verification successful, you can now login"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/accounts/authenticate": {
      post: {
        summary: "Authenticate user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    example: "john.doe@example.com"
                  },
                  password: {
                    type: "string",
                    example: "Pass123!"
                  }
                },
                required: ["email", "password"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Authentication successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "integer", example: 1 },
                    firstName: { type: "string", example: "John" },
                    lastName: { type: "string", example: "Doe" },
                    email: { type: "string", example: "john.doe@example.com" },
                    role: { type: "string", example: "User" },
                    jwtToken: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/accounts/refresh-token": {
      post: {
        summary: "Refresh token",
        responses: {
          "200": {
            description: "Token refresh successful"
          }
        }
      }
    },
    "/accounts/forgot-password": {
      post: {
        summary: "Request password reset",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    example: "john.doe@example.com"
                  }
                },
                required: ["email"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Password reset email sent"
          }
        }
      }
    },
    "/accounts/reset-password": {
      post: {
        summary: "Reset password with token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: {
                    type: "string",
                    example: "reset-token-from-email"
                  },
                  password: {
                    type: "string",
                    example: "NewPass123!"
                  },
                  confirmPassword: {
                    type: "string",
                    example: "NewPass123!"
                  }
                },
                required: ["token", "password", "confirmPassword"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Password reset successful"
          }
        }
      }
    }
  }
};

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;
