import * as THREE from 'three';
// console.log("THREE loaded:", THREE);
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Linear } from 'gsap'; 
gsap.registerPlugin(ScrollTrigger);
import jQuery from 'jquery';
window.$ = window.jQuery = jQuery; // make jQuery available globally
import { WheelAdaptor } from 'three-story-controls'; 


var Mathutils = {
    normalize: function($value, $min, $max) {
        return ($value - $min) / ($max - $min);
    },
    interpolate: function($normValue, $min, $max) {
        return $min + ($max - $min) * $normValue;
    },
    map: function($value, $min1, $max1, $min2, $max2) {
        if ($value < $min1) {
            $value = $min1;
        }
        if ($value > $max1) {
            $value = $max1;
        }
        var res = this.interpolate(this.normalize($value, $min1, $max1), $min2, $max2);
        return res;
    }
};
var markers = [];


//Get window size
var ww = window.innerWidth,
  wh = window.innerHeight;

var composer, params = {
    exposure: 1.3,
    bloomStrength: .9,
    bloomThreshold: 0,
    bloomRadius: 0
  };

//Create a WebGL renderer
var renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas"),
  antialias: true,
  shadowMapEnabled: true,
  shadowMapType: THREE.PCFSoftShadowMap
});
renderer.setSize(ww, wh);

//Create an empty scene
var scene = new THREE.Scene();
// scene.background = new THREE.Color(0x000000); 
scene.fog = new THREE.Fog(0x000000,0,500);

var clock = new THREE.Clock();

//Create a perpsective camera
var cameraRotationProxyX = 3.14159;
var cameraRotationProxyY = 0;

var camera = new THREE.PerspectiveCamera(45, ww / wh, 0.001, 200);
camera.rotation.y = cameraRotationProxyX;
camera.rotation.z = cameraRotationProxyY;

//camera.position.z = 400;
var c = new THREE.Group();
c.position.z = 400;

c.add(camera);
scene.add(c);

//Set up render pass
var renderScene = new RenderPass(scene, camera);
var bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.renderToScreen = true;
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;
composer = new EffectComposer(renderer); //composer = new THREE.EffectComposer( renderer );
composer.setSize(window.innerWidth, window.innerHeight);
composer.addPass(renderScene);
composer.addPass(bloomPass);


//CREATE THE TUBE ===============================================
//array of points
var points = [
	[10, 89, 0],
	[50, 88, 10],
	[76, 139, 20],
	[126, 141, 12],
	[150, 112, 8],
	[157, 73, 0],
	[180, 44, 5],
	[207, 35, 10],
	[232, 36, 0]
];

var p1, p2, p3;

//convert the array of points into vertices
for (var i = 0; i < points.length; i++) {
  var x = points[i][0];
  var y = points[i][2];
  var z = points[i][1];
  points[i] = new THREE.Vector3(x, y, z);
}
//create a path from the points
var path = new THREE.CatmullRomCurve3(points);
//path.curveType = 'catmullrom';
path.tension = .5;

//create a new tube geometry with a different radius
var geometry = new THREE.TubeGeometry( path, 300, 5, 32, false );

//create texture
var texture = new THREE.TextureLoader().load( '/media/organic-tunnel.jpeg', function ( texture ) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set(0, 0);
    texture.repeat.set(3, 1);
});

//create local video texture
var localVideo = document.getElementById('localVideo');
var localVideoTexture = new THREE.VideoTexture(localVideo);
localVideo.src = '/media/tunnel-eye.mp4';
localVideo.play(); 
localVideoTexture.wrapS = texture.wrapT = THREE.RepeatWrapping;
localVideoTexture.offset.set(0, 0);
localVideoTexture.repeat.set(3, 1);

