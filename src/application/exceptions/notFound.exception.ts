export class NotFoundException extends Error {
  constructor() {
    super('Not found');
  }
}
