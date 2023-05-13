

const storedExpiration = localStorage.getItem('expiration');
if (storedExpiration) {
    const expiration = new Date(parseInt(storedExpiration));
    if (expiration > new Date()) {
        localStorage.clear(); 
    } else {
        const now = new Date();
        const expiration = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // caduca en una semana (7 días x 24 horas x 60 minutos x 60 segundos x 1000 milisegundos)
        localStorage.setItem('expiration', expiration.getTime().toString());
    }
}else{
    const now = new Date();
    const expiration = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // caduca en una semana (7 días x 24 horas x 60 minutos x 60 segundos x 1000 milisegundos)
    localStorage.setItem('expiration', expiration.getTime().toString());
}