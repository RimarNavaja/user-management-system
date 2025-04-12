require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const errorHandler = require('_middleware/error-handler');
const swaggerUi = require('./swagger');

// Allow cross-origin requests
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

// Parse request body and cookies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Swagger API documentation
app.use('/api-docs', swaggerUi);

// API routes
app.use('/accounts', require('./accounts/accounts.controller'));

// Global error handler
app.use(errorHandler);

// Start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));
