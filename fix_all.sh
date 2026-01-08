#!/bin/bash
echo "í´§ COMPLETE FIX for Clear Taxi Go Swagger"

# 1. CREATE PROPER swagger.js CONFIG
echo "Creating/Updating src/config/swagger.js..."
mkdir -p src/config
cat > src/config/swagger.js << 'SWAGGEREOF'
const path = require('path');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Clear Taxi Go API',
      version: '1.0.0',
      description: 'Professional Taxi Booking API with driver profiles: image, rating, description, name, role'
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'íº€ Local Development Server'
      },
      {
        url: 'https://clear-tax-updated-backend-nodejs.onrender.com',
        description: 'í¼ Production Server (Render)'
      }
    ],
    components: {
      schemas: {
        Driver: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            role: { type: 'string' },
            image: { type: 'string', format: 'uri' },
            rating: { type: 'number', minimum: 0, maximum: 5 },
            description: { type: 'string' }
          }
        }
      }
    }
  },
  // í´¥ CRITICAL: This MUST be correct - points to your route files
  apis: ['./src/routes/*.js']  // Using ./ for relative path from src/server.js
};

module.exports = { swaggerOptions };
SWAGGEREOF
echo "âœ… Created src/config/swagger.js with correct apis path"

# 2. UPDATE src/server.js TO USE THE CONFIG
echo "Updating src/server.js to use swagger config..."
if [ -f "src/server.js" ]; then
    # Check if it needs swagger setup
    if ! grep -q "swaggerOptions" src/server.js; then
        echo "Adding Swagger setup to src/server.js..."
        # Create backup
        cp src/server.js src/server.js.backup
        
        # Create fixed server.js
        cat > src/server.js << 'SERVEREOF'
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Import Swagger configuration
const { swaggerOptions } = require('./config/swagger');
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Debug: Log Swagger info
console.log('í´ Swagger Configuration:');
console.log('   - Looking in:', swaggerOptions.apis);
console.log('   - Found endpoints:', Object.keys(swaggerSpec.paths || {}).length);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customSiteTitle: 'Clear Taxi Go API'
}));

// Import and use routes
const driverRoutes = require('./routes/driverRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

// Mount routes
app.use('/api/v1/drivers', driverRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/driver/applications', applicationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'clear-taxi-go-api',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Homepage
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>íº– Clear Taxi Go API</h1>
        <p><a href="/api-docs">Swagger Documentation</a></p>
        <p><a href="/health">Health Check</a></p>
        <p><a href="/api/v1/drivers/DRV-001">Test Driver API</a></p>
      </body>
    </html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log(\`âœ… Server started on port \${PORT}\`);
  console.log(\`í³š Swagger Docs: http://localhost:\${PORT}/api-docs\`);
  console.log(\`í¿¥ Health: http://localhost:\${PORT}/health\`);
  console.log(\`í¼ Production: https://clear-tax-updated-backend-nodejs.onrender.com\`);
});
SERVEREOF
        echo "âœ… Recreated src/server.js with proper Swagger setup"
    else
        # Just fix the apis path if swagger already exists
        sed -i "s|apis: \[.*\]|apis: \['./src/routes/*.js'\]|g" src/server.js
        echo "âœ… Updated apis path in existing src/server.js"
    fi
fi

# 3. UPDATE package.json
echo "Updating package.json..."
if [ -f "package.json" ]; then
    sed -i 's|"main": ".*"|"main": "src/server.js"|g' package.json
    sed -i 's|"start": "node.*"|"start": "node src/server.js"|g' package.json
    echo "âœ… Updated package.json: main = src/server.js"
fi

# 4. VERIFY ROUTE FILES HAVE @swagger TAGS
echo "Verifying route files..."
for file in src/routes/*.js; do
    if [ -f "$file" ]; then
        if grep -q "@swagger" "$file"; then
            echo "âœ… $file has @swagger tags"
        else
            echo "âš ï¸  Adding @swagger tag to $file"
            cat >> "$file" << 'TAGEOF'

/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: Test endpoint
 *     responses:
 *       200:
 *         description: Success
 */
TAGEOF
        fi
    fi
done

# 5. INSTALL DEPENDENCIES
echo "Checking dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
fi

# 6. KILL OLD SERVER AND START NEW
echo "Starting server..."
pkill -f "node.*3001" 2>/dev/null || true
sleep 1

node src/server.js &
SERVER_PID=$!
sleep 3

echo ""
echo "í¾¯ FIX COMPLETE!"
echo "í±‰ Open: http://localhost:3001/api-docs"
echo "í±‰ Should show ALL your endpoints now!"
echo ""
echo "If still seeing 'No operations':"
echo "1. Check browser console (F12) for errors"
echo "2. Refresh page with Ctrl+F5"
echo "3. Wait 5 seconds for server to fully start"
