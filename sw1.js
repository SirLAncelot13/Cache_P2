self.addEventListener('install', () => {
    console.log("SW: instalado");
})

self.addEventListener('fetch', e => {

    //const respOFF = new Response(`
        //Bienvenido a la pagina offline  
    
        //Para poder usar la app necesitas conexion a internet`)

    //const respOffHtml = new Response(`
    //<!DOCTYPE html>
    //<html lang="en">
    //<head>
    //    <meta charset="UTF-8">
    //    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    //    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //    <title>My PWA | caches</title>
    //</head>
    //<body>
    //    <h1>Bienvenido a la pagina offline html</h1>
    //    <p>Para poder usar la app necesitas conexion a internet</p>
    //</body>
    //</html>
    //`, {
    //    headers: {
    //        'Content-Type': 'text/html'
    //    }
    //})

    const respOfffile = fetch('pages/viewOffline.html'); // marca error porque se necesita conexion para hacer fecth

    const resp = fetch(e.request)
        .catch( () => {
            console.log("SW: Error en la peticion")
            return respOfffile
        })
    //console.log(e.request.url)

    e.respondWith(resp)
})