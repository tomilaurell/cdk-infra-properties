/**
 * Sanitizes names to contain only valid chars for AWS stack name
 * @param name name
 */
export function sanitize(name: string) {
  return name.replace(new RegExp("[^A-Za-z0-9-]+", "g"), "-");
}

export async function getBranchName(): Promise<string> {
  return require("branch-name")
    .get()
    .then((name: string) => sanitize(name));
}
