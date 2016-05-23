/* eslint-disable func-names */
'use strict';
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const env = require('yargs').argv.mode;
const target = require('yargs').argv.target;

const UglifyPlugin = webpack.optimize.UglifyJsPlugin;
const CommonsChunkPlugin =  webpack.optimize.CommonsChunkPlugin
const DedupePlugin = webpack.optimize.DedupePlugin;
const OccurenceOrderPlugin = webpack.optimize.OccurenceOrderPlugin;

var HtmlWebpackPlugin = require('html-webpack-plugin');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var WebpackMd5Hash = require('webpack-md5-hash');

var nodeModulesDir = path.resolve(__dirname, '../node_modules');


const fileName = 'app';
const appName = 'conceptdictionary'

const plugins = [];
const nodeModules = {};

let outputFile;
let vendorOutputFile;
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
    compress: false
  }));
  plugins.push(new DedupePlugin());
  outputFile = `${outputFile}.min.[chunkhash].js`;
  vendorOutputFile = "vendor.bundle.[chunkhash].js";
  outputPath = `${__dirname}/dist/`;
  devtool = 'source-map';
  
  plugins.push(new CopyWebpackPlugin([{
	    from: './app/manifest.webapp.test'
	}]));
  
} else if (env === 'dev') {
  outputFile = `${outputFile}.js`;
  vendorOutputFile = "vendor.bundle.js";
  outputPath = `${localOwaFolder}${appName}`;
  devtool = 'source-map';
}

plugins.push(new BrowserSyncPlugin({
    host: 'localhost',
    port: 3000,
    proxy: {
    	target : appEntryPoint
    }
}));

plugins.push(new CommonsChunkPlugin("vendor", vendorOutputFile));

plugins.push(new HtmlWebpackPlugin({
    template: './app/index.html',
    inject: 'head'
}));

plugins.push(new CopyWebpackPlugin([{
    from: './app/manifest.webapp'
}]));

plugins.push(new CopyWebpackPlugin([{
    from: './app/img/omrs-button.png',
    to: 'img/omrs-button.png'
}]));

plugins.push(new OccurenceOrderPlugin());

plugins.push(new WebpackMd5Hash());

var config = {
  entry: {
	  app : `${__dirname}/app/components/conceptDictionaryApp.module.js`,
	  vendor : [
		            'angular',
		            'angular-translate',
		            'angular-route',
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
    }, {
	    test: /\.css$/,
	    loader: 'css'
	}, {
	    test: /\.(png|jpg|jpeg|gif|svg)$/,
	    loader: 'url'
	},{
		test: /\.json$/,
		loader: 'json'
		
	},{
	    test: /\.html$/,
	    loader: 'raw'
	}],
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js'],
  },
  plugins,
  externals: nodeModules,
};

module.exports = config;