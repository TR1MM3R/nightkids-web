// Verifica le credenziali Basic Auth admin. Fallisce chiuso: se ADMIN_USER/ADMIN_PASS
// non sono configurate, nessuna credenziale è valida.
export function isValidAdminAuth(authHeader: string | null): boolean {
    const validUser = process.env.ADMIN_USER;
    const validPass = process.env.ADMIN_PASS;

    if (!authHeader || !validUser || !validPass) return false;

    const authValue = authHeader.split(' ')[1];
    if (!authValue) return false;

    const [user, pwd] = atob(authValue).split(':');
    return user === validUser && pwd === validPass;
}
