export async function verifyAuth(authGrade: Array<number>, userId: string) {
  const auth = await this.authService.getAuthByUserId(userId);

  if (!authGrade.includes(auth.auth)) {
    return 403;
  } else {
    return 200;
  }
}

export const COOKIE_AGES = {
  ZERO: 0,
  FIFTEEN_MINUTES_IN_MS: 15 * 60 * 1000,
  THIRTY_DAYS: 30 * 24 * 60 * 60 * 1000,
};
