function getEdges() {

	sets.length = 0;
	sets.push([tindices[0][0],tindices[0][1]]);
	function includes(vArray,v) {
		return (vArray[0] === v || vArray[1] === v)
	}
	for (var i in tindices) {
		var exists = false;
		for (var s in sets) {
			if ((includes([tindices[i][0], tindices[i][1]], sets[s][0]) && includes([tindices[i][0], tindices[i][1]], sets[s][1]))) {
				exists = true;
				break;
			}
		}
		if (!exists) {
			sets.push([tindices[i][0], tindices[i][1]]);
			depthVectors[tindices[i][0]].adjacent.push(depthVectors[tindices[i][1]]);
			depthVectors[tindices[i][1]].adjacent.push(depthVectors[tindices[i][0]]);
			
		}
		exists = false;
		for (var s in sets) {
			if ((includes([tindices[i][2], tindices[i][1]], sets[s][0]) && includes([tindices[i][2], tindices[i][1]], sets[s][1]))) {
				exists = true;
				break;
			}
		}
		if (!exists) {
			sets.push([tindices[i][2], tindices[i][1]]);
			depthVectors[tindices[i][2]].adjacent.push(depthVectors[tindices[i][1]]);
			depthVectors[tindices[i][1]].adjacent.push(depthVectors[tindices[i][2]]);
		}
		exists = false;
		for (var s in sets) {
			if ((includes([tindices[i][0], tindices[i][2]], sets[s][0]) && includes([tindices[i][0],tindices[i][2]], sets[s][1]))) {
				exists = true;
				break;
			}
		}
		if (!exists) {
			sets.push([tindices[i][0], tindices[i][2]]);
			depthVectors[tindices[i][0]].adjacent.push(depthVectors[tindices[i][2]]);
			depthVectors[tindices[i][2]].adjacent.push(depthVectors[tindices[i][0]]);
		}
		exists = false;
		
	}
	return sets;
}
	

function getVectors() {
	/*
		need to get index position in depthVectors for each vector in each triangle.
		input are depthVectors and depthTriangles
		output is tindices.
		this output feeds into getEdges.  
		Once we have that set, its just loop through and draw edges.
	*/
	var tindices = new Array();
	for(var i = 0; i < depthTriangles.length; i++) {
		for(var j = 0; j < depthVectors.length; j++) {
			if(depthTriangles[i].a.equals(depthVectors[j])) {
				tindices.push([j])
				break;
			}
		}
		for(var j = 0; j < depthVectors.length; j++) {
			if(depthTriangles[i].b.equals(depthVectors[j])) {
				tindices[tindices.length - 1].push(j)
				break;
			}
		}
		for(var j = 0; j < depthVectors.length; j++) {
			if(depthTriangles[i].c.equals(depthVectors[j])) {
				tindices[tindices.length - 1].push(j)
				break;
			}
		}
	}
	return tindices;
}