//create video texture of webcam
// var webcam = document.getElementById('video');
// var webcamTexture = new THREE.VideoTexture(webcam);
// webcamTexture.wrapS = webcamTexture.wrapT = THREE.RepeatWrapping;
// webcamTexture.offset.set(0, 0);
// webcamTexture.repeat.set(3, 15);
// webcamTexture.colorSpace = THREE.SRGBColorSpace;

// webcam initialization
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  const constraints = { 
      video: { 
          width: 1280, 
          height: 720, 
          facingMode: 'user' 
      } 
  };

  navigator.mediaDevices.getUserMedia(constraints)
      .then(function(stream) {
          // apply the stream to the video element used in the texture
          webcam.srcObject = stream;
          webcam.play();
      })
      .catch(function(error) {
          console.error('Unable to access the camera/webcam.', error);
      });
} else {
  console.error('MediaDevices interface not available.');
}

//create material
var material = new THREE.MeshPhongMaterial({
  // color: 0xff0000,
  side:THREE.BackSide,
  map: texture,
  // map:webcamTexture,
  // map: localVideoTexture,
  shininess: 20,
  specular: 0x0b2349
});

//create a mesh
var tube = new THREE.Mesh( geometry, material );
//tube.receiveShadows = true;

//Push the mesh into the scene
scene.add( tube );



//Wireframe / Inner tube =========================================
// //create a new geometry with a different radius
// var geometry = new THREE.TubeGeometry( path, 150, 3.4, 32, false );
// var geo = new THREE.EdgesGeometry( geometry );

// var mat = new THREE.LineBasicMaterial( {
//   linewidth: .1,
//   opacity: .1,
//   transparent: 1
// } );

// var wireframe = new THREE.LineSegments( geo, mat );
// scene.add( wireframe );


//Create lights in our scene =========================================
var light = new THREE.PointLight(0xffffff, .35, 4,0);
light.castShadow = true;
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, .3); 
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, .8); 
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

function updateCameraPercentage(percentage) {
  p1 = path.getPointAt(percentage%1);
  p2 = path.getPointAt((percentage + 0.03)%3);
  p3 = path.getPointAt((percentage + 0.05)% 1);

  c.position.set(p1.x,p1.y,p1.z);
  c.lookAt(p2);
  light.position.set(p2.x, p2.y, p2.z);
}


// SCROLL ANIMATIONS =========================================
let cameraTargetPercentage = 0;
let currentCameraPercentage = 0;
gsap.defaultEase = Linear.easeNone;
let tubePerc = {
  percent: 0
}
gsap.registerPlugin(ScrollTrigger);

let currentIndex = 0;

let texts = [
  document.getElementById('text1'),
  document.getElementById('text2'),
  document.getElementById('text3'),
  document.getElementById('text4'),
  document.getElementById('text5')
];

// Initial state
gsap.set(texts, { opacity: 0, scale: 0.8 });
// tube.material.opacity = 0;
// tube.material.transparent = true;

// // Use WheelAdaptor to scroll through the tunnel -----
// // no direction can be detected; meaning it's only moving forward and cannot move back)
// // set up wheel adaptor
// let wheelAdaptor = new WheelAdaptor({ type: 'discrete' })
// wheelAdaptor.connect();
// console.log('WheelAdaptor connected');

// wheelAdaptor.addEventListener('trigger', (e) => {
//   // Log initial state
//   console.log('Wheel event triggered');
  
//   currentIndex++;
//   console.log(currentIndex);

//   // Calculate target percentage
//   const targetPercent = currentIndex * increment;
//   console.log('Target percent:', targetPercent);
  
//   // Animate the camera movement
//   gsap.to(tubePerc, {
//     percent: targetPercent,
//     ease: Linear.easeNone,
//     duration: 1,
//     onUpdate: function() {
//       cameraTargetPercentage = tubePerc.percent;
//     },
//     onStart: () => {
//       // Show tube on first scroll
//       if (currentIndex === 1) {
//         gsap.to(tube.material, {
//           opacity: 1,
//           duration: 0.5
//         });
//       }
//     }
//   });
// });


