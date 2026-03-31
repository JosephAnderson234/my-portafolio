"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  IconBrandGithub,
  IconExternalLink,
  IconLoader2,
  IconFolderCode,
} from "@tabler/icons-react";
import Window from "./Windows";
import { projectsRepository } from "src/db/repositories/projectsRepository";
import type { ProjectSummary, ProjectStatus } from "src/db/types";

type Props = {
  isActive: boolean;
  onClose: () => void;
  onFocus: () => void;
};

const statusConfig: Record<ProjectStatus, { label: string; color: string }> = {
  planned: { label: "Planned", color: "text-amber-300 bg-amber-400/15 border-amber-400/30" },
  "in-progress": { label: "In Progress", color: "text-cyan-300 bg-cyan-400/15 border-cyan-400/30" },
  released: { label: "Released", color: "text-emerald-300 bg-emerald-400/15 border-emerald-400/30" },
};

export default function ProjectsWindow({ isActive, onClose, onFocus }: Props) {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsRepository.list().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  return (
    <Window
      title="projects/"
      isActive={isActive}
      onClose={onClose}
      onFocus={onFocus}
      defaultSize={{ x: 200, y: 60, width: 680, height: 520 }}
    >
      <div className="h-full overflow-auto" style={{ fontFamily: "var(--font-ui)" }}>
        <div className="mb-4 flex items-center gap-2">
          <IconFolderCode size={16} stroke={1.8} className="text-cyan-300" />
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Projects — {projects.length} total
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <IconLoader2 size={24} className="animate-spin text-cyan-300" stroke={1.8} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {projects.map((project, i) => {
              const status = statusConfig[project.status];
              return (
                <motion.div
                  key={project.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className="group relative rounded-xl border border-white/10 bg-slate-900/40 p-4 transition-all hover:border-cyan-200/30 hover:bg-slate-900/60"
                >
                  {project.featured && (
                    <span className="absolute right-3 top-3 rounded-full border border-violet-400/30 bg-violet-500/15 px-2 py-0.5 text-[10px] text-violet-300">
                      Featured
                    </span>
                  )}

                  <div className="mb-2 flex items-start gap-2 pr-16">
                    <h3 className="font-semibold text-slate-100 text-sm leading-snug">{project.title}</h3>
                  </div>

                  <p className="mb-3 text-xs leading-relaxed text-slate-400">{project.description}</p>

                  {/* Stack */}
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-white/8 bg-slate-800/50 px-2 py-0.5 text-[11px] text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${status.color}`}>
                      {status.label}
                    </span>

                    <div className="flex gap-2">
                      {project.repo_url && (
                        <a
                          href={project.repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-[11px] text-slate-400 transition-colors hover:border-cyan-200/30 hover:text-cyan-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <IconBrandGithub size={12} stroke={1.8} />
                          Code
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 rounded-md border border-cyan-400/25 bg-cyan-500/10 px-2 py-1 text-[11px] text-cyan-300 transition-colors hover:bg-cyan-500/20"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <IconExternalLink size={12} stroke={1.8} />
                          Live
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Window>
  );
}
