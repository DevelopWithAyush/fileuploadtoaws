# AWS S3 Universal File Uploader

A Node.js-based file upload service that replaces Cloudinary-based file uploads with AWS S3 storage. This service handles image file uploads and stores them securely in S3.

## Features

- Upload single image files
- Automatic organization of images in appropriate folders
- Returns a consistent response format with public IDs and URLs
- Easy to integrate with existing applications
- Uses ES Modules for modern JavaScript syntax
- Interactive API documentation with Swagger UI

## Folder Structure

```
uploads/
  ├── images/   # For image files (image/*)
  ├── videos/   # For video files (video/*) - supported by the utility, not exposed in API
  ├── documents/# For document files (PDF, Word, Excel, etc.) - supported by the utility, not exposed in API
  └── others/   # For all other file types - supported by the utility, not exposed in API
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables (copy `.env.example` to `.env` and fill in your AWS credentials)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name
```

## Running the Application

```
# Development mode
npm run dev

# Production mode
npm start
```

## API Documentation

The API is documented using Swagger UI, which provides an interactive interface to explore and test the API endpoints.

- Access the Swagger UI at: `http://localhost:3000/api-docs`
- This interface allows you to:
  - View detailed API documentation
  - Test endpoints directly in the browser
  - See request and response formats
  - Understand authentication requirements

## API Endpoints

### Upload Endpoint

- `POST /api/v1/upload` - Image upload endpoint that accepts a single image file

### Request Format

The upload endpoint accepts a single image upload:

```
POST /api/v1/upload
Content-Type: multipart/form-data

images: [Image file]
```

The API currently supports:

- `images` - For uploading a single image file

The image will be processed and stored in the S3 `uploads/images/` folder based on its MIME type.

### Response Format

Success response:

```json
{
  "success": true,
  "count": 1,
  "data": {
    "public_id": "123e4567-e89b-12d3-a456-426614174000",
    "url": "https://gro8-s3.s3.ap-south-1.amazonaws.com/uploads/images/123e4567-e89b-12d3-a456-426614174000.jpg"
  }
}
```

Error response:

```json
{
  "success": false,
  "message": "Error message here"
}
```

## Testing with Swagger UI

1. Start the server with `npm run dev`
2. Navigate to `http://localhost:3000/api-docs` in your browser
3. You'll see the upload endpoint with documentation
4. For testing image upload:
   - Find the `/upload` endpoint
   - Click "Try it out"
   - Use the file selector to choose an image file for the `images` field
   - Click "Execute" to test the upload
   - View the response with the uploaded image details

## Client Integration Examples

### HTML Form Example

```html
<form action="/api/v1/upload" method="post" enctype="multipart/form-data">
  <div>
    <label for="images">Image:</label>
    <input type="file" name="images" id="images" accept="image/*" />
  </div>
  <button type="submit">Upload Image</button>
</form>
```

### JavaScript Fetch API Example

```javascript
const uploadImage = async () => {
  const formData = new FormData();

  // Add image file
  const imageFile = document.getElementById("images").files[0];
  if (imageFile) {
    formData.append("images", imageFile);
  } else {
    throw new Error("Please select an image to upload");
  }

  try {
    const response = await fetch("/api/v1/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    console.log("Upload success:", result);
    return result;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};
```

## AWS S3 Configuration

### Making Uploaded Files Publicly Accessible

By default, S3 objects are private. To make uploaded files publicly accessible, you need to configure your S3 bucket properly:

#### For Buckets with "ACLs Disabled" (Modern S3 Buckets)

If you get the error `The bucket does not allow ACLs`, follow these steps instead:

1. **Set Up a Bucket Policy**:
   - Go to your S3 bucket's "Permissions" tab
   - Under "Bucket Policy", click "Edit"
   - Add this policy (replace `gro8-s3` with your bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::gro8-s3/uploads/*"
    }
  ]
}
```

2. **Modify Block Public Access Settings**:

   - In the same Permissions tab, under "Block Public Access"
   - Uncheck "Block public access to buckets and objects granted through new public bucket policies"
   - Save changes (you'll need to type "confirm")

3. **Detailed Guide**:
   - For more instructions, see [S3 Policy Without ACLs](docs/S3-Policy-Without-ACLs.md)

#### For Buckets with "ACLs Enabled" (Legacy Configuration)

If your bucket supports ACLs, you can enable the `ACL: 'public-read'` parameter in the `uploadFilesToS3.js` file and:

1. **Configure Bucket Permissions**:

   - Under "Block Public Access", uncheck options related to ACLs
   - Under "Object Ownership", ensure "ACLs enabled" is selected

2. **Detailed Guide**:
   - For more information, see [S3 Configuration Guide](docs/S3-Setup-Guide.md)

### Required IAM Permissions

The IAM user associated with your AWS credentials needs the following permissions:

- `s3:PutObject` - To upload files
- `s3:GetObject` - To retrieve files
- `s3:ListBucket` - To list bucket contents
- `s3:PutObjectAcl` - Only if you're using ACLs (not needed for bucket policy approach)

## Usage from Code

You can use the `uploadFilesToS3` utility directly in your code:

```javascript
import { uploadFilesToS3 } from "./utils/uploadFilesToS3.js";

// Example usage
const handleImageUpload = async (imageFile) => {
  try {
    const results = await uploadFilesToS3([imageFile]);
    console.log(results);
    // [{ public_id: '...', url: '...' }]
    return results[0]; // Return the first (and only) result
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};
```

## License

MIT
