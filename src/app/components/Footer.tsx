import { Github, Linkedin, Mail, Heart } from "lucide-react";
import { useCallback, useState } from "react";

const CONTACT_EMAIL = "ashwingupta3012@gmail.com";

export function Footer() {
  const [copyToastMessage, setCopyToastMessage] = useState<string | null>(null);

  const copyEmailToClipboard = useCallback(async () => {
    try {
      await globalThis.navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopyToastMessage("Email copied to clipboard!");
      setTimeout(() => setCopyToastMessage(null), 1600);
    } catch {
      setCopyToastMessage("Could not copy email");
      setTimeout(() => setCopyToastMessage(null), 1800);
    }
  }, []);

  return (
    <footer className="py-12 px-6 bg-gray-900 text-white border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-xl font-bold mb-2">Ashwin Gupta</p>
            <p className="text-gray-400 flex items-center gap-2 justify-center md:justify-start">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" />{" "}
              in 2026
            </p>
          </div>

          <div className="flex items-center gap-4">
            {copyToastMessage && (
              <span className="text-xs sm:text-sm px-3 py-1 rounded-full bg-[#e8e0d0] text-black whitespace-nowrap shadow-lg">
                {copyToastMessage}
              </span>
            )}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              onClick={(e) => {
                e.preventDefault();
                void copyEmailToClipboard();
              }}
              className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm mt-8 pt-8 border-t border-gray-800">
          © 2026 Your Name. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
