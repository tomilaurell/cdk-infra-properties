import envParameterUtil from './envParameterUtil';

test('Calling set environment parameter should be found', () => {
  process.env.TEST_CONF = 'TEST';
  const value = envParameterUtil('TEST_CONF');
  expect(value).toEqual('TEST');
});

test('Calling unset environment parameter should throw error', () => {
  expect(() => {
    envParameterUtil('NOT_SET_CONFIG');
  }).toThrow();
});
