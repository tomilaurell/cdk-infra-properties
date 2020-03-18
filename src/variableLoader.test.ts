import {expandString} from "./stringExpansionUtil";

test("Expand string with env variable", () => {
  // Given
  process.env.RESULT = "SUCCESS";
  const input = "something: ${RESULT}";

  // When
  const result = expandString(input, {});

  // Then
  expect(result).toBe("something: SUCCESS");
});

