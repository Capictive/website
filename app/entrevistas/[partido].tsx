import { useRouter } from "next/router";
import EntrevistasList from "../components/EntrevistasList";

export default function EntrevistasPage() {
  const router = useRouter();
  const { partido } = router.query;

  if (!partido || typeof partido !== "string") {
    return <div className="font-body p-8">No se especificó partido.</div>;
  }

  return (
    <main className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="font-title text-4xl text-center mb-8">Entrevista</h1>
      <EntrevistasList partido={partido} />
    </main>
  );
}
