# S3 Bucket Configuration Guide

This guide walks you through setting up your S3 bucket correctly to allow public access to uploaded files.

## Issue: Access Denied Error

If you're getting an error like this when trying to access an uploaded file:

```xml
<Error>
  <Code>AccessDenied</Code>
  <Message>Access Denied</Message>
  <RequestId>QEXSYR772861BHHR</RequestId>
  <HostId>1/+S7cR2BKQolvaUvQyGwx/oeCWuIu98/WVKL+cI0tPT+Ra/tm4zCFIVxEUOwT/XFj/hySMfTv4=</HostId>
</Error>
```

This means your S3 object's permissions are set to private, and only the AWS account owner can access it.

## Solution: Two Ways to Fix

### Option 1: Set ACL on Individual Objects (Already Implemented)

We've updated the `uploadFilesToS3.js` function to include `ACL: 'public-read'` in the upload parameters. This should make each uploaded file publicly accessible.

However, for this to work, your bucket must have the following settings:

1. Go to your S3 bucket in the AWS Console
2. Click on "Permissions" tab
3. Under "Block Public Access (bucket settings)", click "Edit"
4. Uncheck "Block all public access" option
5. Confirm by typing "confirm" and save changes

If you get an error like `AccessControlListNotSupported: The bucket does not allow ACLs`, proceed to Option 2.

### Option 2: Set Bucket Policy (Recommended)

A bucket policy can grant public read access to all objects in a specified path:

1. Go to your S3 bucket in the AWS Console
2. Click on "Permissions" tab
3. Under "Bucket Policy", click "Edit"
4. Add the following policy (replace `gro8-s3` with your bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::gro8-s3/uploads/*"
    }
  ]
}
```

5. Click "Save changes"

This policy allows anyone to read objects from the `uploads/` directory in your bucket.

### Option 3: Make Bucket Public Access Settings Less Restrictive

If you can't use ACLs or bucket policies, you can modify the bucket settings:

1. Go to your S3 bucket in the AWS Console
2. Click on "Permissions" tab
3. Under "Block Public Access (bucket settings)", click "Edit"
4. Uncheck the following options:
   - "Block public access to buckets and objects granted through new access control lists (ACLs)"
   - "Block public access to buckets and objects granted through any access control lists (ACLs)"
   - "Block public access to buckets and objects granted through new public bucket or access point policies"
5. Save changes

## Option 4: Enable CORS

Additionally, if your application needs to access these files from a web browser, set up CORS:

1. Go to your S3 bucket in the AWS Console
2. Click on "Permissions" tab
3. Scroll down to "Cross-origin resource sharing (CORS)"
4. Click "Edit" and add the following configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD", "PUT", "POST"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

5. Click "Save changes"

## IAM Permissions

Ensure your IAM user or role has the necessary permissions to set public ACLs:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": ["arn:aws:s3:::gro8-s3", "arn:aws:s3:::gro8-s3/*"]
    }
  ]
}
```

## Testing Access

After making these changes, try accessing the URL again:

```
https://gro8-s3.s3.ap-south-1.amazonaws.com/uploads/documents/2d2508f9-870c-4c37-bbcf-f6e878f135c2.pdf
```

You should now be able to access the file without the "Access Denied" error.

## Troubleshooting

If you're still having issues:

1. **Check S3 Block Public Access settings at the account level**: In the S3 console, go to "Block Public Access settings for this account" and make sure it's not overriding your bucket settings.

2. **Check object ownership settings**: In your bucket's "Permissions" tab, under "Object Ownership", make sure "ACLs enabled" is selected if you're using ACLs.

3. **Verify the object exists**: Make sure the file path in the URL is correct.

4. **Check for Bucket Policy conflicts**: If you have other statements in your bucket policy, make sure they don't deny access to these objects.

5. **Retry with new uploads**: Changes to bucket policies only affect new uploads or objects that are copied/modified after the policy change.
