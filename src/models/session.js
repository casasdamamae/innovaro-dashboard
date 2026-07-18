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

export function getStoredUser() {
    const raw = localStorage.getItem(SESSION_KEYS.user);

    if (!raw) return null;

    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function saveSession({ accessToken, refreshToken, usuario }) {
    if (accessToken) {
        localStorage.setItem(SESSION_KEYS.accessToken, accessToken);
    }

    if (refreshToken) {
        localStorage.setItem(SESSION_KEYS.refreshToken, refreshToken);
    }

    if (usuario) {
        localStorage.setItem(SESSION_KEYS.user, JSON.stringify(usuario));
    }
}

export function setAccessToken(accessToken) {
    if (accessToken) {
        localStorage.setItem(SESSION_KEYS.accessToken, accessToken);
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
