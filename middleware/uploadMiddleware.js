import multer from 'multer';

// Configure storage to memory buffer
const storage = multer.memoryStorage();

// Create a multer instance
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
});

export { upload }; 