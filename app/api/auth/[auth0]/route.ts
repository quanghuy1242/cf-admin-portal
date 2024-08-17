import { handleAuth, handleLogin, handleLogout } from "@auth0/nextjs-auth0/edge";

export const GET = handleAuth({
    login: handleLogin({
        authorizationParams: {
            audience: process.env.AUTH0_AUDIENCE,
            scope: "openid profile email"
        }
    }),
    logout: handleLogout({
        returnTo: "/"
    })
});

export const runtime = 'edge';

//https://github.com/vercel/next.js/issues/51642
export const fetchCache = 'force-no-store';
