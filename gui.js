var generateParams = {
	depth: 0,
	radius: 1,
	scale: 1,
	sphereColor: 0xffffff,
	sphereOpacity: 0.1,
	basePointsColor: 0xFFFFFF,
	depthVertexColor: 0xFFFF00,
	faceMeshColor: 0x99CCFF,
	faceMeshOpacity: 1.0,
	faceMeshTransparent : false,
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
	//gui.add(generateParams, "radius",1,10).step(1);;
	gui.addColor(generateParams, 'sphereColor');
	gui.add(generateParams, "sphereOpacity",0,1);
	gui.addColor(generateParams, 'basePointsColor');
	gui.addColor(generateParams, 'depthVertexColor');
	gui.addColor(generateParams, 'faceMeshColor');
	gui.add(generateParams, "sphereOpacity",0,1);
	gui.add(generateParams, "faceMeshTransparent");
	gui.add(generateParams, "generate");
}