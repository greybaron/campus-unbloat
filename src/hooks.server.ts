import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const jwt = event.cookies.get('jwt');

    if (!jwt && event.url.pathname !== '/') {
        console.log('redirecting to /');
        return Response.redirect(new URL('/', event.url));
    }

    if (jwt && event.url.pathname === '/') {
        console.log('redirecting to /dashboard');
        return Response.redirect(new URL('/dashboard', event.url));
    }
    
    return resolve(event);
};