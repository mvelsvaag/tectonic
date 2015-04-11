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
		initSpherePointCloud(depthVectors,generateParams.depthVertexColor);
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

	var depthController = daGui.add(generateParams, "depth",0,5).step(1);
	daGui.add(generateParams, "scale",1,5).step(1);
	var sphereFolder = daGui.addFolder('sphere settings');
	sphereFolder.addColor(generateParams, 'sphereColor');
	sphereFolder.add(generateParams, "sphereOpacity",0,1);
	sphereFolder.add(generateParams, "sphereTransparent");
	
	var depthVectorFolder = daGui.addFolder('depthVector settings');
	var depthColorController = depthVectorFolder.addColor(generateParams, 'depthVertexColor');
	var faceMeshFolder = daGui.addFolder('faceMesh settings');
	var faceMeshColorController = faceMeshFolder.addColor(generateParams, 'faceMeshColor');
	var faceController = daGui.add(generateParams, 'faceMeshEnabled');
	
	//daGui.add(generateParams, "faceMeshOpacity",0,1);
	//daGui.add(generateParams, "faceMeshTransparent");
	var plateFolder = daGui.addFolder('plate settings');
	plateFolder.add(generateParams, "plateCount",1,5).step(1);
	
	daGui.add(generateParams, "generate");
	daGui.add(generateParams, "generatePlates");
	
	depthController.onChange(function(value) {
		generateParams.generate();
	});
	
	
	depthColorController.onChange(function(value) {
		initSpherePointCloud(depthVectors,generateParams.depthVertexColor);
		animate();
	});
	
	faceMeshColorController.onChange(function(value) {
		if(generateParams.faceMeshEnabled){
			initFaces();
			animate();
			console("");
		}else {
			console("remove");
			scene.remove(depthFaces);
			animate();
		}
	});
	
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