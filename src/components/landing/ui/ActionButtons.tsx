import React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

interface ButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string;
  children: React.ReactNode;
}

export function PrimaryCTA({ className, children, ...props }: ButtonProps) {
  return (
    <a
      {...props}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full bg-brand-900 px-6 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-elegant)] transition-all duration-300 hover:bg-brand-700 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-900/20 active:scale-95 active:translate-y-0",
        className
      )}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </a>
  );
}

export function WhatsAppCTA({ className, children, ...props }: ButtonProps) {
  return (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border border-transparent bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-elegant)] transition-all duration-300 hover:bg-[#128C7E] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#25D366]/30 active:scale-95 active:translate-y-0",
        className
      )}
    >
      <WhatsAppIcon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
      {children}
    </a>
  );
}
