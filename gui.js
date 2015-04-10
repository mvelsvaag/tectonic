var generateParams = {
	depth: 0,
	radius: 1,
	scale: 1,
	generate: function() {
		nScale = generateParams.scale;
		radius = generateParams.radius;
		initVData();
		initSphereTemplate();
		generatePoints(Number.parseInt(generateParams.depth), radius);
		initPointCloud(vdata,0xFFFFFF);
		initFaces();
	}
}

function initGUI() {
	var gui = new dat.GUI();

	gui.add(generateParams, "depth",0,5).step(1);
	gui.add(generateParams, "scale",1,100).step(1);
	gui.add(generateParams, "radius",1,10).step(1);;
	gui.add(generateParams, "generate");
}