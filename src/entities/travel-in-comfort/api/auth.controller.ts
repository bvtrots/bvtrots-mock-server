import { Router } from 'express';
import { saveToDisk } from '@shared/db/index.js';

export const authController = (db: any, PROJECT: string, getProjectState: any) => {
  const router = Router();


  router.get('/login', (req, res) => {
    try {
      const state = getProjectState();
      const token = req.headers['x-token'];

      if (state.login && state.login.token === token) {
        return res.json(state.login);
      }

      return res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
      res.status(500).json({ message: "Error checking auth status" });
    }
  });

  router.post('/login', (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      const userData = {
        email: email,
        token: Buffer.from(email).toString('base64'), // Имитация токена
        name: email.split('@')[0],
        avatarUrl: "https://loremflickr.com/128/128/face",
        isPro: false
      };

      const fullState = db.getState();

      if (!fullState[PROJECT]) {
        fullState[PROJECT] = {};
      }

      fullState[PROJECT].login = userData;

      db.setState(fullState);

      saveToDisk(PROJECT, 'login', userData);

      res.status(200).json(userData);
    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({ message: "Internal Server Error during login" });
    }
  });


  router.delete('/logout', (req, res) => {
    try {
      const fullState = db.getState();

      if (fullState[PROJECT]) {
        fullState[PROJECT].login = {};
        db.setState(fullState);
        saveToDisk(PROJECT, 'login', {});
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error during logout" });
    }
  });

  return router;
};