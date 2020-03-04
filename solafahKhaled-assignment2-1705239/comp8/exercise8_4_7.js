// graph from Figure 8.11 (3rd edition)
// input user property fields for each vertex as defined in the Vertex object below
// property fields can be listed in any order; simply omit fields with no value to assign


var _v = [
	{ label: "a" }, // index = 0
	{ label: "b" }, // index = 1
	{ label: "c" }, // index = 2
	{ label: "d" }, // index = 4
	{ label: "e" }  // index = 5
];

var _e = [
	{ u: 0, v: 1, w:2},
	{ u: 0, v: 3, w:1},
	{ u: 0, v: 4, w:8},
	{ u: 1, v: 0, w:6 },
	{ u: 1, v: 2, w:3 },
	{ u: 1, v: 3, w:2 },
	{ u: 2, v: 3, w:4 },
	{ u: 3, v: 2, w:2 },
	{ u: 3, v: 4, w:3 },
	{ u: 4, v: 0, w:3 }
];