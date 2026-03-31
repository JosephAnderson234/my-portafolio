"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  IconBriefcase,
  IconCalendar,
  IconMapPin,
  IconLoader2,
  IconCircleFilled,
} from "@tabler/icons-react";
import Window from "./Windows";
import { experienceRepository } from "src/db/repositories/experienceRepository";
import type { ExperienceSummary } from "src/db/types";

type Props = {
  isActive: boolean;
  onClose: () => void;
  onFocus: () => void;
};

function formatDate(dateStr: string): string {
  const [year, month] = dateStr.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatDateRange(startDate: string, endDate: string | undefined, current: boolean): string {
  const start = formatDate(startDate);
  if (current) return `${start} — Present`;
  if (endDate) return `${start} — ${formatDate(endDate)}`;
  return start;
}

export default function ExperienceWindow({ isActive, onClose, onFocus }: Props) {
  const [experience, setExperience] = useState<ExperienceSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    experienceRepository.list().then((data) => {
      setExperience(data);
      setLoading(false);
    });
  }, []);

  return (
    <Window
      title="experience.log"
      isActive={isActive}
      onClose={onClose}
      onFocus={onFocus}
      defaultSize={{ x: 120, y: 90, width: 620, height: 500 }}
    >
      <div className="h-full overflow-auto" style={{ fontFamily: "var(--font-ui)" }}>
        <div className="mb-4 flex items-center gap-2">
          <IconBriefcase size={16} stroke={1.8} className="text-cyan-300" />
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Work Experience
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <IconLoader2 size={24} className="animate-spin text-cyan-300" stroke={1.8} />
          </div>
        ) : (
          <div className="relative pl-5">
            {/* Timeline line */}
            <div className="absolute left-1.5 top-2 bottom-2 w-px bg-gradient-to-b from-cyan-400/40 via-violet-400/20 to-transparent" />

            <div className="flex flex-col gap-6">
              {experience.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.08 }}
                  className="relative"
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-5 top-1.5 flex h-3 w-3 items-center justify-center">
                    <IconCircleFilled
                      size={10}
                      className={exp.current ? "text-cyan-300" : "text-slate-500"}
                    />
                  </div>

                  <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4 transition-colors hover:border-cyan-200/20">
                    {/* Header */}
                    <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-slate-100">{exp.role}</h3>
                        <p className="text-sm text-cyan-300">{exp.company}</p>
                      </div>
                      {exp.current && (
                        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-0.5 text-xs text-emerald-300">
                          Current
                        </span>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="mb-3 flex flex-wrap gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <IconCalendar size={12} stroke={2} />
                        {formatDateRange(exp.start_date, exp.end_date, exp.current)}
                      </span>
                      <span className="flex items-center gap-1">
                        <IconMapPin size={12} stroke={2} />
                        {exp.location}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="mb-3 text-xs leading-relaxed text-slate-300">{exp.description}</p>

                    {/* Achievements */}
                    <ul className="mb-3 space-y-1">
                      {exp.achievements.map((ach, j) => (
                        <li key={j} className="flex gap-2 text-xs text-slate-400">
                          <span className="mt-1 shrink-0 text-cyan-400">▸</span>
                          {ach}
                        </li>
                      ))}
                    </ul>

                    {/* Stack */}
                    <div className="flex flex-wrap gap-1.5">
                      {exp.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-white/8 bg-slate-800/50 px-2 py-0.5 text-[11px] text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Window>
  );
}
