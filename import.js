#!/usr/bin/env node
var nodes = require('xml-nodes')
var objects = require('xml-objects')
var fs = require('fs')
var mongojs = require('mongojs')
var transform = require('parallel-transform');

var db = mongojs('brunhilde.local/virk', ['cvr']);

var i=0;
fs.createReadStream('cvr.xml')
	.pipe(nodes('virksomhed'))
	.pipe(objects({explicitRoot: false, explicitArray: false, mergeAttrs: true}))
	.pipe(transform(100, function(data, callback) {
		data._id = data.cvrnr;
		db.cvr.save(data, function(err) {
			console.log(i++);
			callback(err);
		});
	}));
