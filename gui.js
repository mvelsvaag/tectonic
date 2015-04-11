var daGui;
var plateGUI;
var generateParams = {
	depth: 0,
	radius: 1,
	scale: 1,
	sphereMeshEnabled: true,
	sphereColor: 0xffffff,
	sphereOpacity: 0.1,
	sphereTransparent: true,
	basePointsColor: 0x000000,
	basePointsSize: 1,
	depthVertexColor: 0xFFFFFF,
	depthVertexSize: 2,
	faceMeshColor: 0x99CCFF,
	faceMeshOpacity: 1.0,
	faceMeshTransparent: false,
	faceMeshEnabled: false,
	plateCount: 0,
	generatePlates: function() {
		createPlates();
	}
}

function refresh() {
	isCalculating = true;
	if (depthVectors) {
		removePointCloud(depthVectors);
		depthVector = null;
	}
	nScale = generateParams.scale;
	radius = generateParams.radius;
	initVData();
	if (generateParams.sphereMeshEnabled) {
		updateSphereTemplate();
	}
	generatePoints(Number.parseInt(generateParams.depth), radius);
	updateSpherePointCloud(depthVectors, generateParams.depthVertexColor, generateParams.depthVertexSize);
	if (generateParams.faceMeshEnabled) {
		initFaces();
	}
	if (plateGUI) {
		createPlates();
	}
}

function createPlates() {
	if (plates) {
		removeAllPointClouds();
	}
	plates = new Array();
	for (i = 0; i < generateParams.plateCount; i++) {
		//create plate
		var plate = new Object();
		plate.vectors = new Array();
		plate.color = new THREE.Color(1, 1, 1).getHex(); //default plate color
		plate.animateExpand = false;
		plate.pointSize = 3;
		plate.vectorCount = "0";
		plates.push(plate);
	}
	updateColorFolder();
}

function plateGUIUpdated(value) {
	for (var i in plates) {
		updateSpherePointCloud(plates[i].vectors, plates[i].color, plates[i].pointSize);
	}
}

function updateColorFolder() {
	var p = {
		seedPlates: function() {
			for (var i in plates) {
				if (seedPlate(i)) {
					updateSpherePointCloud(plates[i].vectors, plates[i].color, plates[i].pointSize);
				}
			}
		},
		expandPlates: function() {
			for (var i in plates) {
				if (expandPlate(i)) {
					updateSpherePointCloud(plates[i].vectors, plates[i].color, plates[i].pointSize);
				}
			}
		}
	};
	if (plateGUI) {
		try {
			plateGUI.destroy();
		} catch (err) {}
	}
	if (plates.length > 0) {
		plateGUI = new dat.GUI();
		plateGUI.add(p, "seedPlates");
		plateGUI.add(p, "expandPlates");
		for (var i in plates) { //for each plate
			plateGUI.add(plates[i], 'vectorCount');
			var colorController = plateGUI.addColor(plates[i], 'color');
			var sizeController = plateGUI.add(plates[i], 'pointSize', 1, 5).step(1);
			colorController.onChange(function() {
				plateGUIUpdated()
			});
			sizeController.onChange(function() {
				plateGUIUpdated()
			});
		}
	}
}

function updateGUIs() {
	if (daGui) {
		for (var i in daGui.__controllers) {
			daGui.__controllers[i].updateDisplay();
		}
	}
	if (plateGUI) {
		for (var j in plateGUI.__controllers) {
			plateGUI.__controllers[j].updateDisplay();
		}
	}
}

function initGUI() {
	daGui = new dat.GUI();
	var depthController = daGui.add(generateParams, "depth", 0, 5).step(1);
	var scaleController = daGui.add(generateParams, "scale", 1, 5).step(1);
	var sphereFolder = daGui.addFolder('sphere settings');
	var sphereController = sphereFolder.add(generateParams, 'sphereMeshEnabled');
	var sphereColorController = sphereFolder.addColor(generateParams, 'sphereColor');
	var sphereOpacityController = sphereFolder.add(generateParams, "sphereOpacity", 0, 1);
	var sphereTransparentController = sphereFolder.add(generateParams, "sphereTransparent");
	var depthVectorFolder = daGui.addFolder('depthVector settings');
	var depthColorController = depthVectorFolder.addColor(generateParams, 'depthVertexColor');
	var depthSizeController = depthVectorFolder.add(generateParams, 'depthVertexSize', 1, 5).step(1);
	var faceMeshFolder = daGui.addFolder('faceMesh settings');
	var faceController = faceMeshFolder.add(generateParams, 'faceMeshEnabled');
	var faceMeshColorController = faceMeshFolder.addColor(generateParams, 'faceMeshColor');
	daGui.add(generateParams, "generatePlates");
	var plateCountController = daGui.add(generateParams, "plateCount", 0, 5).step(1);
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
	sphereController.onChange(function(value) {
		updateSphereTemplate();
	});
	sphereColorController.onChange(function(value) {
		initSphereTemplate();
	});
	sphereOpacityController.onChange(function(value) {
		initSphereTemplate();
	});
	sphereTransparentController.onChange(function(value) {
		initSphereTemplate();
	});
	depthColorController.onChange(function(value) {
		updateSpherePointCloud(depthVectors, generateParams.depthVertexColor, generateParams.depthVertexSize);
	});
	depthSizeController.onChange(function(value) {
		updateSpherePointCloud(depthVectors, generateParams.depthVertexColor, generateParams.depthVertexSize);
	});
	faceMeshColorController.onChange(function(value) {
		if (!depthFaces) {
			refresh();
		} else {
			initFaces();
			if (!generateParams.faceMeshEnabled) {
				document.getElementById("faces").innerHTML = 0;
				scene.remove(depthFaces);
			}
		}
	});
	faceController.onChange(function(value) {
		if (!depthFaces) {
			refresh();
		} else {
			initFaces();
			if (!generateParams.faceMeshEnabled) {
				document.getElementById("faces").innerHTML = 0;
				scene.remove(depthFaces);
			}
		}
	});
	plateCountController.onChange(function(value) {
		createPlates();
	});
}