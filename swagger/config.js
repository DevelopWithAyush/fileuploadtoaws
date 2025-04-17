import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'AWS S3 File Uploader API',
            version: '1.0.0',
            description: 'API documentation for AWS S3 File Uploader service',
            contact: {
                name: 'API Support',
                url: 'https://github.com/yourusername/aws-file-uploader',
            },
        },
        servers: [
            {
                url: '/api/v1',
                description: 'API v1',
            },
        ],
        components: {
            schemas: {
                UploadResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            description: 'Indicates if the upload was successful',
                            example: true,
                        },
                        count: {
                            type: 'integer',
                            description: 'Number of files uploaded',
                            example: 2,
                        },
                        data: {
                            type: 'array',
                            description: 'Array of uploaded file information',
                            items: {
                                type: 'object',
                                properties: {
                                    public_id: {
                                        type: 'string',
                                        description: 'UUID of the uploaded file',
                                        example: '123e4567-e89b-12d3-a456-426614174000',
                                    },
                                    url: {
                                        type: 'string',
                                        description: 'URL of the uploaded file',
                                        example: 'https://your-bucket.s3.region.amazonaws.com/uploads/images/123e4567-e89b-12d3-a456-426614174000.jpg',
                                    },
                                },
                            },
                        },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            description: 'Indicates if the request was successful',
                            example: false,
                        },
                        message: {
                            type: 'string',
                            description: 'Error message',
                            example: 'No files were uploaded',
                        },
                    },
                },
            },
        },
    },
    // Paths to the API docs
    apis: ['./routes/*.js', './index.js'],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec; 