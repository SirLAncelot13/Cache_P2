console.log("Holiwi")
const CACHE_STATIC_NAME = 'static-v3'
const CACHE_DYNAMIC_NAME = 'dynamic-v1'
const CACHE_INMUTABLE_NAME = 'inmutable-v1'

function cleanCache(cacheName, sizeItems) {
    caches.open(cacheName)
        .then(cache => {
            cache.keys().then(keys => {
                console.log(keys)
                if (keys.length >= sizeItems) {
                    cache.delete(keys[0]).then(() => {
                        cleanCache(cacheName, sizeItems)
                    })
                }
            })
        })
}

self.addEventListener('install', (event) => {
    console.log("SW: Nuevo");

    // Crear el cache y almacenar el appShell
    const promesaCache = caches.open(CACHE_STATIC_NAME).then((cache) => {
        return cache.addAll([
            '/Cache_P2/',
            '/Cache_P2/index.html',
            '/Cache_P2/css/page.css',
            '/Cache_P2/img/cheems-memes-9.jpg',
            '/Cache_P2/js/app.js',
            '/Cache_P2/pages/viewOffline.html',
            '/Cache_P2/img/hola-peter.jpg'
        ])
    })

    const promInmutable = caches.open(CACHE_INMUTABLE_NAME).then(cacheInmu => {
        return cacheInmu.addAll([
            'https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.js'
        ])
    })

    event.waitUntil(Promise.all([promesaCache, promInmutable]))

})

self.addEventListener('activate', (event) => {
    const relCache = caches.keys().then(keys => {
        keys.forEach(key => {
            if(key !== CACHE_STATIC_NAME && key.includes('static')){
                return caches.delete(key)
            }
        })
    })

    event.waitUntil(relCache)
})

self.addEventListener('fetch', (event) => {

    // 3-. Network with cache fallback 
    //const response = fetch(event.request).then(res => {
    //
    //    if(!res){
    //        return caches.match(event.request)
    //    }
    //
    //    caches.open(CACHE_DYNAMIC_NAME).then(cache => {
    //        cache.put(event.request, res)
    //        cleanCache(CACHE_DYNAMIC_NAME, 5)
    //    })
    //    return res.clone()
    //}).catch(error => {
    //    return caches.match(event.request)
    //})

    //event.respondWith(response)

    //2-. cache with network fallback (primero busca en cache, si no busca en la red)
    const respuesta = caches.match(event.request)
        .then(resp => {
            //Si la respuesta existe en cache
            if (resp) {
                return resp;
            }
            console.log("No esta en cache", event.request)
            //voy a la red
            return fetch(event.request)
                .then(respNet => {
                    caches.open(CACHE_DYNAMIC_NAME)
                        .then((cache) => {
                            console.log(cache)
                            cache.put(event.request, respNet).then(() => {
                                cleanCache(CACHE_DYNAMIC_NAME, 7)
                            })
                        })
                    return respNet.clone();
                }).catch((err) => {
                    console.log("Error al consultar")
                    console.log(event.request)
                    if(event.request.headers.get('accept').includes('text/html')){
                        return caches.match('/Cache_P2/pages/viewOffline.html')
                    }
                    if(event.request.url.includes('jpg')){
                        console.log("Es una imagen")
                        return caches.match('/Cache_P2/img/hola-peter.jpg')
                    }
                });
        })
    event.respondWith(respuesta)

    //1-. Only cache
    //event.respondWith(caches.match(event.request)); 
})