import { Router } from 'express';
import { upload } from '../middleware/storage.js';

const router = Router();

router.post('/upload', upload.single('filename'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Файл не загружен');
  }

  res.json({
    url: `cloudpix-platform/photos/${req.file.filename}`
  });
});

export default router;
