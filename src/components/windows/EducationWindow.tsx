"use client";

import { motion } from "framer-motion";
import { IconSchool, IconCalendar, IconMapPin } from "@tabler/icons-react";
import Window from "./Windows";
import educationData from "src/data/education.json";

type Props = {
  isActive: boolean;
  onClose: () => void;
  onFocus: () => void;
};

export default function EducationWindow({ isActive, onClose, onFocus }: Props) {
  return (
    <Window
      title="education.md"
      isActive={isActive}
      onClose={onClose}
      onFocus={onFocus}
      defaultSize={{ x: 200, y: 110, width: 540, height: 380 }}
    >
      <div className="h-full overflow-auto" style={{ fontFamily: "var(--font-ui)" }}>
        <div className="mb-4 flex items-center gap-2">
          <IconSchool size={16} stroke={1.8} className="text-cyan-300" />
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Education
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {educationData.items.map((item, i) => (
            <motion.div
              key={item.institution + item.degree}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="rounded-xl border border-white/10 bg-slate-900/40 p-4 transition-colors hover:border-cyan-200/20"
            >
              <h3 className="font-semibold text-slate-100">{item.institution}</h3>
              <p className="mb-2 text-sm text-cyan-300">{item.degree}</p>
              <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <IconCalendar size={12} stroke={2} />
                  {item.period}
                </span>
                <span className="flex items-center gap-1">
                  <IconMapPin size={12} stroke={2} />
                  {item.location}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Window>
  );
}
