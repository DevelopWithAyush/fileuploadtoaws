import { uploadFilesToS3 } from '../utils/uploadFilesToS3.js';

/**
 * Handle single or multiple file uploads
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with uploaded file information
 */
const handleFileUpload = async (req, res) => {
    try {
        // Check if files were provided
        if (!req.files && !req.file) {
            return res.status(400).json({
                success: false,
                message: 'No files were uploaded'
            });
        } 


        let ImagesData = null
        
        if (req.files && req.files.images) {
            const productImages = req.files.images;
            const productImagesResult = await uploadFilesToS3(productImages);
            if (!productImagesResult) {
                return next(new ErrorHandler("Product service video showcase upload failed", 400));
            }
            ImagesData = {
                public_id:  productImagesResult[0].public_id,
                url: productImagesResult[0].url,
            };
        }



        return res.status(200).json({
            success: true,
                count: ImagesData.length,
                data: ImagesData
        });
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Error uploading files'
        });
    }
};

export { handleFileUpload }; 