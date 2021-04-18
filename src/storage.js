export function get(key) {
    return localStorage.getItem(key);
}

export async function set(key, value) {
    localStorage.setItem(key, value);
}