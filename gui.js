var daGui;
var plateFolder

var generateParams = {
	depth: 0,
	radius: 1,
	scale: 1,
	sphereColor: 0xffffff,
	sphereOpacity: 0.1,
	sphereTransparent : true,
	basePointsColor: 0xFFFFFF,
	basePointsSize: 1,
	depthVertexColor: 0xFFFF00,
	depthVertexSize: 2,
	faceMeshColor: 0x99CCFF,
	faceMeshOpacity: 1.0,
	faceMeshTransparent : false,
	faceMeshEnabled : false,
	plateCount: 1,
	generate: function() {
		if(depthVectors) {
			removePointCloud(depthVectors);
			depthVector = null;
		}
		isCalculating=true;
		nScale = generateParams.scale;
		radius = generateParams.radius;
		initVData();
		initSphereTemplate();
		generatePoints(Number.parseInt(generateParams.depth), radius);
		updateSpherePointCloud(depthVectors,generateParams.depthVertexColor,generateParams.depthVertexSize);
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
	var scaleController = daGui.add(generateParams, "scale",1,5).step(1);
	var faceController = daGui.add(generateParams, 'faceMeshEnabled');
	var plateCountController = daGui.add(generateParams, "plateCount",1,5).step(1);
	daGui.add(generateParams, "generate");
	var sphereFolder = daGui.addFolder('sphere settings');
	var sphereColorController = sphereFolder.addColor(generateParams, 'sphereColor');
	var sphereOpacityController = sphereFolder.add(generateParams, "sphereOpacity",0,1);
	var sphereTransparentController = sphereFolder.add(generateParams, "sphereTransparent");
	
	var depthVectorFolder = daGui.addFolder('depthVector settings');
	var depthColorController = depthVectorFolder.addColor(generateParams, 'depthVertexColor');
	var depthSizeController = depthVectorFolder.add(generateParams, 'depthVertexSize',1,5).step(1);
	
	var faceMeshFolder = daGui.addFolder('faceMesh settings');
	var faceMeshColorController = faceMeshFolder.addColor(generateParams, 'faceMeshColor');
	
	//daGui.add(generateParams, "faceMeshOpacity",0,1);
	//daGui.add(generateParams, "faceMeshTransparent");
	
	//daGui.add(generateParams, "generatePlates");
	
	/*
	* gui callbacks
	* holy callbacks batman
	*/
	depthController.onChange(function(value) {
		generateParams.generate();
	});
	
	sphereOpacityController.onChange(function(value) {
		generateParams.generate();
	});
	
	sphereTransparentController.onChange(function(value) {
		generateParams.generate();
	});
	
	scaleController.onChange(function(value) {
		generateParams.generate();
	});
	
	depthColorController.onChange(function(value) {
		generateParams.generate();
	});
	
	
	depthSizeController.onChange(function(value) {
		generateParams.generate();
	});
	
	faceMeshColorController.onChange(function(value) {
		if(generateParams.faceMeshEnabled){
			initFaces();
			animate();
			//console("");
		}else {
			//console("remove");
			scene.remove(depthFaces);
			animate();
		}
	});
	
	faceController.onChange(function(value) {
		generateParams.generate();
		if(!generateParams.faceMeshEnabled){
			scene.remove(depthFaces);
			animate();
		}
	});
	
	plateCountController.onChange(function(value) {
		generateParams.generate();
		generateParams.generatePlates();
		animate();
	});
}