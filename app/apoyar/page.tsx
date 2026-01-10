"use client";

import Image from "next/image";
import { useState } from "react";
import Nav from "../components/Nav";

export default function ApoyarPage() {
  const [copied, setCopied] = useState(false);
  const phoneNumber = "923790280";

  const handleCopy = () => {
    navigator.clipboard.writeText(phoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen">
      <Nav />

      {/* Header */}
      <div className="mt-8 py-6 border-y text-center border-subtitle">
        <h1 className="font-title text-subtitle text-4xl sm:text-5xl md:text-6xl font-extrabold">
          Apoyar a la Página
        </h1>
        <p className="font-body mt-2 ">Tu apoyo nos ayuda a seguir mejorando</p>
      </div>

      {/* Contenido principal */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-subtitle/20 p-8 shadow-xl">
          {/* Imagen del creador */}
          <div className="flex justify-center mb-8">
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-button-background-primary shadow-lg">
              <Image
                src="/myboy.jpeg"
                alt="Creador de Capictive"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Título - Editable por el usuario */}
          <h2 className="font-title text-subtitle text-3xl font-bold text-center mb-4">
            ¡Hola! Soy Diogo Abregu, creador de <strong>Capictive</strong>
          </h2>

          {/* Párrafo - Editable por el usuario */}
          <p className="font-body text-subtitle/80 text-center text-lg leading-relaxed mb-8">
            Gracias por usar esta plataforma. Si te ha sido útil y quieres
            apoyar el desarrollo continuo de este proyecto, puedes hacerlo
            mediante una contribución voluntaria. ¡Cada aporte cuenta y nos
            permite seguir mejorando la experiencia para todos!
          </p>

          {/* Sección de contacto/donación */}
          <div className="bg-button-background-primary/10 rounded-2xl p-6 text-center">
            <p className="font-body text-subtitle/70 text-sm mb-4">
              Para apoyar, puedes contactarme o hacer un Yape a:
            </p>

            <div className="flex items-center justify-center gap-3">
              <span className="font-title text-subtitle text-2xl font-bold">
                {phoneNumber}
              </span>
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-lg font-body font-bold transition-all duration-200 ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-button-background-primary text-white hover:bg-button-background-primary/80"
                }`}
              >
                {copied ? "✓ Copiado" : "Copiar"}
              </button>
            </div>
          </div>

          {/* Mensaje de agradecimiento */}
          <p className="font-body text-subtitle/50 text-center text-sm mt-8">
            Con esto, la aplicación podrá estar libre para todo el País
          </p>

          <p className="font-body text-subtitle/80 text-center text-sm "> ¡Gracias por tu apoyo! 🙏</p>
          {/* Botón para volver */}
          <div className="mt-8 text-center">
            <a
              href="/partidos"
              className="inline-block px-6 py-3 bg-subtitle text-white rounded-lg font-body font-bold hover:bg-subtitle/80 transition-colors"
            >
              ← Volver a Partidos
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
