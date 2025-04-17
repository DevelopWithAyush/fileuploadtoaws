import { uploadFilesToS3 } from '../utils/uploadFilesToS3.js';

/**
 * Handle single image file upload
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with uploaded image information
 */
const handleFileUpload = async (req, res) => {
    try {
        // Check if files were provided
        if (!req.files || !req.files.images || req.files.images.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No image was uploaded'
            });
        }

        let imageData = null;

        // Process the image upload
        const imageFile = req.files.images;
        const imageUploadResult = await uploadFilesToS3(imageFile);

        if (!imageUploadResult || imageUploadResult.length === 0) {
            return res.status(500).json({
                success: false,
                message: 'Image upload failed'
            });
        }

        // Extract image data
        imageData = {
            public_id: imageUploadResult[0].public_id,
            url: imageUploadResult[0].url,
        };

        // Return successful response
        return res.status(200).json({
            success: true,
            count: 1,
            data: imageData
        });
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error uploading image to S3'
        });
    }
};

export { handleFileUpload }; 