import {DbStructure} from "../types/serverTypes.js";
import {saveToDisk} from "../utils/db-engine.js";
import { Request, Response, NextFunction } from 'express';


export const crudConductor=(server:any,router:any)=> {

  server.use((req:Request, res:Response, next:NextFunction) => {
    const pathParts = req.path.split('/').filter(Boolean);
    if (pathParts.length >= 2) {
      const [project, resource, id] = pathParts;
      const currentState = router.db.getState() as DbStructure;

      if (currentState[project] && currentState[project][resource]) {
        const collection = currentState[project][resource];

        if (req.method === 'GET') {
          if (id) {
            const item = collection.find(item => item.id === id);
            return item ? res.jsonp(item) : res.status(404).send('Not Found');
          }
          return res.jsonp(collection);
        }

        if (req.method === 'POST') {
          const newItem = {...req.body, id: req.body.id || crypto.randomUUID()};
          collection.push(newItem);
          saveToDisk(project, resource, collection);
          return res.status(201).jsonp(newItem);
        }

        if ((req.method === 'PUT' || req.method === 'PATCH') && id) {
          const index = collection.findIndex(i => i.id === id);
          if (index !== -1) {
            collection[index] = {...collection[index], ...req.body, id};
            saveToDisk(project, resource, collection);
            return res.jsonp(collection[index]);
          }
        }

        if (req.method === 'DELETE' && id) {
          const filtered = collection.filter(i => i.id !== id);
          if (filtered.length < collection.length) {
            currentState[project][resource] = filtered;
            saveToDisk(project, resource, filtered);
            return res.status(204).send();
          }
        }
      }
    }
    next();
  })
}
