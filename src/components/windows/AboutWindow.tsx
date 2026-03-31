"use client";

import { motion } from "framer-motion";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconMapPin,
  IconMail,
  IconUser,
} from "@tabler/icons-react";
import Window from "./Windows";
import profileData from "src/data/profile.json";

type Props = {
  isActive: boolean;
  onClose: () => void;
  onFocus: () => void;
};

const iconMap: Record<string, React.ComponentType<{ size?: number; stroke?: number; className?: string }>> = {
  github: IconBrandGithub,
  linkedin: IconBrandLinkedin,
  twitter: IconBrandTwitter,
};

export default function AboutWindow({ isActive, onClose, onFocus }: Props) {
  return (
    <Window
      title="about.md"
      isActive={isActive}
      onClose={onClose}
      onFocus={onFocus}
      defaultSize={{ x: 80, y: 80, width: 560, height: 440 }}
    >
      <div className="h-full overflow-auto" style={{ fontFamily: "var(--font-ui)" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-5 rounded-xl border border-cyan-200/15 bg-gradient-to-br from-cyan-500/10 via-slate-900/40 to-violet-500/10 p-5"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-200/25 bg-slate-900/60 text-cyan-300">
              <IconUser size={36} stroke={1.5} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-50">{profileData.name}</h1>
              <p className="text-sm text-cyan-300">{profileData.role}</p>
            </div>
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-4 rounded-lg border border-white/8 bg-slate-900/30 p-4"
        >
          <p className="text-sm leading-relaxed text-slate-300 italic">
            &ldquo;{profileData.tagline}&rdquo;
          </p>
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-4"
        >
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">About</h2>
          <p className="text-sm leading-relaxed text-slate-300">{profileData.bio}</p>
        </motion.div>

        {/* Meta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-4 flex flex-wrap gap-3"
        >
          <span className="flex items-center gap-1.5 rounded-md border border-white/10 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300">
            <IconMapPin size={13} stroke={2} className="text-cyan-300" />
            {profileData.location}
          </span>
          <span className="flex items-center gap-1.5 rounded-md border border-white/10 bg-slate-900/40 px-3 py-1.5 text-xs text-slate-300">
            <IconMail size={13} stroke={2} className="text-cyan-300" />
            {profileData.email}
          </span>
        </motion.div>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">Links</h2>
          <div className="flex flex-wrap gap-2">
            {profileData.links.map((link) => {
              const Icon = iconMap[link.icon] ?? IconBrandGithub;
              return (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900/40 px-3 py-2 text-xs text-slate-300 transition-all hover:border-cyan-200/40 hover:bg-cyan-900/20 hover:text-cyan-100"
                >
                  <Icon size={14} stroke={1.8} />
                  {link.label}
                </a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </Window>
  );
}
