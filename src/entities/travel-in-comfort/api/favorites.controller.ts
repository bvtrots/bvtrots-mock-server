import { Router } from 'express';
import { saveToDisk } from '@shared/db/index.js';

export const favoritesController = (db: any, PROJECT: string, getProjectState: any, auth: any) => {
  const router = Router();

  const getCurrentUserEmail = () => {
    const state = getProjectState();
    return state.login?.email;
  };

  router.get('/', auth, (req, res) => {
    const state = getProjectState();
    const email = getCurrentUserEmail();

    if (!email) return res.status(401).json({ message: "Unauthorized" });

    const allFavorites = state.favorites || {};
    const userFavorites = allFavorites[email] || [];

    res.json(userFavorites);
  });

  router.post('/:id/:status', auth, (req, res) => {
    const { id, status } = req.params;
    const isAdding = status === '1';
    const email = getCurrentUserEmail();

    if (!email) return res.status(401).json({ message: "Unauthorized" });

    const fullState = db.getState();
    const projectData = fullState[PROJECT];

    if (!projectData.favorites || Array.isArray(projectData.favorites)) {
      projectData.favorites = {};
    }

    if (!projectData.favorites[email]) {
      projectData.favorites[email] = [];
    }

    const offer = projectData.offers?.find((o: any) => o.id === id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });

    let userFavs = [...projectData.favorites[email]];

    if (isAdding) {
      if (!userFavs.find((f: any) => f.id === id)) {
        userFavs.push({ ...offer, isFavorite: true });
      }
    } else {
      userFavs = userFavs.filter((f: any) => f.id !== id);
    }

    projectData.favorites[email] = userFavs;

    db.setState(fullState);

    saveToDisk(PROJECT, 'favorites', projectData.favorites);

    res.json({ ...offer, isFavorite: isAdding });
  });

  return router;
};