const API = process.env.NEXT_PUBLIC_API_URL;

export async function login(email, password) {
    const rest = await fetch (`${API}/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({ email, password }),

    });
    if (!rest.ok) throw new Error("Login atau password salah   ");
    const data = await rest.json();
    setToken(data.token);
    return data;
}
export function getToken(){
    return localStorage.getItem("token");
}
export function setToken(token) {
    localStorage.setItem("token", token);
}
export function clearToken(){
    localStorage.removeItem("token");
} 