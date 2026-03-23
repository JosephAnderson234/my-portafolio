import profileData from "src/data/profile.json";
import projectsData from "src/data/projects.json";

export function runCommand(cmd: string): string[] {
    switch (cmd) {
        case "help":
            return [
                "Available commands:",
                "help",
                "whoami",
                "ls",
                "projects",
                "clear",
            ];

        case "whoami":
            return [`${profileData.name} - ${profileData.role}`];

        case "ls":
            return ["about.txt  projects/  skills.md"];

        case "projects":
            return projectsData.map((project) => `- ${project.title}`);

        case "clear":
            return [];

        default:
            return [`command not found: ${cmd}`];
    }
}
