module.exports = {
    server_port : 3000,
    //db_url : 'mongodb://localhost:27017/local',
    db_schemas : [
        {file:'../app/models/user',collection:'users',schemaName:'UserSchema',modelName:'UserModel'}
    ],
    route_info : [
    ],
    facebook : {
        clientID : '*',
        clientSecret : '*',
        callbackURL : 'http://localhost:3000/auth/facebook/callback'
    },
    google : {
        clientID : '*',
        clientSecret : '*',
        callbackURL : 'http://localhost:3000/auth/google/callback'
    },
    aws : {
        accessKeyId : '*',
        secretAccessKey : '*',
        region : 'us-east-1',
        bucket : 'polar-photo',
        ACL : 'public-read'
    }
}