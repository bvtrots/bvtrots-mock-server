import { Router } from 'express';

export const offersController = (db: any, PROJECT: string, getProjectState: any) => {
  const router = Router();

  router.get('/', (req, res) => {
    res.json(getProjectState().offers || []);
  });

  router.get('/:id', (req, res) => {
    const offer = getProjectState().offers?.find((o: any) => o.id === req.params.id);
    offer ? res.json(offer) : res.status(404).json({ message: "Not found" });
  });

  router.get('/:id/nearby', (req, res) => {
    const state = getProjectState();
    const current = state.offers?.find((o: any) => o.id === req.params.id);
    if (!current) return res.json([]);

    const nearby = state.offers
      .filter((o: any) => o.city.name === current.city.name && o.id !== current.id)
      .slice(0, 3);
    res.json(nearby);
  });

  return router;
};