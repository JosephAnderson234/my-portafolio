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
            return ["juan - frontend developer"];

        case "ls":
            return ["about.txt  projects/  skills.md"];

        case "projects":
            return [
                "• Linux Desktop Portfolio",
                "• Ecommerce App",
                "• CLI Interface Generator",
            ];

        case "clear":
            return [];

        default:
            return [`command not found: ${cmd}`];
    }
}
