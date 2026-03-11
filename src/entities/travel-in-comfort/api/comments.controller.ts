import { Router } from 'express';
import { saveToDisk } from '@shared/db/index.js';

export const commentsController = (db: any, PROJECT: string, getProjectState: any, auth: any) => {
  const router = Router();

  router.get('/:id', (req, res) => {
    const state = getProjectState();
    const comments = state.comments || [];
    const filtered = comments.filter((c: any) => String(c.offerId) === String(req.params.id));
    res.json(filtered);
  });

  router.post('/:id', auth, (req, res) => {
    try {
      const { id } = req.params;
      const { comment, rating } = req.body;
      const fullState = db.getState();


      const randomNames = ['Anna', 'Max', 'John', 'Elena', 'Victor'];
      const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
      const randomLock = Math.floor(Math.random() * 100);

      const newComment = {
        id: Math.random().toString(36).substring(2, 9),
        offerId: id,
        date: new Date().toISOString(),
        user: {
          name: randomName,
          avatarUrl: `https://loremflickr.com/54/54/face?lock=${randomLock}`,
          isPro: Math.random() > 0.5
        },
        comment: comment,
        rating: Number(rating)
      };

      if (!fullState[PROJECT].comments) {
        fullState[PROJECT].comments = [];
      }

      fullState[PROJECT].comments.push(newComment);
      db.setState(fullState);

      saveToDisk(PROJECT, 'comments', fullState[PROJECT].comments);

      res.status(201).json(newComment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  return router;
};