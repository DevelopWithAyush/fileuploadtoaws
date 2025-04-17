import express from 'express';
import { handleFileUpload } from '../controllers/uploadController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Universal file upload endpoint
 *     description: Uploads files to AWS S3 with support for multiple field names
 *     tags: [Uploads]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Single file to upload (any type)
 *               documents:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Document files to upload (up to 5)
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Image files to upload (up to 5)
 *     responses:
 *       200:
 *         description: Files successfully uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       public_id:
 *                         type: string
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                       url:
 *                         type: string
 *                         example: "https://bucket-name.s3.region.amazonaws.com/uploads/images/123e4567-e89b-12d3-a456-426614174000.jpg"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No files were uploaded"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error uploading files to S3"
 */
router.post('/upload', upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'documents', maxCount: 5 },
    { name: 'images', maxCount: 1 }
]), handleFileUpload);

export default router;