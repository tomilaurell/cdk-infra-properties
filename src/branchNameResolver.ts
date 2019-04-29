export async function getBranchName(): Promise<string> {
  return require("branch-name")
    .get()
    .then((name: string) => name);
}
