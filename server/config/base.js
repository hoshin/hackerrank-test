export default {
    serverPort: 4000,
    corsWhitelistedOrigin: 'http://localhost:3000',
    appMode: 'test',
    mongo:{
        uri:'mongodb://localhost/convartest',
        options:{
            user:'convargo',
            pass:'convargo'
        }
    }
};