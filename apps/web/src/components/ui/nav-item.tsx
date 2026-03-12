"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { navUnderline } from "@/design/motion";

type NavItemProps = {
  href: string;
  label: string;
  active?: boolean;
};

export function NavItem({ href, label, active = false }: NavItemProps) {
  return (
    <motion.div initial="rest" whileHover="hover" animate={active ? "active" : "rest"}>
      <Link
        href={href}
        className="relative inline-flex h-10 items-center text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
      >
        {label}
        <motion.span
          variants={navUnderline}
          className="absolute bottom-0 left-0 h-px w-full bg-brand-accent"
        />
      </Link>
    </motion.div>
  );
}