// // Single scene (Tube travel) -----
// var tl = gsap.timeline({
//   scrollTrigger: {
//     trigger: ".scrollTarget",
//     start: "top top",
//     end: "bottom 100%",
//     scrub: 3, //lower scrub = faster stop; higher scrub = longer release (more slippery)
//     markers: {color: "white"}
//   }
// })
// tl.to(tubePerc, {
//    percent:.96,
//    ease: Linear.easeNone,
//    duration: 80, //lower duration = faster travel
//    onUpdate: function() {
//      cameraTargetPercentage = tubePerc.percent;
//    }
// });

// Multiple scenes -----
var masterTimeline = gsap.timeline({
  scrollTrigger: {
      trigger: ".scrollTarget",
      start: "top top",
      end: "bottom 100%",
      scrub: 3,
      markers: {color: "white"}
  }
});


// var masterTimeline = gsap.timeline({
//   scrollTrigger: {
//       trigger: ".scrollTarget",
//       start: "top top",
//       end: "bottom 100%",
//       scrub: 2,
//       markers: {color: "white"},
//       onUpdate: function(self) {
//           // Calculate which text should be visible based on progress
//           let progress = tubePerc.percent;
//           texts.forEach((text, index) => {
//               // Show text when within its 20% segment
//               let textStart = index * 0.2;  // 0, 0.2, 0.4, 0.6, 0.8
//               let textEnd = textStart + 0.2;
//               console.log("textStart: " + textStart);
//               console.log("textEnd: " + textEnd);
              
//               if (progress >= textStart && progress < textEnd) {
//                   gsap.to(text, {
//                       opacity: 1,
//                       scale: 1,
//                       duration: 0.5,
//                       ease: "power2.out"
//                   });
//               } else {
//                   gsap.to(text, {
//                       opacity: 0,
//                       scale: 0.8,
//                       duration: 0.5,
//                       ease: "power2.out"
//                   });
//               }
//           });
//       }
//   }
// });

// Scene 1: Tube Travel
masterTimeline.to(tubePerc, {
    percent: .96,
    ease: Linear.easeNone,
    duration: 120,
    onUpdate: function() {
        cameraTargetPercentage = tubePerc.percent;
        console.log("tubePerc.percent: " + tubePerc.percent);

        // update texts based on tube percentage
        texts.forEach((text, index) => {
            // divide the total tube range (0.96) into 5 equal segments
            let segmentSize = 0.96 / texts.length; // Each segment is ~0.192
            let textStart = index * segmentSize;
            let textEnd = textStart + segmentSize;
            
            // Calculate opacity based on position within segment
            if (tubePerc.percent >= textStart && tubePerc.percent < textEnd) {
                // Calculate how far we are into this segment (0 to 1)
                let segmentProgress = (tubePerc.percent - textStart) / segmentSize;
                
                console.log(`\nActive Text ${index + 1}:`);
                console.log(`Progress in segment: ${(segmentProgress * 100).toFixed(1)}%`);
                
                // Fade in during first 20% of segment, fade out during last 20%
                let opacity = 1;
                if (segmentProgress < 0.2) {
                    opacity = segmentProgress / 0.2; // Fade in
                } else if (segmentProgress > 0.8) {
                    opacity = 1 - ((segmentProgress - 0.8) / 0.2); // Fade out
                }
                
                text.style.opacity = opacity;
                text.style.transform = `scale(${0.8 + (0.2 * opacity)})`;
            } else {
                text.style.opacity = 0;
                text.style.transform = 'scale(0.8)';
            }
        });
    }
}, 0);

// Scene 2: Transition to Open Space
masterTimeline.to(camera.position, {
  z: 200,  // move camera back
  duration: 5,
  ease: "power1.inOut",
  onStart: function() {
    console.log("Scene 2");
      // Fade out the tube
      gsap.to(tube.material, {
          opacity: 0,
          duration: 1,
          ease: "power1.inOut"
      });
      // tube.material.transparent = true;
  }
})

