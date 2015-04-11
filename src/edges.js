var sets = new Array();
var edgeSet = {
	addEdge: function(v1, v2) {
		this.edges.push([v1, v2]);
	},
	checkEdge: function(v1, v2) {
		var exists = false;
		var edges = this.edges;
		for (var i in edges) {
			if ((edges[i][0].equals(v1) && edges[i][1].equals(v2)) || (edges[i][0].equals(v2) && edges[i][1].equals(v1))) {
				exists = true;
				break;
			}
		}
		return exists;
	},
	drawEdge: function(v1, v2,color) {
		var material = new THREE.LineBasicMaterial({
			color: color
		});

		var geometry = new THREE.Geometry();
		geometry.vertices.push(
			v1,v2
		);

		var line = new THREE.Line( geometry, material );
		line.scale.set(nScale,nScale,nScale);
		scene.add( line );
	},

	connectEdges: function(vectors,color) {
		this.edges = new Array();
		for(var i in vectors) {
			for(var j in vectors[i].adjacent) {
				if(!this.checkEdge(vectors[i],vectors[i].adjacent[j])) {
					this.addEdge(vectors[i],vectors[i].adjacent[j]);
					this.drawEdge(vectors[i],vectors[i].adjacent[j],color);
				}
			}

		}
		return this.edges;
	}
}
	

