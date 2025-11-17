import { VideoResourcesView } from "@/components/projects/VideoResourcesView";

export default async function Page({ params }) {
  const { projectId } = await params;

  return <VideoResourcesView projectId={projectId} />;
}
