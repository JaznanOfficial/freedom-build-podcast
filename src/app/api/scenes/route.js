export const maxDuration = 30;

export function POST() {
  return new Response("Scene generation has been disabled.", {
    status: 410,
    statusText: "Gone",
  });
}
