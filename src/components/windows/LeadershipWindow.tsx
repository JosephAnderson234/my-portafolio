"use client";

import { motion } from "framer-motion";
import { IconUsers, IconCalendar, IconMapPin, IconBulb } from "@tabler/icons-react";
import Window from "./Windows";
import activitiesData from "src/data/activities.json";

type Props = {
  isActive: boolean;
  onClose: () => void;
  onFocus: () => void;
};

export default function LeadershipWindow({ isActive, onClose, onFocus }: Props) {
  return (
    <Window
      title="leadership.md"
      isActive={isActive}
      onClose={onClose}
      onFocus={onFocus}
      defaultSize={{ x: 240, y: 100, width: 580, height: 460 }}
    >
      <div className="h-full overflow-auto" style={{ fontFamily: "var(--font-ui)" }}>
        <div className="mb-4 flex items-center gap-2">
          <IconUsers size={16} stroke={1.8} className="text-cyan-300" />
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Leadership & Activities
          </span>
        </div>

        <div className="mb-5 flex flex-col gap-3">
          {activitiesData.activities.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="rounded-xl border border-white/10 bg-slate-900/40 p-4 transition-colors hover:border-cyan-200/20"
            >
              <h3 className="font-semibold text-slate-100">{item.title}</h3>
              <p className="mb-2 text-sm text-cyan-300">{item.role}</p>

              <div className="mb-3 flex flex-wrap gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <IconCalendar size={12} stroke={2} />
                  {item.period}
                </span>
                <span className="flex items-center gap-1">
                  <IconMapPin size={12} stroke={2} />
                  {item.location}
                </span>
              </div>

              <ul className="space-y-1">
                {item.points.map((point, j) => (
                  <li key={j} className="flex gap-2 text-xs text-slate-400">
                    <span className="mt-1 shrink-0 text-cyan-400">▸</span>
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h2 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500">
            <IconBulb size={13} stroke={2} className="text-amber-300" />
            Interests
          </h2>
          <div className="flex flex-wrap gap-2">
            {activitiesData.interests.map((interest) => (
              <span
                key={interest}
                className="rounded-lg border border-amber-400/25 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-200"
              >
                {interest}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </Window>
  );
}
