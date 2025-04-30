export interface DotenvParseOutput {
  [name: string]: string;
}

/**
 * Parses a string in the .env file format into an object.
 *
 * See https://dotenvx.com/docs
 *
 * @param lines - contents to be parsed. example: `'DB_HOST=localhost'`
 * @returns an object with keys and values based on `lines`. example: `{ DB_HOST : 'localhost' }`
 */
// yanked the parse routine from the dotenv lib, and modified it to operate directly on lines
const DOTENV_LINE =
  /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
// Parse lines into an Object
export default function parseDotenv<
  T extends DotenvParseOutput = DotenvParseOutput,
>(lines: string): T {
  const obj: Record<string, string> = {};

  // Convert line breaks to same format
  lines = lines.replace(/\r\n?/mg, "\n");

  let match;
  while ((match = DOTENV_LINE.exec(lines)) != null) {
    const key = match[1];

    // Default undefined or null to empty string
    let value = match[2] || "";

    // Remove whitespace
    value = value.trim();

    // Check if double quoted
    const maybeQuote = value[0];

    // Remove surrounding quotes
    value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");

    // Expand newlines if double quoted
    if (maybeQuote === '"') {
      value = value.replace(/\\n/g, "\n");
      value = value.replace(/\\r/g, "\r");
    }

    // Add to object
    obj[key] = value;
  }

  return obj as T;
}
