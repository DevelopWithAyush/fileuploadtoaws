# AWS S3 Universal File Uploader

A Node.js-based file upload service that replaces Cloudinary-based file uploads with AWS S3 storage. This service handles various file types (images, videos, documents, etc.) and organizes them in appropriate folders.

## Features

- Upload single or multiple files
- Support for various file types (images, videos, documents, etc.)
- Automatic categorization of files into folders based on MIME type
- Returns a consistent response format with public IDs and URLs
- Easy to integrate with existing applications
- Uses ES Modules for modern JavaScript syntax
- Interactive API documentation with Swagger UI
- Support for multiple file fields in a single request

## Folder Structure

```
uploads/
  ├── images/   # For image files (image/*)
  ├── videos/   # For video files (video/*)
  ├── documents/# For document files (PDF, Word, Excel, etc.)
  └── others/   # For all other file types
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

- `POST /api/v1/upload` - Universal file upload endpoint that supports multiple field names

### Request Format

The upload endpoint supports multiple file upload patterns in a single request:

```
POST /api/v1/upload
Content-Type: multipart/form-data

file: [Single file]
documents: [Document1, Document2, ...]
images: [Image1, Image2, ...]
```

You can use any combination of these fields:

- `file` - For uploading a single file (any type)
- `documents` - For uploading document files (up to 5)
- `images` - For uploading image files (up to 5)

All files are processed and stored in the appropriate S3 folders based on their MIME types, regardless of the field name used in the upload.

### Response Format

Success response:

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "public_id": "123e4567-e89b-12d3-a456-426614174000",
      "url": "https://your-bucket.s3.region.amazonaws.com/uploads/images/123e4567-e89b-12d3-a456-426614174000.jpg"
    },
    {
      "public_id": "123e4567-e89b-12d3-a456-426614174001",
      "url": "https://your-bucket.s3.region.amazonaws.com/uploads/documents/123e4567-e89b-12d3-a456-426614174001.pdf"
    },
    {
      "public_id": "123e4567-e89b-12d3-a456-426614174002",
      "url": "https://your-bucket.s3.region.amazonaws.com/uploads/others/123e4567-e89b-12d3-a456-426614174002.txt"
    }
  ]
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
4. For testing file uploads:
   - Find the `/upload` endpoint
   - Click "Try it out"
   - Use the file selectors to choose files for each field (file, documents, images)
   - Click "Execute" to test the upload
   - View the response with the uploaded file details

## Client Integration Examples

### HTML Form Example

```html
<form action="/api/v1/upload" method="post" enctype="multipart/form-data">
  <div>
    <label for="file">Single File:</label>
    <input type="file" name="file" id="file" />
  </div>
  <div>
    <label for="documents">Documents (up to 5):</label>
    <input type="file" name="documents" id="documents" multiple />
  </div>
  <div>
    <label for="images">Images (up to 5):</label>
    <input type="file" name="images" id="images" multiple />
  </div>
  <button type="submit">Upload Files</button>
</form>
```

### JavaScript Fetch API Example

```javascript
const uploadFiles = async () => {
  const formData = new FormData();

  // Add single file
  const singleFile = document.getElementById("file").files[0];
  if (singleFile) {
    formData.append("file", singleFile);
  }

  // Add document files
  const documentFiles = document.getElementById("documents").files;
  for (let i = 0; i < documentFiles.length; i++) {
    formData.append("documents", documentFiles[i]);
  }

  // Add image files
  const imageFiles = document.getElementById("images").files;
  for (let i = 0; i < imageFiles.length; i++) {
    formData.append("images", imageFiles[i]);
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
const handleUpload = async (files) => {
  try {
    const results = await uploadFilesToS3(files);
    console.log(results);
    // [{ public_id: '...', url: '...' }, ...]
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
```

## License

MIT
