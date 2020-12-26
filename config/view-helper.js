const env = require('./environment');
const fs = require('fs');
const path = require('path');
module.exports = (app) => {
    app.locals.assetPath = function (filepath) {
        // console.log("app.locals.assetPath -> env.name", env.name)
        if (env.name == 'development') {
            return '/' + filepath;
        }
        // console.log('Manifest : ')
        // console.log(JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/rev-manifest.json'))));
        // console.log('Filepath : ', '/' + JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/rev-manifest.json')))[filepath]);
        return '/' + JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/rev-manifest.json')))[filepath];
    }
}