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

const PORT = process.env.PORT || 3001;

const displayUrl = process.env.PORT
  ? 'https://bvtrots-test-server.onrender.com'
  : `http://localhost:${PORT}`;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running at: ${displayUrl}`);
});