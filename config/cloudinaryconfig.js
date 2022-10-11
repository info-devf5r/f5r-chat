var { config, uploader } = require('cloudinary');
var dotenv = require('dotenv')
dotenv.config()

const cloudinaryConfig = (req,res,next) => {
    config({
        cloud_name:'earthy',
        api_key: '769965343619438',
        api_secret: 'xEgrYPzWGgfTUqVep3PwgRI_-2s',
    })
    next();
};
module.exports = { cloudinaryConfig, uploader };