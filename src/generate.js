var X = 0.525731112119133606;
var Z = 0.850650808352039932;
//var sphere_points = new Array();
var radius = 1;
var vdata, tindices;
var depthTriangles;
var seedVectorIndices;
var colorFolder; 
var plateColorCount = 0; //color folder hack

//var duplicateVertexCount;
//var duplicateTriangeCount;

vdata = [
        new THREE.Vector3(-X, 0.0, Z), new THREE.Vector3( X, 0.0, Z ), new THREE.Vector3( -X, 0.0, -Z ), new THREE.Vector3( X, 0.0, -Z ),
        new THREE.Vector3( 0.0, Z, X ), new THREE.Vector3( 0.0, Z, -X ), new THREE.Vector3( 0.0, -Z, X ), new THREE.Vector3( 0.0, -Z, -X ),
        new THREE.Vector3( Z, X, 0.0 ), new THREE.Vector3( -Z, X, 0.0 ), new THREE.Vector3( Z, -X, 0.0 ), new THREE.Vector3( -Z, -X, 0.0 )
    ];

function subdivide(v1, v2, v3, sphere_points, d) {
    if(d == 0) {
		/*
		*	This entire block is pretty inefficient at the moment.
		*
		*	The same vector are iterated over multiple times for each triangle.
		*	addAdjectProperty and containsVector are called each time.
		*	The first to add a property adjacent to each vector3 if it doesn't exist and
		*	the second to check and see if the vector3 needs to be added to sphere_points
		*	
		*	Both of these can be done when the vector3s are created.
		*	This happens in two locations. 
		*	In here [subdivide] when each vector3s is cloned before a subdivide and
		* 	in initVData where the initial vector3s are created.
		*
		*/
		//add the vectors to sphere_points if they aren't already there
		if(containsVector(v1,sphere_points)) {
			v1.plate = null;
			sphere_points.push(v1);
		}
		if(containsVector(v2,sphere_points)) {
			v1.plate = null;
			sphere_points.push(v2);
		}
		if(containsVector(v3,sphere_points)) {
			v1.plate = null;
			sphere_points.push(v3);
		}
		
		//add the property adjacent if it doesn't exist
		addAdjectProperty(v1);
		if(containsVector(v2,v1.adjacent)) {
			v1.adjacent.push(v2);
		}
		
		if(containsVector(v3,v1.adjacent)) {
			v1.adjacent.push(v3);
		}
		
		addAdjectProperty(v2);
		if(containsVector(v1,v2.adjacent)) {
			v2.adjacent.push(v1);
		}
		if(containsVector(v3,v2.adjacent)) {
			v2.adjacent.push(v3);
		}
		
		addAdjectProperty(v3);
		if(containsVector(v1,v3.adjacent)) {
			v3.adjacent.push(v1);
		}
		if(containsVector(v2,v3.adjacent)) {
			v3.adjacent.push(v2);
		}
		/*
		*	end inefficient 
		*
		*/
		
		var triangle = new THREE.Triangle(v1,v2,v3);
		triangle.set(v1,v2,v3);
		if(pushTriangle(triangle)) { //always true (efficient);
			depthTriangles.push(triangle);
		}
        return;
    }
	d = d -1;
	var v12 = v1.clone().add(v2).normalize();
    var v23 = v2.clone().add(v3).normalize();
    var v31 = v3.clone().add(v1).normalize();
    subdivide(v1, v12, v31, sphere_points, d);
    subdivide(v2, v23, v12, sphere_points, d);
    subdivide(v3, v31, v23, sphere_points, d);
    subdivide(v12, v23, v31, sphere_points, d);
}

function addAdjectProperty(v) {
	if(typeof v.adjacent =="undefined") {
		v.adjacent = new Array();
	}
}

function containsVector(v,vectors) {
	var contains = false;
	function checkVector(i) {
		if(i<vectors.length) {
			if(v.equals(vectors[i])) {
				//duplicateVertexCount++;
				contains =true;
			}else {
				checkVector(i+1);
			}
		}
	}
	checkVector(0);
	if(!contains) {
		 return v;
	}
}

//pretty sure this never gets called
//its a just in case
function pushTriangle(triangle) {
	var contains = false;
	function checkFace(i) {
		if(i<depthTriangles.length) {
			if(depthTriangles[i]!=null) {
				if(triangle.equals(depthTriangles[i])) {
					//duplicateTriangeCount++;
					contains =true;
				}
			}else {
				checkFace(i+1);
			}
		}
	}
	checkFace(0);
	if(!contains) {
		 return triangle;
	}
}


