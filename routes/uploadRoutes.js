import express from 'express';
import { handleFileUpload } from '../controllers/uploadController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Image upload endpoint
 *     description: Uploads a single image file to AWS S3
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
 *               images:
 *                 type: string
 *                 format: binary
 *                 description: Single image file to upload
 *     responses:
 *       200:
 *         description: Image successfully uploaded
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
 *                   example: 1
 *                 data:
 *                   type: object
 *                   properties:
 *                     public_id:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     url:
 *                       type: string
 *                       example: "https://gro8-s3.s3.ap-south-1.amazonaws.com/uploads/images/123e4567-e89b-12d3-a456-426614174000.jpg"
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
    { name: 'images', maxCount: 1 }
]), handleFileUpload);

export default router;