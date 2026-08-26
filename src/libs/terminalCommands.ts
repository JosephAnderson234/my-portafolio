import profileData from "src/data/profile.json";
import skillsData from "src/data/skills.json";
import educationData from "src/data/education.json";

// Projects and experience are mocked here for the terminal (same mock as repositories)
const PROJECTS_MOCK = [
    { title: "Sistema de Compras + Landing", status: "released" },
    { title: "Ecosistema Web del Club de Software Libre", status: "in-progress" },
    { title: "Frontend con API Gateway + JWT", status: "released" },
    { title: "Apps en Tiempo Real con WebSockets", status: "released" },
    { title: "Portfolio Interactivo Estilo Linux", status: "in-progress" },
];

const EXPERIENCE_MOCK = [
    { role: "Fullstack Developer", company: "Mekánico", current: true },
    { role: "Programador Full Stack", company: "Cognitia", current: false },
    { role: "Asistente de Catedra y Laboratorio - Programacion II", company: "UTEC", current: false },
    { role: "Desarrollador de Back-end", company: "BioActiva", current: false },
    { role: "Director de Sistemas", company: "Club de Software Libre - UTEC", current: true },
    { role: "Asistente de Catedra - Programacion II", company: "UTEC", current: false },
    { role: "Desarrollador Full Stack", company: "Maftech S.A.C.", current: false },
    { role: "Desarrollo Web", company: "Autónomo", current: false },
    { role: "Desarrollador Front-end", company: "Cachimbo", current: false },
    { role: "Desarrollador Independiente", company: "Proyectos Personales", current: true },
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
                "│  education     Show academic background",
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
                `  Phone:    ${profileData.phone ?? "N/A"}`,
                `  ${profileData.tagline}`,
            ];

        case "ls":
            return ["about/  projects/  experience/  education/  skills/  contact.txt"];

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

        case "education":
            return [
                "┌─ Education ────────────────────────────────",
                ...educationData.items.map((e) => `│  ${e.degree} — ${e.institution} (${e.period})`),
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
