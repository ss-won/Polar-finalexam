module.exports = {
    server_port : 3000,
    //db_url : 'mongodb://localhost:27017/local',
    db_schemas : [
        {file:'../app/models/user',collection:'users',schemaName:'UserSchema',modelName:'UserModel'}
    ],
    route_info : [
    ],
    facebook : {
        clientID : '143519372974925',
        clientSecret : 'e40001e72bfd151cd6074a63f6a23d6b',
        callbackURL : 'http://localhost:3000/auth/facebook/callback'
    },
    google : {
        clientID : '427450538267-qccs9luphgla4jfjt2for2sd9earohie.apps.googleusercontent.com',
        clientSecret : 'ikx1OGw_XK6lXGNthvNzMyuI',
        callbackURL : 'http://localhost:3000/auth/google/callback'
    },
    aws : {
        accessKeyId : 'AKIAJTZTKY24JBBMASOA',
        secretAccessKey : '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',
        region : 'us-east-1',
        bucket : 'polar-photo',
        ACL : 'public-read'
    }
}