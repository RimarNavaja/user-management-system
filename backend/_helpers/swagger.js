const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

module.exports = router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
