"use client";

import { motion } from "framer-motion";
import { IconTool } from "@tabler/icons-react";
import Window from "./Windows";
import skillsData from "src/data/skills.json";

type Props = {
  isActive: boolean;
  onClose: () => void;
  onFocus: () => void;
};

const colorMap: Record<string, string> = {
  cyan: "border-cyan-400/30 bg-cyan-500/10 text-cyan-200",
  emerald: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
  violet: "border-violet-400/30 bg-violet-500/10 text-violet-200",
  amber: "border-amber-400/30 bg-amber-500/10 text-amber-200",
};

const headerColorMap: Record<string, string> = {
  cyan: "text-cyan-300",
  emerald: "text-emerald-300",
  violet: "text-violet-300",
  amber: "text-amber-300",
};

export default function SkillsWindow({ isActive, onClose, onFocus }: Props) {
  return (
    <Window
      title="skills.md"
      isActive={isActive}
      onClose={onClose}
      onFocus={onFocus}
      defaultSize={{ x: 320, y: 100, width: 520, height: 420 }}
    >
      <div className="h-full overflow-auto" style={{ fontFamily: "var(--font-ui)" }}>
        <div className="mb-4 flex items-center gap-2">
          <IconTool size={16} stroke={1.8} className="text-cyan-300" />
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Technical Skills
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {skillsData.categories.map((category, i) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.07 }}
              className="rounded-xl border border-white/10 bg-slate-900/40 p-4"
            >
              <h3 className={`mb-3 text-xs font-semibold uppercase tracking-widest ${headerColorMap[category.color] ?? "text-slate-300"}`}>
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className={`rounded-lg border px-2.5 py-1 text-xs font-medium ${colorMap[category.color] ?? "border-white/10 text-slate-300"}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Window>
  );
}
