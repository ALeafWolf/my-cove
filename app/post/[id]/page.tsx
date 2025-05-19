import { auth } from "@/auth";

async function getPost(id: string) {
  const session = await auth();

  const res = await fetch(`${process.env.API_URL}/api/posts/${id}`, {
    headers: {
      Authorization: `Bearer ${session?.jwt}`,
    },
    next: {
      revalidate: 60, // Equivalent to getStaticProps with revalidate: 60
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }

  return res.json();
}

export async function generateStaticParams() {
  // Optional: Pre-render certain posts
  return [
    { id: "1" },
    { id: "2" },
    // Add more IDs as needed
  ];
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{post.attributes.title}</h1>
      <div className="prose max-w-none">{post.attributes.content}</div>
    </div>
  );
}
