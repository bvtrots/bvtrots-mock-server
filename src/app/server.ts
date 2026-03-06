import jsonServer from 'json-server';
import express from 'express';
import path from 'path';
import { buildDatabase } from '@shared/db//index.js';
import { crudConductor } from '@shared/api/index.js';
import {cloudpixRoutes} from '@entities/cloudpix-platform/index.js';

const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const dataBase = buildDatabase();
const router = jsonServer.router(dataBase);

server.use(middlewares);
server.use(jsonServer.bodyParser)
server.use('/public', express.static(path.join(process.cwd(), 'public')));

server.use('/cloudpix-platform', cloudpixRoutes(router));

crudConductor(server, router as any);
server.use(router);

const PORT = 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});