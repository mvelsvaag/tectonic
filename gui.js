var daGui;
var plateGUI;

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
	plateCount: 0,
	generate: function() {
		createPlates();
	}
}

function refresh() {
	isCalculating=true;
		if(depthVectors) {
			removePointCloud(depthVectors);
			depthVector = null;
		}
		nScale = generateParams.scale;
		radius = generateParams.radius;
		
		isCalculating=true;
		initVData();
		initSphereTemplate();
		generatePoints(Number.parseInt(generateParams.depth), radius);
		updateSpherePointCloud(depthVectors,generateParams.depthVertexColor,generateParams.depthVertexSize);
		if(generateParams.faceMeshEnabled){
			initFaces();
		}
		animate();	
}

function createPlates() {
	plates = new Array();
	for(i=0;i<generateParams.plateCount;i++) {
		//create plate
		var plate = new Object();
		plate.vectors = new Array();
		plate.color = new THREE.Color(Math.random(),Math.random(),Math.random()).getHex();
		plate.pointSize = 3;
		plates.push(plate);
	}
	updateColorFolder();
}

function updateColorFolder() {
	var p = {
		seedPlates: function () {
			for(i in plates) {
				if(seedPlate(i)) {
					updateSpherePointCloud(plates[i].vectors,plates[i].color,plates[i].pointSize);
					animate();
				}
			}
		}
	};
	if(plateGUI) {
		plateGUI.destroy();
	}
	plateGUI = new dat.GUI();
	plateGUI.add(p, "seedPlates");
	for(i in plates) { //for each plate
		var colorController = plateGUI.addColor(plates[i], 'color');
		var sizeController = plateGUI.add(plates[i], 'pointSize',1,5).step(1);
	}
}

function initGUI() {
	daGui = new dat.GUI();

	var depthController = daGui.add(generateParams, "depth",0,5).step(1);
	var scaleController = daGui.add(generateParams, "scale",1,5).step(1);
	var faceController = daGui.add(generateParams, 'faceMeshEnabled');
	var sphereFolder = daGui.addFolder('sphere settings');
	var sphereColorController = sphereFolder.addColor(generateParams, 'sphereColor');
	var sphereOpacityController = sphereFolder.add(generateParams, "sphereOpacity",0,1);
	var sphereTransparentController = sphereFolder.add(generateParams, "sphereTransparent");
	
	var depthVectorFolder = daGui.addFolder('depthVector settings');
	var depthColorController = depthVectorFolder.addColor(generateParams, 'depthVertexColor');
	var depthSizeController = depthVectorFolder.add(generateParams, 'depthVertexSize',1,5).step(1);
	
	var faceMeshFolder = daGui.addFolder('faceMesh settings');
	var faceMeshColorController = faceMeshFolder.addColor(generateParams, 'faceMeshColor');
	daGui.add(generateParams, "generate");
	var plateCountController = daGui.add(generateParams, "plateCount",0,5).step(1);
	
	/*
	* gui callbacks
	* holy callbacks batman
	*/
	depthController.onChange(function(value) {
		refresh();
	});

	sphereColorController.onChange(function(value) {
		initSphereTemplate();
	});	
	sphereOpacityController.onChange(function(value) {
		initSphereTemplate();
		animate();
	});
	sphereTransparentController.onChange(function(value) {
		initSphereTemplate();
		animate();
	});
	
	scaleController.onChange(function(value) {
		refresh();
	});
	
	depthColorController.onChange(function(value) {
		updateSpherePointCloud(depthVectors,generateParams.depthVertexColor,generateParams.depthVertexSize);
	});
	depthSizeController.onChange(function(value) {
		updateSpherePointCloud(depthVectors,generateParams.depthVertexColor,generateParams.depthVertexSize);
	});
	
	faceMeshColorController.onChange(function(value) {
		if(!depthFaces) {
			refresh();
		}else {
			initFaces();
			if(!generateParams.faceMeshEnabled){
				document.getElementById("faces").innerHTML = 0;
				scene.remove(depthFaces);
				animate();
			}
		}
	});
	
	faceController.onChange(function(value) {
		if(!depthFaces) {
			refresh();
		}else {
			initFaces();
			if(!generateParams.faceMeshEnabled){
				document.getElementById("faces").innerHTML = 0;
				scene.remove(depthFaces);
				animate();
			}
		}
	});
	
	plateCountController.onChange(function(value) {
		createPlates();
	});
}