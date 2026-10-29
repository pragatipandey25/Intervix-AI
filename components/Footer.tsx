import Link from "next/link";
import Image from "next/image";
import { FaGithub, FaInstagram, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { Sparkles, Heart } from "lucide-react";

interface SocialLinkProps {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  hoverClass: string;
}

const SocialLink = ({ href, label, Icon, hoverClass }: SocialLinkProps) => {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`group relative inline-flex items-center justify-center rounded-xl p-2.5 text-light-100/70 border border-white/10 bg-white/5 transition-all duration-200 hover:-translate-y-1 hover:border-white/20 ${hoverClass}`}
    >
      <span className="sr-only">{label}</span>
      <Icon className="size-4" />

      {/* Tooltip positioned ABOVE icon */}
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 z-20">
        <span className="whitespace-nowrap rounded-lg bg-dark-200 px-2.5 py-1 text-xs font-medium text-light-100 shadow-xl border border-white/10">
          {label}
        </span>
      </span>
    </Link>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/10 bg-dark-100/40 backdrop-blur-sm mt-12 pt-10 pb-8">
      <div className="flex flex-col gap-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Column 1: Brand & Creator */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5 w-fit">
              <Image
                src="/logo.svg"
                alt="IntervixAI Logo"
                width={34}
                height={28}
                className="h-auto w-auto"
              />
              <span className="text-xl font-bold text-primary-100 tracking-tight">
                IntervixAI
              </span>
            </Link>

            <p className="text-xs md:text-sm text-light-100/70 leading-relaxed max-w-sm">
              Next-generation AI mock interview platform. Practice realistic technical & behavioral interviews, receive structured feedback, and accelerate your engineering career.
            </p>

            {/* Owner Credit Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-primary-200/20 bg-primary-200/5 w-fit text-xs text-light-100/80">
              <Sparkles className="size-3.5 text-primary-200" />
              <span>
                Designed & Built by{" "}
                <span className="font-semibold text-primary-200">
                  Pragati Pandey
                </span>
              </span>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-wider text-primary-200 font-semibold font-mono">
                Platform
              </span>
              <ul className="flex flex-col gap-2 text-xs md:text-sm text-light-100/75">
                <li>
                  <Link href="/" className="hover:text-primary-100 transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/interview" className="hover:text-primary-100 transition-colors">
                    Start Interview
                  </Link>
                </li>
                <li>
                  <Link href="/practice-questions" className="hover:text-primary-100 transition-colors">
                    Practice Drills
                  </Link>
                </li>
                <li>
                  <Link href="/saved-questions" className="hover:text-primary-100 transition-colors">
                    Question Bank
                  </Link>
                </li>
                <li>
                  <Link href="/resume-analysis" className="hover:text-primary-100 transition-colors">
                    Resume Scanner
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-wider text-primary-200 font-semibold font-mono">
                Insights
              </span>
              <ul className="flex flex-col gap-2 text-xs md:text-sm text-light-100/75">
                <li>
                  <Link href="/analytics" className="hover:text-primary-100 transition-colors">
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link href="/interview/history" className="hover:text-primary-100 transition-colors">
                    History
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-primary-100 transition-colors">
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="hover:text-primary-100 transition-colors">
                    Settings
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-primary-100 transition-colors">
                    Help & Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3: Connect with Pragati */}
          <div className="md:col-span-3 flex flex-col gap-3 md:items-end">
            <span className="text-xs uppercase tracking-wider text-primary-200 font-semibold font-mono">
              Connect with Me
            </span>

            <div className="flex items-center gap-2.5 mt-1">
              <SocialLink
                href="https://github.com/pragatipandey25"
                label="GitHub"
                Icon={FaGithub}
                hoverClass="hover:text-white hover:bg-white/10"
              />
              <SocialLink
                href="https://www.linkedin.com/in/pragati-pandey-25f2006/"
                label="LinkedIn"
                Icon={FaLinkedin}
                hoverClass="hover:text-[#0A66C2] hover:bg-[#0A66C2]/10"
              />
              <SocialLink
                href="https://www.instagram.com/pragatii_pandey/"
                label="Instagram"
                Icon={FaInstagram}
                hoverClass="hover:text-[#E1306C] hover:bg-[#E1306C]/10"
              />
              <SocialLink
                href="mailto:pragatipandey454@gmail.com"
                label="Email"
                Icon={FaEnvelope}
                hoverClass="hover:text-primary-200 hover:bg-primary-200/10"
              />
            </div>

            <p className="text-xs text-light-100/60 md:text-right mt-2 leading-relaxed">
              Open to collaborations & engineering conversations 🚀
            </p>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5 text-xs text-light-100/60">
          <p>
            © {currentYear} Intervix AI by{" "}
            <span className="text-light-100/90 font-medium">Pragati Pandey</span>. All rights reserved.
          </p>

          <p className="flex items-center gap-1.5">
            Built with Next.js, React 19, Firebase & AI
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
