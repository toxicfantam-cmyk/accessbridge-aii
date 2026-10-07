import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'text/plain',
    'text/markdown',
    'application/json'
  ];

  if (allowedMimeTypes.includes(file.mimetype) || file.originalname.match(/\.(pdf|jpe?g|png|webp|gif|txt|md|json)$/i)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Please upload a PDF, Image (JPG/PNG/WEBP), or Text file.'), false);
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15 MB limit
  },
  fileFilter
});
