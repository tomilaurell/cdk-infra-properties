const fillTemplate = require("es6-dynamic-template");

export function expandString(input: string, previousParams: object): string {
  try {
    return fillTemplate(input, {...previousParams, ...process.env});
  } catch (error) {
    console.error('Could not fill template: ' + input + ' With using params', {
      previousParams,
      envParams: process.env
    })
    throw error
  }
}
