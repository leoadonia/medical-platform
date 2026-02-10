// On windows, the path may be extended length path.
const EXTENDED_LENGTH_PREFIX = "\\\\?\\";

// Do NOT change the original path.
export const prettyPath = (path: string): string => {
  if (path.startsWith(EXTENDED_LENGTH_PREFIX)) {
    return path.slice(EXTENDED_LENGTH_PREFIX.length);
  }

  return path;
};
