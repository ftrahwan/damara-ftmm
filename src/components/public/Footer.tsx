import Image from 'next/image';

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/bemftmmunair/',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r=".75" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@bemftmmunair',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M19.6 7.2a6.8 6.8 0 0 1-4.2-1.5v8.1a5.8 5.8 0 1 1-5-5.7v3.2a2.7 2.7 0 1 0 1.9 2.5V2.5h3.1c.2 2.1 1.9 3.8 4.2 4.1v3.1Z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/bemftmmunair/',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M5.2 3.5a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4ZM3.3 9.5h3.8v11H3.3v-11Zm6.2 0h3.6V11h.1a4 4 0 0 1 3.6-1.9c3.8 0 4.5 2.5 4.5 5.7v5.7h-3.8v-5.1c0-1.2 0-2.8-1.8-2.8s-2.1 1.3-2.1 2.7v5.2H9.5v-11Z" />
      </svg>
    ),
  },
  {
    name: 'Medium',
    href: 'https://medium.com/@bemftmmunair',
    icon: <span className="font-serif text-[21px] font-bold leading-none" aria-hidden="true">M</span>,
  },
];

export function Footer() {
  return (
    <footer className="mt-auto block w-full border-t border-amber-100/10 bg-[#5b381d] text-stone-200 md:hidden">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-8 sm:px-8 sm:py-10 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl space-y-3">
          <Image
            src="/logo-mandala.png"
            alt="Kabinet Mandala — Makna, Daya, Laksana"
            width={260}
            height={82}
            className="h-12 w-auto object-contain"
          />
          <p className="max-w-xl text-sm leading-relaxed text-stone-200/80">
            Gedung Kuliah Bersama, Jl. Dr. Ir. H. Soekarno Kampus C, Mulyorejo,
            Surabaya, Jawa Timur 60115
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-bold tracking-wide text-white">Media Sosial</h2>
          <ul className="flex items-center gap-3" aria-label="Media sosial BEM FTMM UNAIR">
            {socialLinks.map(({ name, href, icon }) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`BEM FTMM UNAIR di ${name} (buka tab baru)`}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#b07a3c] text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#d9b26a] hover:text-[#4e2c12] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f4c542]"
                >
                  {icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-stone-300/75">
        &copy; {new Date().getFullYear()} DAMARA (Daya Magang Industri Mandala) &bull; BEM FTMM Universitas Airlangga
      </div>
    </footer>
  );
}
