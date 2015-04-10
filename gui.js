var generateParams = {
	depth: 0,
	radius: 1,
	generate: function() {
		radius = generateParams.radius;
		initVData();
		initSphereTemplate();
		//generatePoints(generateParams.depth, 5);
		initPointCloud(vdata,"0xFFFFFF");
	}
}

function initGUI() {
	var gui = new dat.GUI();

	
	gui.add(generateParams, "depth",1,100);
	gui.add(generateParams, "radius",1,100);
	gui.add(generateParams, "generate");
}