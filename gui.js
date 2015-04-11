var daGui;

var generateParams = {
	depth: 0,
	radius: 1,
	scale: 1,
	sphereColor: 0xffffff,
	sphereOpacity: 0.1,
	sphereTransparent : true,
	basePointsColor: 0xFFFFFF,
	depthVertexColor: 0xFFFF00,
	faceMeshColor: 0x99CCFF,
	faceMeshOpacity: 1.0,
	faceMeshTransparent : false,
	faceMeshEnabled : false,
	plateCount: 1,
	generate: function() {
		isCalculating=true;
		nScale = generateParams.scale;
		radius = generateParams.radius;
		initVData();
		initSphereTemplate();
		generatePoints(Number.parseInt(generateParams.depth), radius);
		initPointCloud(vdata,0xFFFFFF);
		if(generateParams.faceMeshEnabled){
			initFaces();
		}
		
		generatePlates(generateParams.plateCount);
		document.getElementById("status").innerHTML = "depthVectors generated";
		document.getElementById("status").className = "ok";
		animate();
	},
	generatePlates: function() {
		if(plates){
			isCalculating=true;
			generatePlates(generateParams.plateCount);
			animate();
		}else {
			document.getElementById("status").innerHTML = "0 depthVectors. generate first";
			document.getElementById("status").className = "bad";
		}
	}
}

function initGUI() {
	daGui = new dat.GUI();

	daGui.add(generateParams, "depth",0,5).step(1);
	daGui.add(generateParams, "scale",1,5).step(1);
	daGui.addColor(generateParams, 'sphereColor');
	daGui.add(generateParams, "sphereOpacity",0,1);
	daGui.add(generateParams, "sphereTransparent");
	daGui.addColor(generateParams, 'depthVertexColor');
	daGui.addColor(generateParams, 'faceMeshColor');
	var faceController = daGui.add(generateParams, 'faceMeshEnabled');
	//daGui.add(generateParams, "faceMeshOpacity",0,1);
	//daGui.add(generateParams, "faceMeshTransparent");
	daGui.add(generateParams, "plateCount",1,5).step(1);
	daGui.add(generateParams, "generate");
	daGui.add(generateParams, "generatePlates");
	
	faceController.onChange(function(value) {
		if(generateParams.faceMeshEnabled){
			initFaces();
			animate();
		}else {
			scene.remove(depthFaces);
			animate();
		}
	});
}