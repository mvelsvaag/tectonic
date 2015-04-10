var X = 0.525731112119133606;
var Z = 0.850650808352039932;
var sphere_points = new Array();
var radius = 1;
var vdata, tindices;

vdata = [
        new THREE.Vector3(-X*radius, 0.0, Z*radius), new THREE.Vector3( X*radius, 0.0, Z*radius ), new THREE.Vector3( -X*radius, 0.0, -Z*radius ), new THREE.Vector3( X*radius, 0.0, -Z*radius ),
        new THREE.Vector3( 0.0, Z*radius, X*radius ), new THREE.Vector3( 0.0, Z*radius, -X*radius ), new THREE.Vector3( 0.0, -Z*radius, X*radius ), new THREE.Vector3( 0.0, -Z*radius, -X*radius ),
        new THREE.Vector3( Z*radius, X*radius, 0.0 ), new THREE.Vector3( -Z*radius, X*radius, 0.0 ), new THREE.Vector3( Z*radius, -X*radius, 0.0 ), new THREE.Vector3( -Z*radius, -X*radius, 0.0 )
    ];

function subdivide(v1, v2, v3, sphere_points, depth) {
    if(depth == 0) {
        sphere_points.push(v1);
        sphere_points.push(v2);
        sphere_points.push(v3);
        return;
    }
	/*
    var v12 = (v1 + v2).norm();
    var v23 = (v2 + v3).norm();
    var v31 = (v3 + v1).norm(); 
	*/
	var v12 = v1.clone().add(v2).normalize();
    var v23 = v2.clone().add(v3).normalize();
    var v31 = v3.clone().add(v1).normalize();
    subdivide(v1, v12, v31, sphere_points, depth - 1);
    subdivide(v2, v23, v12, sphere_points, depth - 1);
    subdivide(v3, v31, v23, sphere_points, depth - 1);
    subdivide(v12, v23, v31, sphere_points, depth - 1);
}
/*
static GLfloat vdata[12][3] = {    
   {-X, 0.0, Z}, {X, 0.0, Z}, {-X, 0.0, -Z}, {X, 0.0, -Z},    
   {0.0, Z, X}, {0.0, Z, -X}, {0.0, -Z, X}, {0.0, -Z, -X},    
   {Z, X, 0.0}, {-Z, X, 0.0}, {Z, -X, 0.0}, {-Z, -X, 0.0} 
};
static GLuint tindices[20][3] = { 
   {0,4,1}, {0,9,4}, {9,5,4}, {4,5,8}, {4,8,1},    
   {8,10,1}, {8,3,10}, {5,3,8}, {5,2,3}, {2,7,3},    
   {7,10,3}, {7,6,10}, {7,11,6}, {11,0,6}, {0,1,6}, 
   {6,1,10}, {9,0,11}, {9,11,2}, {9,2,5}, {7,2,11} };
   */

function initialize_sphere(sphere_points,depth) {
    tindices = [
	[0, 4, 1], [0, 9, 4 ],[ 9, 5, 4 ], [ 4, 5, 8 ], [ 4, 8, 1 ],
        [ 8, 10, 1 ], [ 8, 3, 10 ], [ 5, 3, 8 ], [ 5, 2, 3 ], [ 2, 7, 3 ],
        [ 7, 10, 3 ], [ 7, 6, 10 ], [ 7, 11, 6 ], [ 11, 0, 6 ],[ 0, 1, 6 ],
        [ 6, 1, 10 ], [ 9, 0, 11 ], [ 9, 11, 2 ], [ 9, 2, 5 ], [ 7, 2, 11 ]
    ];
	
    for(var i = 0; i < 20; i++) {
		console.log(tindices[i]);
        subdivide(vdata[tindices[i][0]], vdata[tindices[i][1]], vdata[tindices[i][2]], sphere_points, depth);
	}
	
}

function initVData() {
	vdata = [
        new THREE.Vector3(-X*radius, 0.0, Z*radius), new THREE.Vector3( X*radius, 0.0, Z*radius ), new THREE.Vector3( -X*radius, 0.0, -Z*radius ), new THREE.Vector3( X*radius, 0.0, -Z*radius ),
        new THREE.Vector3( 0.0, Z*radius, X*radius ), new THREE.Vector3( 0.0, Z*radius, -X*radius ), new THREE.Vector3( 0.0, -Z*radius, X*radius ), new THREE.Vector3( 0.0, -Z*radius, -X*radius ),
        new THREE.Vector3( Z*radius, X*radius, 0.0 ), new THREE.Vector3( -Z*radius, X*radius, 0.0 ), new THREE.Vector3( Z*radius, -X*radius, 0.0 ), new THREE.Vector3( -Z*radius, -X*radius, 0.0 )
    ]
}

function generatePoints(depth, radius) {
	
	initialize_sphere(sphere_points, depth); // where DEPTH should be the subdivision depth
	for (var point in sphere_points) {
		var point_tmp = point * radius;
	}
	console.log("done");
}

// Then for the sphere I want to draw, I  iterate over all the precomputed sphere points and with a linear function translate the sphere to its CENTER and chose the proper RADIUS