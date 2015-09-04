/**
 * Created by josh on 9/2/15.
 */
module.exports = {
    context: __dirname + '/public',
    entry: './app.js',
    output: {
        path: __dirname + '/public',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {test: /\.js$/, loader: 'babel'},
            {test: /\.css$/, loader: 'style!css', exclude: /node_modules/},
            {test: /\.styl$/, loader: 'style!css!stylus', exclude: /node_modules/}
        ]
    }
};