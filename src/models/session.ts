import type { SessaoAuth, UsuarioSessao } from "./types";

export const SESSION_KEYS = {
    accessToken: "token",
    refreshToken: "refreshToken",
    user: "usuario"
};

export function getAccessToken() {
    return localStorage.getItem(SESSION_KEYS.accessToken);
}

export function getRefreshToken() {
    return localStorage.getItem(SESSION_KEYS.refreshToken);
}

export function getStoredUser(): UsuarioSessao | null {
    const raw = localStorage.getItem(SESSION_KEYS.user);

    if (!raw) return null;

    try {
        return JSON.parse(raw) as UsuarioSessao;
    } catch {
        return null;
    }
}

export function saveSession({ accessToken, refreshToken, usuario }: SessaoAuth) {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    if (usuario) {
        localStorage.setItem(SESSION_KEYS.user, JSON.stringify(usuario));
    }
}

export function setAccessToken(accessToken: string | undefined) {
    if (accessToken) {
        localStorage.setItem(SESSION_KEYS.accessToken, accessToken);
    }
}

export function setRefreshToken(refreshToken: string | undefined) {
    if (refreshToken) {
        localStorage.setItem(SESSION_KEYS.refreshToken, refreshToken);
    }
}

export function clearSession() {
    localStorage.removeItem(SESSION_KEYS.accessToken);
    localStorage.removeItem(SESSION_KEYS.refreshToken);
    localStorage.removeItem(SESSION_KEYS.user);
}

export function hasSession() {
    return Boolean(getAccessToken());
}

let sessaoEncerrada = false;

export function encerrarSessao() {
    if (sessaoEncerrada) return;

    sessaoEncerrada = true;
    clearSession();
    window.location.reload();
}