//Create particles (stars) system =========================================
var ovumTexture = new THREE.TextureLoader().load('/media/ovum.png');
var particleSystem1, particleSystem2, particleSystem3;

// create particle systems
function createParticleSystem() {
    var particleCount = 6800;
    
    // Create geometries
    var particles1 = new THREE.BufferGeometry();
    var particles2 = new THREE.BufferGeometry();
    var particles3 = new THREE.BufferGeometry();
    
    // Create arrays to hold particle positions
    const positions1 = new Float32Array(particleCount * 3);
    const positions2 = new Float32Array(particleCount * 3);
    const positions3 = new Float32Array(particleCount * 3);

    // Fill the arrays with random positions
    for (let i = 0; i < particleCount; i++) {
        // For particles1
        positions1[i * 3] = Math.random() * 500 - 250; // x
        positions1[i * 3 + 1] = Math.random() * 50 - 25; // y
        positions1[i * 3 + 2] = Math.random() * 500 - 250; // z

        // For particles2
        positions2[i * 3] = Math.random() * 500; // x
        positions2[i * 3 + 1] = Math.random() * 10 - 5; // y
        positions2[i * 3 + 2] = Math.random() * 500; // z

        // For particles3
        positions3[i * 3] = Math.random() * 500; // x
        positions3[i * 3 + 1] = Math.random() * 10 - 5; // y
        positions3[i * 3 + 2] = Math.random() * 500; // z
    }

    // Add the positions to the geometries
    particles1.setAttribute('position', new THREE.BufferAttribute(positions1, 3));
    particles2.setAttribute('position', new THREE.BufferAttribute(positions2, 3));
    particles3.setAttribute('position', new THREE.BufferAttribute(positions3, 3));

    var pMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: .5,
        map: ovumTexture,
        transparent: true,
        blending: THREE.AdditiveBlending
    });

    // Create the particle systems
    particleSystem1 = new THREE.Points(particles1, pMaterial);
    particleSystem2 = new THREE.Points(particles2, pMaterial);
    particleSystem3 = new THREE.Points(particles3, pMaterial);

    // Add them to the scene
    scene.add(particleSystem1);
    scene.add(particleSystem2);
    scene.add(particleSystem3);
}

// Call the function after scene is created and before the render loop
createParticleSystem();

//Render =========================================
function render(){
  currentCameraPercentage = cameraTargetPercentage
  
  camera.rotation.y += (cameraRotationProxyX - camera.rotation.y) / 15;
  camera.rotation.x += (cameraRotationProxyY - camera.rotation.x) / 15;
  
  updateCameraPercentage(currentCameraPercentage);
  
  //animate particles (stars)
  if (particleSystem1) {
      particleSystem1.rotation.y += 0.0002;
      particleSystem2.rotation.x += 0.0005;
      particleSystem3.rotation.z += 0.0001;
  }
  
  //Render the scene
  //renderer.render(scene, camera);
  composer.render();

  requestAnimationFrame(render);
}
requestAnimationFrame(render);

$('canvas').click(function(){
  console.clear();
  markers.push(p1);
  console.log(JSON.stringify(markers));
});

window.addEventListener( 'resize', function () {
  
  var width = window.innerWidth;
  var height = window.innerHeight;
  
  camera.aspect = width / height;
	camera.updateProjectionMatrix();
  
  renderer.setSize( width, height );
  composer.setSize( width, height );
  
}, false );

//Mouse movement to control camera rotation =========================================
$(document).mousemove(function(evt) {
  cameraRotationProxyX = Mathutils.map(evt.clientX, 0, window.innerWidth, 3.24, 3.04);
  cameraRotationProxyY = Mathutils.map(evt.clientY, 0, window.innerHeight, -.1, .1);
});