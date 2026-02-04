import fs from 'node:fs/promises';
import path from 'node:path';

export type TextColor = 'charcoal' | 'light-charcoal';
export type Aspect = 'landscape' | 'portrait';
export type MediaType = 'embed' | 'image' | 'video';

export type Block =
  | { type: 'header'; text: string; color?: TextColor }
  | { type: 'body'; text: string; color?: TextColor }
  | {
      type: 'media';
      mediaType: 'embed';
      src: string;
      aspect: Aspect;
      caption?: string;
    }
  | {
      type: 'media';
      mediaType: 'image';
      src: string;
      aspect: Aspect;
      caption?: string;
    }
  | {
      type: 'media';
      mediaType: 'video';
      src: string;
      aspect: Aspect;
      caption?: string;
    };

export type Project = {
  id: string;
  title: string;
  year?: string;
  tags?: string[];
  published: boolean;
  thumbnail?: {
    type: 'image' | 'video';
    src: string;
    alt?: string;
  };
  blocks: Block[];
};

export type Content = {
  site: { title: string; updatedAt: string };
  projects: Project[];
};

const CONTENT_PATH = path.join(process.cwd(), 'content', 'projects.json');

export async function readContent(): Promise<Content> {
  const raw = await fs.readFile(CONTENT_PATH, 'utf8');
  return JSON.parse(raw);
}

export async function writeContent(content: Content): Promise<void> {
  content.site.updatedAt = new Date().toISOString();
  await fs.writeFile(CONTENT_PATH, JSON.stringify(content, null, 2) + '\n', 'utf8');
}

export function getPublishedProjects(content: Content): Project[] {
  return (content.projects || []).filter(p => p.published);
}
