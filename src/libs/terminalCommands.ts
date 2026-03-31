import profileData from "src/data/profile.json";
import skillsData from "src/data/skills.json";

// Projects and experience are mocked here for the terminal (same mock as repositories)
const PROJECTS_MOCK = [
  { title: "Linux Desktop Portfolio", status: "in-progress" },
  { title: "Ecommerce Platform", status: "released" },
  { title: "CLI Interface Generator", status: "planned" },
  { title: "Dev Blog", status: "released" },
  { title: "Realtime Chat App", status: "released" },
];

const EXPERIENCE_MOCK = [
  { role: "Senior Frontend Developer", company: "TechCorp Solutions", current: true },
  { role: "Full Stack Developer", company: "StartupXYZ", current: false },
  { role: "Web Developer", company: "Freelance", current: false },
];

export function runCommand(cmd: string): string[] {
    const trimmed = cmd.trim();

    switch (trimmed) {
        case "help":
            return [
                "┌─ Available commands ──────────────────────",
                "│  help          Show this help message",
                "│  whoami        Display profile info",
                "│  ls            List directory contents",
                "│  projects      List all projects",
                "│  experience    List work experience",
                "│  skills        Show tech skills",
                "│  clear         Clear terminal",
                "└───────────────────────────────────────────",
            ];

        case "whoami":
            return [
                `  Name:     ${profileData.name}`,
                `  Role:     ${profileData.role}`,
                `  Location: ${profileData.location}`,
                `  Email:    ${profileData.email}`,
                `  ${profileData.tagline}`,
            ];

        case "ls":
            return ["about/  projects/  experience/  skills/  contact.txt"];

        case "projects":
            return [
                "┌─ Projects ────────────────────────────────",
                ...PROJECTS_MOCK.map((p) => `│  [${p.status.padEnd(11)}] ${p.title}`),
                "└───────────────────────────────────────────",
            ];

        case "experience":
            return [
                "┌─ Work Experience ─────────────────────────",
                ...EXPERIENCE_MOCK.map(
                    (e) => `│  ${e.current ? "▶" : "·"} ${e.role} @ ${e.company}`
                ),
                "└───────────────────────────────────────────",
            ];

        case "skills":
            return [
                "┌─ Skills ──────────────────────────────────",
                ...skillsData.categories.map(
                    (c) => `│  ${c.name.padEnd(12)} ${c.skills.join(", ")}`
                ),
                "└───────────────────────────────────────────",
            ];

        case "clear":
            return [];

        default:
            return [`bash: command not found: ${trimmed}`];
    }
}
