#!/bin/bash
echo "í´§ Fixing Swagger 'No operations' error..."

# 1. Find and update the Swagger configuration file.
# This assumes your main config is in a file like src/config/swagger.js
CONFIG_FILE="src/config/swagger.js"
if [ ! -f "$CONFIG_FILE" ]; then
    # If not, check if it's in the main server file
    echo "Swagger config not found in src/config/. Checking server.js..."
    CONFIG_FILE="server.js"
    if [ ! -f "$CONFIG_FILE" ]; then
        echo "âš ï¸  Could not find server.js. Looking for app.js..."
        CONFIG_FILE="app.js"
    fi
fi

if [ -f "$CONFIG_FILE" ]; then
    echo "Updating Swagger 'apis' path in $CONFIG_FILE..."
    # Update the 'apis' array to point to the new routes directory
    sed -i "s|apis: \[.*\]|apis: \['./src/routes/*.js'\]|g" "$CONFIG_FILE"
    # Also ensure the base server URL is correct for your local setup
    sed -i "s|url:.*3000.*|url: 'http://localhost:3001',|g" "$CONFIG_FILE"
    echo "âœ… Updated $CONFIG_FILE"
else
    echo "âŒ Could not find main server or Swagger config file. Creating a basic one..."
    # Create a minimal, correct Swagger setup in server.js
    cat > server.js << 'SRVEOF'
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ===== SWAGGER CONFIGURATION (FIXED PATH) =====
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Clear Taxi Go API',
      version: '1.0.0',
      description: 'API for taxi booking with driver profiles'
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'íº€ Development Server'
      },
      {
        url: 'https://clear-tax-updated-backend-nodejs.onrender.com',
        description: 'í¼ Production Server'
      }
    ]
  },
  // *** CRITICAL FIX: Path points to where your route files with @swagger comments are ***
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ===== BASIC ROUTES (for testing) =====
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'clear-taxi-go-api' });
});

console.log(`Swagger looking for docs in: ${swaggerOptions.apis[0]}`);
console.log(`Generated spec has paths: ${Object.keys(swaggerSpec.paths || {}).length}`);

// ===== MOUNT YOUR ROUTES HERE LATER =====
// const routes = require('./src/routes');
// app.use('/api/v1', routes);

app.listen(PORT, () => {
  console.log(`âœ… Server started on port ${PORT}`);
  console.log(`í³š Swagger Docs: http://localhost:${PORT}/api-docs`);
});
SRVEOF
    echo "âœ… Created a new server.js with correct Swagger setup."
fi

# 2. Verify that your route files have JSDoc comments.
echo ""
echo "í³ Verifying your route files in src/routes/ have @swagger tags..."
if ls ./src/routes/*.js 1> /dev/null 2>&1; then
    echo "Found route files. Checking one for @swagger tag..."
    if grep -l "@swagger" ./src/routes/*.js > /dev/null; then
        echo "âœ… Found files with @swagger tags."
    else
        echo "âš ï¸  No '@swagger' tags found in route files. You must add them."
        echo "   Example: Add a comment like /** @swagger */ above your route definitions."
    fi
else
    echo "âš ï¸  No .js files found in ./src/routes/. Ensure your routes are there."
fi

# 3. Restart the server to apply changes.
echo ""
echo "íº€ Restarting the server..."
pkill -f "node server.js" 2>/dev/null
sleep 1
node server.js &
SERVER_PID=$!
sleep 2
echo "í±‰ Please open: http://localhost:3001/api-docs"
echo "   If the error persists, check the console output above."
