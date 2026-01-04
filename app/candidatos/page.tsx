import Nav from "../components/Nav";

export default function CandidatosPage() {
  return (
    <main>
      <Nav />
      <div className="mt-8 py-12 border-y text-center border-subtitle">
        <h1 className="font-title text-subtitle text-4xl sm:text-5xl md:text-6xl font-extrabold">Candidatos</h1>
        <p className="font-body text-xl mt-3">Aún en construcción 🚧</p>
        <p className="font-body mt-2">Estamos preparando algo divertido y útil para ti.</p>
      </div>
    </main>
  );
}
