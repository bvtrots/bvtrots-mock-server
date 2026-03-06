import {DbStructure} from "../types/serverTypes.js";
import {readdirSync, readFileSync, statSync, writeFileSync} from "fs";
import path from "path";

const DATA_DIR = path.resolve('data');

export const buildDatabase = (): DbStructure => {
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


export const saveToDisk = (projectName: string, resourceName: string, data: any[]) => {
  const filePath = path.join(DATA_DIR, projectName, `${resourceName}.json`);
  try {
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(` ✅ Data saved to ${resourceName}.json`);
  } catch (error) {
    console.error(` ⛔ Error record to ${filePath}`);
  }
};
