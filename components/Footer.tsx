import Link from "next/link";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

const SocialLink = ({
  href,
  label,
  Icon,
  hoverClass,
}: {
  href: string;
  label: "GitHub" | "LinkedIn" | "Instagram";
  Icon: React.ComponentType<{ className?: string }>;
  hoverClass: string;
}) => {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`group relative inline-flex items-center justify-center rounded-lg p-2 text-light-100/70 transition-colors hover:translate-y-0.5 hover:scale-[1.1] ${hoverClass}`}
    >
      <span className="sr-only">{label}</span>
      <Icon className="size-5" />

      {/* Tooltip */}
      <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100">
        <span className="whitespace-nowrap rounded-md bg-zinc-900/95 px-2 py-1 text-xs text-light-100 shadow-sm ring-1 ring-white/10">
          {label}
        </span>
      </span>
    </Link>
  );
};

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-dark-100/0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-start">
            {/* Left */}
            <div className="text-sm text-light-100/80">
              © 2026 Intervix-AI. All rights reserved.
            </div>

            {/* Center */}
            <div className="md:col-span-1">
              <div className="text-sm font-medium text-primary-100">
                Quick Links
              </div>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                {[
                  { href: "/", label: "Dashboard" },
                  { href: "/interview/history", label: "Interview History" },
                  {
                    href: "/saved-questions",
                    label: "Saved Questions",
                  },
                  { href: "/settings", label: "Settings" },
                  { href: "/help", label: "Help & Support" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm text-light-100/75 transition-colors hover:text-primary-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="md:text-right">
              <div className="text-sm font-medium text-primary-100">
                Connect with Me
              </div>
              <div className="relative mt-3 flex items-center justify-start gap-4 md:justify-end">
                <SocialLink
                  href="https://github.com/pragatipandey25"
                  label="GitHub"
                  Icon={FaGithub}
                  hoverClass="hover:text-[#ffffff]"
                />
                <SocialLink
                  href="https://www.linkedin.com/in/pragati-pandey-25f2006/"
                  label="LinkedIn"
                  Icon={FaLinkedin}
                  hoverClass="hover:text-[#0A66C2]"
                />
                <SocialLink
                  href="https://www.instagram.com/pragatii_pandey/"
                  label="Instagram"
                  Icon={FaInstagram}
                  hoverClass="hover:text-[#E1306C]"
                />
              </div>

              <div className="mt-4 text-sm text-light-100/70">
                Let's connect and build something amazing{" "}
                <span aria-hidden="true">🚀</span>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="text-sm text-light-100/70">
            © {new Date().getFullYear()} Intervix-AI. Empowering careers through
            AI-powered interview preparation.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
