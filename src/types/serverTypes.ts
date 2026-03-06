export interface ProjectData {
  [resourceName: string]: any[];
}

export interface DbStructure {
  [projectName: string]: ProjectData;
}
