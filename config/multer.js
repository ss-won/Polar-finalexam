let multer = require('multer');
let multerS3 = require('multer-s3');
let aws = require('aws-sdk');
aws.config.update({
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
    region: process.env.aws_region
});
let s3 = new aws.S3();

var path = require('path');
var uuid = require('uuid/v4');

module.exports = {
    upload: multer({
        storage: multerS3({
            s3: s3,
            bucket: "polar-photos",
            key: function (req, file, cb) {
                'use strict';
                //let id = req.params[0];
                let extension = path.extname(file.originalname);
                cb(null, uuid() + Date.now().toString() + extension);
            },
            acl: 'public-read-write'
        })
    })
};

/* 코드출처 : https://cereme.dev/blog/multer-s3%EB%A5%BC-%ED%99%9C%EC%9A%A9%ED%95%9C-AWS-S3-%ED%8C%8C%EC%9D%BC%EC%97%85%EB%A1%9C%EB%93%9C-with-Expressjs-Vuejs/ */

