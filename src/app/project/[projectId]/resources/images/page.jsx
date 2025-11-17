import { ImageResourcesView } from "@/components/projects/ImageResourcesView";

export default async function Page({ params }) {
  const { projectId } = await params;

  return <ImageResourcesView projectId={projectId} />;
}
