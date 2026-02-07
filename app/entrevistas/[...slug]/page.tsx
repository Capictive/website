import { redirect } from "next/navigation";

export default function CatchAllRedirect({ params }: { params: { slug: string[] } }) {
  const slug = params.slug || [];
  const joined = slug.join("/");
  // params are already decoded by Next, but ensure encoding for query
  const partido = encodeURIComponent(joined);
  redirect(`/entrevistas?partido=${partido}`);
}
