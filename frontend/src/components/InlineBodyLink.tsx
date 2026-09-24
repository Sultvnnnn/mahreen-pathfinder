import Link from "next/link";
import React from "react";

interface InlineBodyLinkProps {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}

export default function InlineBodyLink({
  href,
  children,
  external = false,
}: InlineBodyLinkProps) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[16px] font-jetbrains-mono text-portal-blue hover:underline"
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="text-[16px] font-jetbrains-mono text-portal-blue hover:underline"
    >
      {children}
    </Link>
  );
}
