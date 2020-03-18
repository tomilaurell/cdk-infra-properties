const fillTemplate = require("es6-dynamic-template");

export function expandString(input: string, previousParams: object): string {
  return fillTemplate(input, {...previousParams, ...process.env});
}
