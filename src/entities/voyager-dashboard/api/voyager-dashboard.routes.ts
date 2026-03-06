import { Router } from 'express';
import { DbStructure } from '@shared/types/index.js';

export interface JsonRouter extends Router {
  db: {
    getState: () => DbStructure;
    setState: (state: DbStructure) => void;
  };
}

export default (jsonRouter: JsonRouter) => {
  const router = Router();
  return router;
};