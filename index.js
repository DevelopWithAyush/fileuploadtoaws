import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import uploadRoutes from './routes/uploadRoutes.js';
import swaggerSpec from './swagger/config.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'AWS S3 File Uploader API Documentation',
}));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health check endpoint
 *     description: Check if the service is running
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: AWS S3 File Upload Service is running
 *                 status:
 *                   type: string
 *                   example: healthy
 */
// Health check route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'AWS S3 File Upload Service is running',
        status: 'healthy'
    });
});

// Upload routes
app.use('/api/v1', uploadRoutes);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Resource not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Documentation available at: http://localhost:${PORT}/api-docs`);
    console.log(`S3 Bucket: ${process.env.S3_BUCKET_NAME}`);
    console.log(`AWS Region: ${process.env.AWS_REGION}`);
}); 