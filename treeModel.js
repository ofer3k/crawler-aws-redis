// The file was created to show the functionality of the graph library
// -------------------------------------------------------------------
var Graph = require("graph-data-structure");

var klein = Graph();

klein.addEdge("malca", "ronit");
klein.addEdge("malca", "yosi");
klein.addEdge("malca", "ido");
klein.addEdge("yosi", "eitan");
klein.addEdge("ronit", "tzlil");
klein.addEdge("ido", "shaked");
klein.addEdge("ido", "yair");
klein.addEdge("yair", "tal");

// console.log(klein.getEdgeWeight())
console.log(klein.serialize()) 

