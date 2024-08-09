export default function ContentDetailPage({ params }: { params: { id: string } }) {
  return <div>My Post: {params.id}</div>;
}

export const runtime = "edge";