function initialize_sphere(sphere_points,depth) {
    tindices = [
	[0, 4, 1], [0, 9, 4 ],[ 9, 5, 4 ], [ 4, 5, 8 ], [ 4, 8, 1 ],
        [ 8, 10, 1 ], [ 8, 3, 10 ], [ 5, 3, 8 ], [ 5, 2, 3 ], [ 2, 7, 3 ],
        [ 7, 10, 3 ], [ 7, 6, 10 ], [ 7, 11, 6 ], [ 11, 0, 6 ],[ 0, 1, 6 ],
        [ 6, 1, 10 ], [ 9, 0, 11 ], [ 9, 11, 2 ], [ 9, 2, 5 ], [ 7, 2, 11 ]
    ];
	
    for(var i = 0; i < tindices.length; i++) {
        subdivide(vdata[tindices[i][0]], vdata[tindices[i][1]], vdata[tindices[i][2]], sphere_points, depth);
	}
	
}

function initVData() {
	vdata = [
        new THREE.Vector3(-X, 0.0, Z), new THREE.Vector3( X, 0.0, Z ), new THREE.Vector3( -X, 0.0, -Z ), new THREE.Vector3( X, 0.0, -Z ),
        new THREE.Vector3( 0.0, Z, X ), new THREE.Vector3( 0.0, Z, -X ), new THREE.Vector3( 0.0, -Z, X ), new THREE.Vector3( 0.0, -Z, -X ),
        new THREE.Vector3( Z, X, 0.0 ), new THREE.Vector3( -Z, X, 0.0 ), new THREE.Vector3( Z, -X, 0.0 ), new THREE.Vector3( -Z, -X, 0.0 )
    ]
}

/*
*	Generate entry point.
*
*/
function generatePoints(depth, radius) {
	var sphere_points = new Array();
	duplicateVertexCount = 0;
	duplicateTriangeCount = 0;
	depthTriangles = new Array();
	initialize_sphere(sphere_points, depth); // where DEPTH should be the subdivision depth
	depthVectors = sphere_points;
	document.getElementById("vertices").innerHTML = sphere_points.length;
}


/*
*	Expand plates.
*	If the vector is part of a plate checks if the adjacent vectors have plates.
*	If they do not they are assigned the starting vectors plates.
*	This function is not recursive and iterates through depthVector once.
*
*/
function expandPlates() {
	if(depthVectors) {
		for(i in depthVectors) { //for each vector
			if(depthVector[i].plate) { //if vector is part of a plate
				for(j in depthVector[i].adjacent) { //for each adjacent vector 
					if(!depthVector[i].adjacent[j].plate) { //if vector is not part of a plate
						depthVector[i].adjacent[j].plate = depthVector.plate; //add the vector to the plate
						depthVector[i].plate.vectors.push(depthVector[i].adjacent[j]); //add reference to the plate in the vector
					}
				}
			}
		}
	}
	
	for(i in plates) { //for each plate
		removePointCloud(depthVectors);
	}
}


/*
*	creates the initial plate seeds
*
*/
function generatePlates(plateCount) {
	seedVectorIndices = new Array();
	plates = new Array();
	var n=plateCount;
	while(n>0) {
		var plate = new Object();
		var num = Number.parseInt(Math.random()* depthVectors.length-1);
		while(seedVectorIndices.indexOf(num)!=-1) {
			num = Number.parseInt(Math.random()* depthVectors.length-1);
		}
		seedVectorIndices.push(num);
		
		//create plate
		plate.vectors = new Array();
		plate.vectors.push(depthVectors[num]); //add reference to the vector in the plate
		depthVectors[num].plate = plate; //add reference to the plate in the vector
		plate.color = new THREE.Color(Math.random(),Math.random(),Math.random());
		plate.pointSize = 1;
		plates.push(plate);
		n--;
	}
	
	//color folder hack
	if(colorFolder) {
		if(plateCount>plateColorCount) {
			while(plateCount>plateColorCount) {
				colorFolder.addColor(plates[plateColorCount], "color");
				colorFolder.add(plates[i], "pointSize");
				plateColorCount++;
			}
		}else if(plateCount<plateColorCount) {
			//TODO remove color
		}
	}else {
		colorFolder = daGui.addFolder('plate settings');
		for(i in plates) {
			colorFolder.addColor(plates[i], "color");
			colorFolder.add(plates[i], "pointSize");
			plateColorCount++;
		}
	}
}