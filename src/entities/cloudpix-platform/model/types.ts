export interface CloudpixComment {
  id: number;
  message: string;
  author: string;
}

export interface CloudpixPhoto {
  id: number;
  url: string;
  description: string;
  likes: number;
  comments: CloudpixComment[];
}

export interface CloudpixProjectData {
  data: CloudpixPhoto[];
}