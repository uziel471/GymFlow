export class AthleteEmailInUseError extends Error {
  constructor() {
    super("Athlete email already in use");
    this.name = "AthleteEmailInUseError";
  }
}

export class AthleteNotFoundError extends Error {
  constructor() {
    super("Athlete not found");
    this.name = "AthleteNotFoundError";
  }
}
