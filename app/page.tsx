import Image from "next/image";
import logo from "@/public/capictive.png";
export default function Home() {
  return (
    <main>
      <div className="text-center grid grid-cols-3 font-bold font-body">
        <button className="nav-selected">
          Inicio
        </button>
        <button className="nav-unselected">
          Partidos Politicos
        </button>
        <button className="nav-unselected">
          Candidatos
        </button>
      </div>
      <div className="p-6 border-b border-subtitle">
        <div className="flex gap-3 justify-center items-center ">
          <Image
            src={logo}
            alt="Capictive Logo"
            width={150}
            height={150}
          ></Image>
          <h1 className="font-title text-title font-extrabold text-[100px] ">
            Capictive
          </h1>
        </div>
      </div>
      <div className="p-2 text-sm font-body flex justify-between">
        <p className="">Sabado, <strong>03 de Enero del 2026</strong></p>
        <p className="">
          <strong>45</strong> días para el Debate
        </p>
      </div>
      <div className="mt-5 py-12 border-y font-title text-center border-subtitle">
        <p className="text-8xl text-subtitle font-title font-extrabold">
          Tenemos un Problema
        </p>
        <p className="font-body">O bueno varios</p>
      </div>
      <div className="grid grid-cols-2 mt-2">
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
          <button className="btn-primary ">Revisar Partidos</button>
        </div>
      </div>
      <div></div>
    </main>
  );
}
