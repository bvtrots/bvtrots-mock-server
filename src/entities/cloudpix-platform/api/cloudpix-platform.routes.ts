import { Router } from 'express';
import { upload } from '@shared/lib/index.js';
import { saveToDisk } from '@shared/db/index.js';
import { DbStructure } from '@shared/types/index.js';
import { CloudpixPhoto } from '../model/types.js';

export default (jsonRouter: any) => {
  const router = Router();
  const PROJECT_NAME = 'cloudpix-platform';
  const RESOURCE_NAME = 'data';

  router.post('/upload', upload.single('filename'), (req: any, res: any) => {
    try {
      if (!req.file) {
        return res.status(400).send('Файл не был загружен.');
      }

      const db = jsonRouter.db;
      const state = db.getState() as DbStructure;

      const collection = state[PROJECT_NAME]?.[RESOURCE_NAME] as CloudpixPhoto[];

      if (!collection || !Array.isArray(collection)) {
        return res.status(404).send(`Ресурс ${RESOURCE_NAME} не найден`);
      }

      const newPhoto: CloudpixPhoto = {
        id: collection.length > 0 ? Math.max(...collection.map((p) => p.id)) + 1 : 1,
        url: `public/${PROJECT_NAME}/uploads/${req.file.filename}`,
        description: req.body.description || "",
        likes: 0,
        comments: []
      };

      collection.push(newPhoto);
      db.setState(state);

      saveToDisk(PROJECT_NAME, RESOURCE_NAME, collection);

      console.log(`✅ Новое фото добавлено: ${req.file.filename}`);
      res.status(201).json(newPhoto);

    } catch (err) {
      console.error('Ошибка в роуте Cloudpix:', err);
      res.status(500).send('Internal Server Error');
    }
  });

  return router;
};