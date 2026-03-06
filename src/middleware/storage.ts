import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const projectName = req.params.project || 'misc';
    const uploadPath = path.join('public', projectName, 'photos');

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {

    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');

    const shortId = Date.now().toString().slice(-6);
    const cleanName = originalName.replace(/\s+/g, '_');

    cb(null, `${shortId}-${cleanName}`);
  }
});

export const upload = multer({ storage });
