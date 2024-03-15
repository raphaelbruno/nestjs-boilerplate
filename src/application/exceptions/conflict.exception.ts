export class ConflictException extends Error {
  constructor() {
    super('Already exists');
  }
}
