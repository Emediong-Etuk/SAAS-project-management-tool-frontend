export function saveSession(token:string, tenantId:string, user:object) {
    localStorage.setItem('token', token);
    localStorage.setItem('tenantId', tenantId);
    localStorage.setItem('user', JSON.stringify(user));
}

export function getSession(){
    return{
        token: localStorage.getItem('token'),
        tenantId: localStorage.getItem('tenantId'),
        user: JSON.parse(localStorage.getItem('user') || '{}')
    }
}

export function clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('tenantId');
    localStorage.removeItem('user');
}