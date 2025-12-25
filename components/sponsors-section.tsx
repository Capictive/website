import Image from "next/image"

export function SponsorsSection() {
  const sponsors = [
    {
      name: "n8n",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/n8n-kM1szNMK2KBDE5Ai1sn07FAvtBlQ0w.png",
    },
    {
      name: "Skyward",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/skyward-jiCjqVrkRFdG1tqQpKKNaUlNwIn3dh.png",
    },
    {
      name: "HeyGen",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/heygen-k16Bq43NG0RHvBtTS4QqF2aDJYL1l5.svg",
    },
    {
      name: "ElevenLabs",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/elevenlabs-CqW37bbsFK2DunvGc5hj7w52qyDHRY.png",
    },
  ]

  return (
    <section className="py-24 px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Section Title */}
        <div className="text-center mb-12">
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-8">Con la confianza de</p>
        </div>

        {/* Sponsors Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center justify-items-center">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.name}
              className="relative w-32 h-12 opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
            >
              <Image src={sponsor.logo || "/placeholder.svg"} alt={sponsor.name} fill className="object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
