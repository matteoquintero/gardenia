const storedExpiration = localStorage.getItem('expiration');
if (storedExpiration) {
    const nowValid = new Date();
    const expirationValid = new Date(parseInt(storedExpiration));
    if (nowValid >= expirationValid) {
        console.log('oli')
        localStorage.clear(); 
    } 
}else{
    console.log('si oli')
    const now = new Date();
    const expiration = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // caduca en una semana (7 días x 24 horas x 60 minutos x 60 segundos x 1000 milisegundos)
    localStorage.setItem('expiration', expiration.getTime().toString());
}