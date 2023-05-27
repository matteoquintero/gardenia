const storedExpiration = localStorage.getItem('expiration');
if (storedExpiration) {
    const nowValid = new Date();
    const expirationValid = new Date(parseInt(storedExpiration));
    if (nowValid >= expirationValid) {
        let cartRio
        if(localStorage.getItem('cartRio')){ 
            cartRio = JSON.parse(localStorage.getItem('cartRio'));
        } 
        localStorage.clear(); 
        if(cartRio){
            localStorage.setItem('cartRio', JSON.stringify(cartRio))
        }
    } 
}else{
    const now = new Date();
    const expiration = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // caduca en una semana (7 días x 24 horas x 60 minutos x 60 segundos x 1000 milisegundos)
    localStorage.setItem('expiration', expiration.getTime().toString());
}