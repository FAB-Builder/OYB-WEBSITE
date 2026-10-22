"use client";

import Link from "next/link";
import Image from "next/image";
import { trackLinkClick } from "@/lib/analytics";

const AppHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border-subtle">
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/workspaces"
            className="flex items-center"
            aria-label="OYB – Own Your Brand"
            onClick={() => trackLinkClick('logo', 'header', "/workspaces")}
          >
            <Image src="/logo-mark.svg" alt="OYB – Own Your Brand" width={88} height={30} className="h-7 w-auto" priority />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
