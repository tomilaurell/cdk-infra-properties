import {expandVariables, Params} from "./variableLoader";

test("Expand variables with previous param in same set", () => {
  // Given
  const params: Params = {
    FIRST: 'FIRST_VALUE',
    SECOND: 'REFER TO ${FIRST}'
  }

  // When
  const result = expandVariables(params);

  // Then
  expect(result.FIRST).toBe('FIRST_VALUE')
  expect(result.SECOND).toBe('REFER TO FIRST_VALUE')
});

