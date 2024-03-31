// multerConfig.ts
import multer from 'multer';
import Datauri from 'datauri';
import { Request } from 'express';
import { CustomError } from '../utils/CustomError';
// Function to configure Multer for file uploads
const multerConfig = (singleFile: boolean = false,fileName:string) => {
  const storage = multer.memoryStorage();

  let upload;

  if (singleFile) {
    upload = multer({
      storage,
      limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
          cb(null, true);
        } else {
          cb(new Error('Only images and PDFs are allowed'));
        }
      },
    }).single(fileName); // Accept a single file with field name 'certification'
  } else {
    upload = multer({
      storage,
      limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
          cb(null, true);
        } else {
          cb(new Error('Only images and PDFs are allowed'));
        }
      },
    }).array(fileName, 5); // Accept multiple files with field name 'certifications' and limit to 5 files
  }

  return upload;
};


const dataUri = async (req: Request) => {
   
    try {
        if (!req.file) {
            throw new CustomError('No file uploaded', 400);
          }
          const dataURI = await Datauri(req.file.filename, (err, content) => {
            if (err) {
              throw new Error('Error creating data URI:'||  err.message);
            }
            return content;  // Return the created data URI from within the callback
          });
      return dataURI;
        } catch (error) {
      // Handle any errors during data URI creation
      console.error('Error creating data URI:', error);
      throw error; // Re-throw the error for appropriate handling at a higher level
    }
  };
  export { multerConfig, dataUri };

