import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer: React.FC = () => {
  const MY_LINKEDIN_PROFILE =
    "https://www.linkedin.com/in/alexandru-florentin-ion-430a83249/";

  const columns = [
    {
      title: "Visit",
      lines: ["LexEstate HQ", "123 Creativity Street", "Bucharest, RO"],
    },
    {
      title: "Contact",
      lines: ["(123) 456-7890", "creativity@lexestate.xyz"],
    },
  ];

  return (
    <footer className="border-t border-line bg-background-surface">
      <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-xl text-ink">LexEstate</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-muted">
              Verified listings, direct conversations with owners, and tours you
              can book without a phone call.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <p className="eyebrow">{column.title}</p>
              <ul className="mt-4 space-y-2">
                {column.lines.map((line) => (
                  <li key={line} className="text-sm text-ink-muted">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="eyebrow">Follow</p>
            <div className="mt-4 flex gap-2">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                <a
                  key={idx}
                  href={MY_LINKEDIN_PROFILE}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-ink-muted transition-colors hover:border-ink-subtle hover:text-ink"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-6 py-5 text-xs text-ink-subtle sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <span>© {new Date().getFullYear()} LexEstateCo</span>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Support"].map((label) => (
              <a
                key={label}
                href={MY_LINKEDIN_PROFILE}
                className="transition-colors hover:text-ink"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
