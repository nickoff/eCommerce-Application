export default class NeverError extends Error {
  constructor(value: never) {
    super(`Unreachable statement: ${value}`);
  }
}
