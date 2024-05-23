import {  UploadApiResponse, 
    UploadApiErrorResponse } from 'cloudinary';
import cloudinary from './cloudinary';
import { NextFunction, Request, Response } from 'express';
import multer, { Multer } from 'multer';

const storage = multer.memoryStorage();
export const upload: Multer = multer({ storage: storage });
interface CloudinaryFile extends Express.Multer.File {
        buffer: Buffer;
} 



export const uploadToCloudinary = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body)
        console.log(req.file, "this is the file");
        console.log(req.files);
        const cloudinaryUrls: string[] = [];
      if(req.file && req.files===undefined){
        const file: CloudinaryFile = req.file as CloudinaryFile;
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'Maitri-Project',
          } as any,
          (err: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
            if (err) {
              console.error('Cloudinary upload error:', err);
              return next(err);
            }
            if (!result) {
              console.error('Cloudinary upload error: Result is undefined');
              return next(new Error('Cloudinary upload result is undefined'));
            }
            cloudinaryUrls.push(result.secure_url);
            // All files processed, now get your images here
            req.body.cloudinaryUrls = cloudinaryUrls;
            next();
          }
        );
        uploadStream.end(file.buffer);
      }else{
      const files: CloudinaryFile[] = req.files as CloudinaryFile[];
      if (!files || files.length === 0) {
        return next(new Error('No files provided'));
      }
     
      for (const file of files) {
  
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'Maitri-Project',
          } as any,
          (err: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
            if (err) {
              console.error('Cloudinary upload error:', err);
              return next(err);
            }
            if (!result) {
              console.error('Cloudinary upload error: Result is undefined');
              return next(new Error('Cloudinary upload result is undefined'));
            }
            cloudinaryUrls.push(result.secure_url);
  
            if (cloudinaryUrls.length === files.length) {
              //All files processed now get your images here
              req.body.cloudinaryUrls = cloudinaryUrls;
              next();
            }
          }
        );
        uploadStream.end(file.buffer);
      }
    }
    } catch (error) {
      console.error('Error in uploadToCloudinary middleware:', error);
      next(error);
    }
  };
