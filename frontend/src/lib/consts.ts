export const MATCH_TIMEOUT_DURATION = 30000;
export const MATCH_FOUND_MESSAGE_TYPE = 'MATCH_FOUND';
export const MATCH_TIMEOUT_MESSAGE_TYPE = 'MATCH_TIMEOUT';
export const MATCH_FOUND_STATUS = 'matched';
export const MATCH_TIMEOUT_STATUS = 'timeout';
export const MATCH_ERROR_STATUS = 'error';
export const MATCH_IDLE_STATUS = 'idle';
export const MATCH_WAITING_STATUS = 'waiting';

export const MATCH_FOUND_SOUND_PATH = '/sounds/match-found.mp3';

export const LANGUAGES = [
    'javascript',
    'typescript',
    'python',
    'java',
];

export const BOILERPLATE_CODES = {
    javascript: `function greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
    typescript: `type Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Alex" });\n`,
    python: `def greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
    java: `public class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`
};