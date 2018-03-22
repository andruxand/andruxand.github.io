/*
*  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
*
*  Use of this source code is governed by a BSD-style license
*  that can be found in the LICENSE file in the root of the source
*  tree.
*/

//Test browser support
const SUPPORTS_MEDIA_DEVICES = 'mediaDevices' in navigator;

if (SUPPORTS_MEDIA_DEVICES) {

	'use strict';
	
	var videoElement;
	var videoSelectb = document.querySelector('button#videoSourceb');
	var videoStart = document.querySelector('button#capture-button');
	var videoStop = document.querySelector('button#videoStop');
	var listDevices = [];
	var currentDevice = 0;
	
	function gotDevices(deviceInfos) {
		listDevice = [];	
	  
		for (var i = 0; i !== deviceInfos.length; ++i) {
			var deviceInfo = deviceInfos[i];
		
			if (deviceInfo.kind === 'videoinput') {
				listDevices.push(deviceInfo.deviceId);	
				console.log('Some other kind of source/device: ', deviceInfo);
				console.log('current dvices: ' + listDevices.length);
			}
		}
	}
	
	function gotStream(stream) {
		videoElement = document.querySelector('video');
		videoElement.srcObject = '';
		
		window.stream = stream; // make stream available to console
		videoElement.srcObject = stream;
		// get the active track of the stream
		const track = window.stream.getVideoTracks()[0];
		
		videoElement.addEventListener('loadedmetadata', (e) => {
			window.setTimeout(() => (
				onCapabilitiesReady(track.getCapabilities())
			), 500);
		});
		
		function onCapabilitiesReady(capabilities) {
			document.querySelector('div#devices').innerHTML = capabilities;
		}
		// Refresh button list in case labels have become available
		return navigator.mediaDevices.enumerateDevices();
	}
	
	function start() {
		if (window.stream) {
			window.stream.getTracks().forEach(function(track) {
				track.stop();
			});
		}
		var videoSource = listDevices[currentDevice]; //videoSelect.value; 
		var constraints = {
			facingMode: 'environment', 
			video: {deviceId: videoSource ? {exact: videoSource} : undefined}
		};
		
		navigator.mediaDevices.getUserMedia(constraints).
			then(gotStream).then(gotDevices).catch(handleError);
	}
	
	function stopCamera() {
		if (window.stream) {
			window.stream.getTracks().forEach(function(track) {
				track.stop();
			});
		}
	}
	
	function getDevice() {
		if (listDevices.length = 1){
			alert('No hay más Cámaras disponibles para este dispositivo');	
		}else{
			if (currentDevice + 1 <= listDevices.length - 1){
				currentDevice = currentDevice + 1;
			}else{
				currentDevice = 0;  
			}
			
			start();
		}
	}
	
	//videoSelect.onchange = start;
	videoSelectb.addEventListener('click', function(){
		getDevice();
	});	
	
	videoStart.addEventListener('click', function(){
		start();
	});
	
	videoStop.addEventListener('click', function(){
		stopCamera();
	});
	
	
	function handleError(error) {
		console.log('navigator.getUserMedia error: ', error);
	}

}
