import { AudioResourcesView } from "@/components/projects/AudioResourcesView";

export default async function Page({ params }) {
  const { projectId } = await params;

  return <AudioResourcesView projectId={projectId} />;
}
