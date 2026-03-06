import jsonServer from 'json-server';
import {buildDatabase, saveToDisk} from "./src/utils/db-engine";
import {crudConductor} from "./src/middleware/crud";
import express from 'express';
import {DbStructure} from "./types/serverTypes";
import {upload} from "./src/middleware/storage";

const server = jsonServer.create();
const middlewares = jsonServer.defaults();


const dataBase = buildDatabase();
const router = jsonServer.router(dataBase);

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use('/public', express.static('public'));


server.post('/:project/upload', upload.single('filename'), (req, res) => {
  try {
    const { project } = req.params;
    if (!req.file) return res.status(400).send('No file');

    const currentState = router.db.getState() as DbStructure;
    const collection = currentState[project as string]?.['data'];

    if (!collection) {
      return res.status(404).send('Project or resource not found');
    }

    const newPhoto = {
      id: collection.length > 0 ? Math.max(...collection.map((p: any) => p.id)) + 1 : 1,
      url: `photos/${req.file.filename}`,
      description: req.body.description || "",
      likes: 0,
      comments: []
    };

    collection.push(newPhoto);

    saveToDisk(project as string, 'data', collection);

    res.json({ ...newPhoto, success: true });

  } catch (err) {
    console.error('Ошибка при сохранении:', err);
    res.status(500).send('Error saving data');
  }
});


crudConductor(server, router);
server.use(router);

const PORT = process.env.PORT || 3001;
server.listen(Number(PORT), '0.0.0.0', () => {
  console.log(` 🚀 Server is running on port ${PORT}`);
});
