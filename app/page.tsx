import Image from "next/image";
import Link from "next/link";
import logo from "@/public/capictive.png";
import Nav from "./components/Nav";

export default function Home() {
  return (
    <main>
      <Nav />
      <div className="p-6 border-b border-subtitle">
        <div className="flex gap-3 justify-center items-center ">
          <Image
            src={logo}
            alt="Capictive Logo"
            width={150}
            height={150}
          />
          <h1 className="font-title text-title font-extrabold text-[60px] sm:text-[80px] md:text-[100px] ">
            Capictive
          </h1>
        </div>
      </div>
      <div className="p-2 text-sm font-body flex flex-wrap justify-between gap-2">
        <p>Sabado, <strong>03 de Enero del 2026</strong></p>
        <p>
          <strong>45</strong> días para el Debate
        </p>
      </div>
      <div className="mt-5 py-12 border-y font-title text-center border-subtitle">
        <p className="text-4xl sm:text-6xl md:text-8xl text-subtitle font-title font-extrabold">
          Tenemos un Problema
        </p>
        <p className="font-body">O bueno varios</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-2">
        <div className="mx-auto ">
          <Image src={logo} alt="partidos" height={500} width={500} />
        </div>
        <div className="p-6  space-y-4 flex flex-col justify-center">
          <h3 className="font-title text-subtitle text-5xl font-bold">
            Varios partidos politicos
          </h3>
          <p className="font-body">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            doloribus repellat eius accusamus perspiciatis iusto consectetur
            vitae optio odit molestiae ullam rem similique placeat fugiat,
            earum, ipsa perferendis sunt voluptatem!
          </p>
          <Link href="/partidos" className="btn-primary text-center">Revisar Partidos</Link>
        </div>
      </div>

      {/* Secciones de estilo periódico */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 border-t pt-8 border-subtitle">
        <article className="col-span-2 space-y-3">
          <h2 className="font-title text-subtitle text-4xl font-extrabold">Entrevista transcrita</h2>
          <p className="font-body">
            Extractos de una conversación con un especialista en políticas públicas.
            Opiniones, datos y un resumen imparcial para ayudarte a decidir informadamente.
          </p>
          <button className="btn-secondary w-fit">Leer entrevista</button>
        </article>
        <aside className="space-y-3">
          <h3 className="font-title text-subtitle text-3xl font-bold">Hechos históricos</h3>
          <p className="font-body">
            Momentos clave de la política peruana que ayudan a entender el presente.
          </p>
          <button className="btn-secondary w-fit">Ver cronología</button>
        </aside>
      </section>

      {/* Redes sociales */}
      <footer className="mt-12 border-t p-6 border-subtitle text-center">
        <p className="font-body">Síguenos en redes sociales</p>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-3 font-body">
          <a href="https://facebook.com/capictive" className="btn-secondary">@capictive (FB)</a>
          <a href="https://instagram.com/capictive" className="btn-secondary">@capictive (IG)</a>
          <a href="https://tiktok.com/@capictive" className="btn-secondary">@capictive (Tiktok)</a>
        </div>
      </footer>
    </main>
  );
}
