import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const Footer: React.FC = () => {
  const MY_LINKEDIN_PROFILE =
    "https://www.linkedin.com/in/alexandru-florentin-ion-430a83249/";

  return (
    <footer className="w-full bg-gradient-to-br from-background via-background-surface to-primary-900/90 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-2 ring-1 ring-white/10">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-sm font-black tracking-tight ring-1 ring-white/15">
              LE
            </span>
            <div className="leading-tight">
              <p className="text-lg font-semibold">LexEstateCo</p>
              <p className="text-sm text-slate-200">Homes without the noise</p>
            </div>
          </div>
          <p className="max-w-sm text-sm text-slate-200">
            Modern tools, human guidance, and verified listings to move you from
            search to keys faster.
          </p>
        </div>

        <div className="grid flex-1 gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
              Visit
            </p>
            <div className="flex items-start gap-3 text-sm text-slate-200">
              <MapPin size={16} className="mt-[2px] text-primary-200" />
              <span>
                LexEstate HQ
                <br />
                123 Creativity Street
                <br />
                Bucharest, RO
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
              Contact
            </p>
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <Phone size={16} className="text-primary-200" />
              <span>(123) 456-7890</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <Mail size={16} className="text-primary-200" />
              <span>creativity@lexestate.xyz</span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
              Follow
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                <a
                  key={idx}
                  href={MY_LINKEDIN_PROFILE}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 transition hover:-translate-y-[1px] hover:bg-white/10"
                >
                  <Icon size={18} className="text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-background/60">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-6 py-4 text-xs text-slate-300 sm:flex-row sm:items-center">
          <span>
            © {new Date().getFullYear()} LexEstateCo. All rights reserved.
          </span>
          <div className="flex gap-4">
            <a
              href={MY_LINKEDIN_PROFILE}
              className="hover:text-white transition"
            >
              Privacy
            </a>
            <a
              href={MY_LINKEDIN_PROFILE}
              className="hover:text-white transition"
            >
              Terms
            </a>
            <a
              href={MY_LINKEDIN_PROFILE}
              className="hover:text-white transition"
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
