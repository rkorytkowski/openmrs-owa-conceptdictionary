/* eslint-disable func-names */
'use strict';
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const env = require('yargs').argv.mode;
const target = require('yargs').argv.target;
const UglifyPlugin = webpack.optimize.UglifyJsPlugin;
const CommonsChunkPlugin =  webpack.optimize.CommonsChunkPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')
var nodeModulesDir = path.resolve(__dirname, '../node_modules');

const fileName = 'app';
const appName = 'conceptdictionary'

const plugins = [];
const nodeModules = {};

let outputFile;
let outputPath;

var configJson;
let appEntryPoint;
let localOwaFolder;

let devtool;

try{
	configJson = require('./config.json');
	appEntryPoint = configJson.APP_ENTRY_POINT;
	localOwaFolder = configJson.LOCAL_OWA_FOLDER;
} catch(err){
	appEntryPoint = "http://localhost:8080//openmrs//owa//conceptdictionary//index.html";
	localOwaFolder = `${__dirname}/dist/`;	
}



/** Don't bundle dependencies for node module */
if (target === 'web') {
  outputFile = `${fileName}.bundle`;
} else if (target === 'node') {
  outputFile = fileName;

  fs.readdirSync('node_modules')
    .filter(x =>
      ['.bin'].indexOf(x) === -1
    )
    .forEach(mod => {
      nodeModules[mod] = `commonjs ${mod}`;
    });
}

/** Minify for production */
if (env === 'production') {
  plugins.push(new UglifyPlugin({
    output: {
      comments: false,
    },
    minimize: true,
    sourceMap: false,
    compress: {
        warnings: false
    }
  }));
  outputFile = `${outputFile}.min.js`;
  outputPath = `${__dirname}/dist/`;
  devtool = 'source-map';
} else if (env === 'dev') {
  outputFile = `${outputFile}.js`;
  outputPath = `${localOwaFolder}${appName}`;
  devtool = 'eval-source-map';
}

plugins.push(new BrowserSyncPlugin({
    host: 'localhost',
    port: 3000,
    proxy: {
    	target : appEntryPoint
    }
}));

plugins.push(new CommonsChunkPlugin("vendor", "vendor.bundle.js"));

plugins.push(new HtmlWebpackPlugin({
    template: './app/index.html',
    inject: 'body'
}));

var config = {
  entry: {
	  app : `${__dirname}/app/components/conceptDictionaryApp.module.js`,
	  vendor : [
		            'angular',
		            'angular-translate',
		            'angular-route',
		            'angular-translate-loader-static-files',
		            'openmrs-contrib-uicommons' 
	            ]
  },
  devtool: devtool,
  target,
  output: {
    path: outputPath,
    filename: outputFile,
  },
  module: {
    loaders: [{
	    test: /\.jsx?$/,
	    loader: 'babel-loader',
	    exclude: /node_modules/,
	    query: {
	        presets: ['es2015'],
	        cacheDirectory : true
    }
    },{
	    test: /\.css$/,
	    loader: 'css'
	}, {
	    test: /\.(png|jpg|jpeg|gif|svg)$/,
	    loader: 'url'
	}, {
	    test: /\.html$/,
	    loader: 'raw'
	},{
	    test: /\.json$/,
	    loader: 'file?name=translation/[name].[ext]'
	},{
        test: /\.scss$/,
        loader: "style!css!sass?outputStyle=expanded&includePaths[]=" 
        		+ path.resolve(__dirname, "./node_modules/compass-mixins/lib")
      },
        {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url'},
        {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url'},
        {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url'},
        {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url'},
        {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'url'},],
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js'],
  },
  plugins,
  externals: nodeModules,
};

module.exports = config;