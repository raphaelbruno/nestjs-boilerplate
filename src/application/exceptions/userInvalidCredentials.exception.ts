export class UserInvalidCredentialsException extends Error {
  constructor() {
    super('Invalid credentials');
  }
}
