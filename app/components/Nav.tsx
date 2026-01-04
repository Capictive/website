"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const item = (href: string, label: string) => {
    const selected = pathname === href;
    const cls = selected ? "nav-selected" : "nav-unselected";
    return (
      <Link href={href} className={`${cls} text-center font-bold font-body`}>
        {label}
      </Link>
    );
  };

  return (
    <div className="text-center grid grid-cols-1 sm:grid-cols-3 gap-2 font-bold font-body">
      {item("/", "Inicio")}
      {item("/partidos", "Partidos Politicos")}
      {item("/candidatos", "Candidatos")}
    </div>
  );
}
