import _ = require("lodash");

export function getAllFoldersForPath(pathToStack: string): string[] {
  const folderParts = _.split(pathToStack, "/");
  let folderIterator: string;
  const folders = folderParts.map(folderPart => {
    folderIterator = folderIterator ? `${folderIterator}/${folderPart}` : folderPart;
    return folderIterator;
  });
  _.reverse(folders);
  return folders;
}
