import jsonServer from 'json-server';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import path from 'path';
import {DbStructure} from "./types/serverTypes";


const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const DATA_DIR = path.resolve('data');


const saveToDisk = (projectName: string, resourceName: string, data: any[]) => {
  const filePath = path.join(DATA_DIR, projectName, `${resourceName}.json`);
  try {
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(` ✅ Data saved to ${resourceName}.json`);
  } catch (error) {
    console.error(` ⛔ Error record to ${filePath}`);
  }
};

const buildDatabase = (): DbStructure => {
  const dataBase: DbStructure = {};
  const projects = readdirSync(DATA_DIR);

  projects.forEach((projectName) => {
    const projectPath = path.join(DATA_DIR, projectName);
    if (statSync(projectPath).isDirectory()) {
      dataBase[projectName] = {};
      const files = readdirSync(projectPath);
      files.forEach((file) => {
        if (file.endsWith('.json')) {
          const resourceName = path.basename(file, '.json');
          const filePath = path.join(projectPath, file);
          dataBase[projectName][resourceName] = JSON.parse(readFileSync(filePath, 'utf-8'));
        }
      });
    }
  });
  return dataBase;
};

const dataBase = buildDatabase();
const router = jsonServer.router(dataBase);

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
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
        const newItem = { ...req.body, id: req.body.id || crypto.randomUUID() };
        collection.push(newItem);
        saveToDisk(project, resource, collection);
        return res.status(201).jsonp(newItem);
      }


      if ((req.method === 'PUT' || req.method === 'PATCH') && id) {
        const index = collection.findIndex(i => i.id === id);
        if (index !== -1) {
          collection[index] = { ...collection[index], ...req.body, id };
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
});

server.use(router);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(` 🚀 CRUD server http://localhost:${PORT}`);
});
