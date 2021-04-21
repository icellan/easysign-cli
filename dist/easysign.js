"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports.showHashInfoOfFile=exports.getFileHash=exports.showHashInfo=exports.getHashInfo=exports.retrieveData=void 0;var _regenerator=_interopRequireDefault(require("@babel/runtime/regenerator")),_asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),_crypto=_interopRequireDefault(require("crypto")),_fs=require("fs"),_nodeFetch=_interopRequireDefault(require("node-fetch")),_sjcl=_interopRequireDefault(require("./sjcl")),_config=require("./config.js"),retrieveData=function(){var a=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function a(b){var c,d,e,f;return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return _config.PLANARIA_TOKEN||global.PLANARIA_TOKEN||(console.error("No Planaria token defined in config.json (https://token.planaria.network/)"),process.exit(-1)),c=_crypto["default"].createHash("sha256").update(b).digest("hex"),d=_crypto["default"].createHash("sha256").update(c).digest("hex"),e={q:{find:{"out.s2":_config.EASYSIGN_BITCOM_ADDRESS,"out.s3":d},limit:1}},a.next=6,(0,_nodeFetch["default"])("https://txo.bitbus.network/block",{method:"post",headers:{"Content-type":"application/json; charset=utf-8",token:_config.PLANARIA_TOKEN||global.PLANARIA_TOKEN,format:"json"},body:JSON.stringify(e)});case 6:return f=a.sent,a.abrupt("return",f.json());case 8:case"end":return a.stop();}},a)}));return function(){return a.apply(this,arguments)}}();exports.retrieveData=retrieveData;var encryptionParams={v:1,iter:1e3,ks:256,ts:128,mode:"ccm",adata:"",cipher:"aes"},decrypt=function(a,b){a=_sjcl["default"].codec.hex.toBits(a);var c=_sjcl["default"].ecc.elGamal.generateKeys(256,null,_sjcl["default"].bn.fromBits(a));b=JSON.parse(b);var d=_sjcl["default"].json._add({iv:b.iv,salt:b.salt,kemtag:b.kemtag,ct:b.ct},encryptionParams);return JSON.parse(_sjcl["default"].decrypt(c.sec,JSON.stringify(d)))},getHashInfo=function(){var a=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function a(b){var c,d,e,f;return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,retrieveData(b);case 2:if(c=a.sent,!(c[0]&&c[0].out&&c[0].out[0]&&c[0].out[0].s2===_config.EASYSIGN_BITCOM_ADDRESS)){a.next=15;break}if(d=c[0].out[0].s4,d||!c[0].out[0].f4){a.next=13;break}return e="https://x.bitfs.network/"+c[0].out[0].f4,a.next=9,(0,_nodeFetch["default"])(e);case 9:return f=a.sent,a.next=12,f.text();case 12:d=a.sent;case 13:if(!d){a.next=15;break}return a.abrupt("return",{tx:c[0].tx.h,block:c[0].blk.i,meta:decrypt(b,d)});case 15:return a.abrupt("return",!1);case 16:case"end":return a.stop();}},a)}));return function(){return a.apply(this,arguments)}}();exports.getHashInfo=getHashInfo;var showHashInfo=function(){var a=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function a(b){var c,d,e=arguments;return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return c=!!(1<e.length&&void 0!==e[1])&&e[1],a.next=3,getHashInfo(b);case 3:if(d=a.sent,!1!==d){a.next=7;break}return console.log("Transaction for this hash could not be found"),a.abrupt("return");case 7:c?console.log(JSON.stringify(d)):(console.log("Found EasySign.io info for file hash",b),console.log(" - found in transaction",d.tx),console.log(" - found in block",d.block),console.log(d.meta));case 8:case"end":return a.stop();}},a)}));return function(){return a.apply(this,arguments)}}();exports.showHashInfo=showHashInfo;var getFileHash=function(){var a=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function a(b){return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.abrupt("return",new Promise(function(a,c){var d=_crypto["default"].createHash("sha256");try{var e=(0,_fs.ReadStream)(b);e.on("data",function(a){d.update(a)}),e.on("end",function(){var b=d.digest("hex");a(b)})}catch(a){c(a)}}));case 1:case"end":return a.stop();}},a)}));return function(){return a.apply(this,arguments)}}();exports.getFileHash=getFileHash;var showHashInfoOfFile=function(){var a=(0,_asyncToGenerator2["default"])(_regenerator["default"].mark(function a(b){var c,d,e=arguments;return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return c=!!(1<e.length&&void 0!==e[1])&&e[1],a.next=3,getFileHash(b);case 3:return d=a.sent,a.next=6,showHashInfo(d,c);case 6:case"end":return a.stop();}},a)}));return function(){return a.apply(this,arguments)}}();exports.showHashInfoOfFile=showHashInfoOfFile;