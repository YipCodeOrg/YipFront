export const awsconfig = {
    Auth: {
        region: 'XX-XXXX-us-east-1',
        userPoolId: 'us-east-1_BlAL0N6S7',
        userPoolWebClientId: '6q5ace1mao2cgnvt0ko89puio5',
        mandatorySignIn: false,
        cookieStorage: {
            domain: '.api.dev.yipcode.com',
            path: '/',
            expires: 30,
            // OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
            sameSite: "strict", // | "lax",
            secure: true
        },
                
        oauth: {
            domain: 'https://dev-yipcode-auth.auth.us-east-1.amazoncognito.com',
            scope: ['email'],
            redirectSignIn: 'http://localhost:3000/',
            redirectSignOut: 'http://localhost:3000/',
            responseType: 'code'
        }
    }
}