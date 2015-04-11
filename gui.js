var daGui;
var plateGUI;

var generateParams = {
	depth: 0,
	radius: 1,
	scale: 1,
	sphereColor: 0xffffff,
	sphereOpacity: 0.1,
	sphereTransparent : true,
	basePointsColor: 0x000000,
	basePointsSize: 1,
	depthVertexColor: 0xFFFFFF,
	depthVertexSize: 2,
	faceMeshColor: 0x99CCFF,
	faceMeshOpacity: 1.0,
	faceMeshTransparent : false,
	faceMeshEnabled : false,
	plateCount: 0,
	generatePlates: function() {
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

		initVData();
		initSphereTemplate();
		generatePoints(Number.parseInt(generateParams.depth), radius);
		updateSpherePointCloud(depthVectors,generateParams.depthVertexColor,generateParams.depthVertexSize);
		if(generateParams.faceMeshEnabled){
			initFaces();
		}
		if(plateGUI){
			removeAllPointClouds();
			createPlates();
		}
		animate();	
}

function createPlates() {
	plates = new Array();
	for(i=0;i<generateParams.plateCount;i++) {
		//create plate
		var plate = new Object();
		plate.vectors = new Array();
		plate.color = new THREE.Color(1,1,1).getHex(); //default plate color
		plate.animateExpand = false;
		plate.pointSize = 3;
		plate.vectorCount = "0";
		plate.expand = function() {
			expandPlate(plate);
			animate();
		}
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
		var	sizeController = plateGUI.add(plates[i], 'vectorCount');
		var colorController = plateGUI.addColor(plates[i], 'color');
		var sizeController = plateGUI.add(plates[i], 'pointSize',1,5).step(1);
		var expandPlate = plateGUI.add(plates[i], 'expand');
		
		colorController.onChange(function(value) {
			if(this.object.vectors) {
				updateSpherePointCloud(this.object.vectors,this.object.color,this.object.pointSize);
				animate();
			}
		});
		
		sizeController.onChange(function(value) {
			if(this.object.vectors) {
				updateSpherePointCloud(this.object.vectors,this.object.color,this.object.pointSize);
				animate();
			}
		});
	}
}

function updateGUIs() {
	if(daGui) {
		 for (var i in daGui.__controllers) {
			daGui.__controllers[i].updateDisplay();
		}
	}
	if(plateGUI) {
		 for (var i in plateGUI.__controllers) {
			plateGUI.__controllers[i].updateDisplay();
		}
	}
}

function initGUI() {
	daGui = new dat.GUI();

	var depthController = daGui.add(generateParams, "depth",0,5).step(1);
	var scaleController = daGui.add(generateParams, "scale",1,5).step(1);
	var sphereFolder = daGui.addFolder('sphere settings');
	var sphereColorController = sphereFolder.addColor(generateParams, 'sphereColor');
	var sphereOpacityController = sphereFolder.add(generateParams, "sphereOpacity",0,1);
	var sphereTransparentController = sphereFolder.add(generateParams, "sphereTransparent");
	
	var depthVectorFolder = daGui.addFolder('depthVector settings');
	var depthColorController = depthVectorFolder.addColor(generateParams, 'depthVertexColor');
	var depthSizeController = depthVectorFolder.add(generateParams, 'depthVertexSize',1,5).step(1);
	
	var faceMeshFolder = daGui.addFolder('faceMesh settings');
	var faceController = faceMeshFolder.add(generateParams, 'faceMeshEnabled');
	var faceMeshColorController = faceMeshFolder.addColor(generateParams, 'faceMeshColor');
	daGui.add(generateParams, "generatePlates");
	var plateCountController = daGui.add(generateParams, "plateCount",0,5).step(1);
	
	/*
	* gui callbacks
	* holy callbacks batman
	*/
	depthController.onChange(function(value) {
		refresh();
	});
	
	scaleController.onChange(function(value) {
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