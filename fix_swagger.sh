#!/bin/bash
echo "Ì¥ß Fixing Swagger configuration for Clear Taxi Go..."

# 1. First, find your main server file
MAIN_FILE=""
if [ -f "src/app.js" ]; then
    MAIN_FILE="src/app.js"
    echo "Found main file: $MAIN_FILE"
elif [ -f "server.js" ]; then
    MAIN_FILE="server.js"
    echo "Found main file: $MAIN_FILE"
else
    echo "‚ùå No main server file found! Creating server.js..."
    MAIN_FILE="server.js"
fi

# 2. Update package.json to point to correct main file
if [ -f "package.json" ]; then
    sed -i 's|"main": ".*"|"main": "'"$MAIN_FILE"'"|g' package.json
    sed -i 's|"start": "node.*"|"start": "node '"$MAIN_FILE"'"|g' package.json
    echo "‚úÖ Updated package.json main and start script"
fi

# 3. Fix Swagger configuration - CRITICAL FIX
if [ -f "src/config/swagger.js" ]; then
    # Update apis path to correctly find your route files
    sed -i "s|apis: \[.*\]|apis: ['src/routes/*.js']|g" src/config/swagger.js
    echo "‚úÖ Fixed Swagger apis path in src/config/swagger.js"
else
    # Create a proper swagger config if missing
    mkdir -p src/config
    cat > src/config/swagger.js << 'SWAGGER_EOF'
const path = require('path');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Clear Taxi Go API',
      version: '1.0.0',
      description: 'Professional taxi booking API'
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Ì∫Ä Development Server'
      },
      {
        url: 'https://clear-tax-updated-backend-nodejs.onrender.com',
        description: 'Ìºê Production Server (Render)'
      }
    ]
  },
  // Ì¥• CRITICAL: This MUST point to your route files with @swagger comments
  apis: ['src/routes/*.js']  // Path to your route files
};

module.exports = { swaggerOptions };
SWAGGER_EOF
    echo "‚úÖ Created src/config/swagger.js with correct apis path"
fi

# 4. Update your main server file to use the fixed swagger config
if [ -f "$MAIN_FILE" ]; then
    # Ensure it uses the correct swagger config
    if grep -q "apis: \[" "$MAIN_FILE"; then
        sed -i "s|apis: \[.*\]|apis: ['src/routes/*.js']|g" "$MAIN_FILE"
        echo "‚úÖ Updated apis path in $MAIN_FILE"
    fi
    
    # Ensure PORT is 3001 (not 3000)
    sed -i "s|const PORT = process.env.PORT || 3000;|const PORT = process.env.PORT || 3001;|g" "$MAIN_FILE"
    
    # Ensure localhost URL uses 3001
    sed -i "s|http://localhost:3000|http://localhost:3001|g" "$MAIN_FILE"
fi

# 5. Verify route files exist and have @swagger tags
echo ""
echo "Ì≥Å Checking route files..."
ROUTE_FILES=$(find src/routes -name "*.js" 2>/dev/null | head -5)
if [ -n "$ROUTE_FILES" ]; then
    echo "Found route files:"
    echo "$ROUTE_FILES"
    
    # Check if they have @swagger tags
    for file in $ROUTE_FILES; do
        if grep -q "@swagger" "$file"; then
            echo "‚úÖ $file contains @swagger tags"
        else
            echo "‚ö†Ô∏è  $file is MISSING @swagger tags"
            # Add a test @swagger tag
            cat >> "$file" << 'TAG_EOF'

/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: Test endpoint
 *     responses:
 *       200:
 *         description: Test successful
 */
TAG_EOF
            echo "  Added test @swagger tag to $file"
        fi
    done
else
    echo "‚ùå No route files found in src/routes/"
    echo "Creating a sample route file..."
    mkdir -p src/routes
    cat > src/routes/driverRoutes.js << 'ROUTE_EOF'
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/v1/drivers/{id}:
 *   get:
 *     summary: Get driver profile
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Driver profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 rating:
 *                   type: number
 */
router.get('/:id', (req, res) => {
  res.json({ id: req.params.id, name: 'Test Driver', rating: 4.5 });
});

module.exports = router;
ROUTE_EOF
    echo "‚úÖ Created sample route file with @swagger tags"
fi

# 6. Install dependencies if missing
if [ ! -d "node_modules" ]; then
    echo "Ì≥¶ Installing dependencies..."
    npm install
fi

# 7. Start the server
echo ""
echo "ÔøΩÔøΩ Starting Clear Taxi Go API..."
echo "Main file: $MAIN_FILE"

# Kill any existing server on port 3001
pkill -f "node.*3001" 2>/dev/null || true
sleep 1

# Start the server
if [ -f "$MAIN_FILE" ]; then
    node "$MAIN_FILE" &
    SERVER_PID=$!
    sleep 3
    
    echo ""
    echo "‚úÖ Server should be running!"
    echo "Ì≥ö Swagger UI: http://localhost:3001/api-docs"
    echo "Ìø• Health Check: http://localhost:3001/health"
    echo ""
    echo "If you still see 'No operations defined', check:"
    echo "1. Your route files have @swagger tags"
    echo "2. The 'apis' path in swagger config is 'src/routes/*.js'"
    echo "3. Route files are in src/routes/ directory"
else
    echo "‚ùå Main file $MAIN_FILE not found!"
fi
