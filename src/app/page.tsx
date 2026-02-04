import { readContent, getPublishedProjects } from '@/lib/content';
import HomeClient from './ui/HomeClient';

export default async function HomePage() {
  const content = await readContent();
  const projects = getPublishedProjects(content);
  return <HomeClient projects={projects} />;
}
