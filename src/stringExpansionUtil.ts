const fillTemplate = require("es6-dynamic-template");

export function expandString(input: string): string {
  return fillTemplate(input, process.env);
}
