import * as THREE from 'three';
// console.log("THREE loaded:", THREE);
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
// import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';
// import { LuminosityHighPassShader } from 'three/examples/jsm/shaders/LuminosityHighPassShader.js';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Linear } from 'gsap'; 
gsap.registerPlugin(ScrollTrigger);
import jQuery from 'jquery';
window.$ = window.jQuery = jQuery; // Make jQuery available globally (if you need it as $)


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

// var mapHeight = new THREE.TextureLoader().load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/68819/waveform-bump3.jpg', function( texture){
//   console.log("mapHeight loaded")
//   texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//     texture.offset.set( 0, 0 );
//     texture.repeat.set( 15, 1 );
// });

//create material
var material = new THREE.MeshPhongMaterial({
  // color: 0xff0000,
  side:THREE.BackSide,
  map: texture,
  shininess: 20,
  // bumpMap: mapHeight,
  // bumpScale: -.03,
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


// GSAP scroll animations =========================================
var cameraTargetPercentage = 0;
var currentCameraPercentage = 0;

gsap.defaultEase = Linear.easeNone;

var tubePerc = {
  percent: 0
}

gsap.registerPlugin(ScrollTrigger);


// Single scene (Tube travel)
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
//    duration: 100, //lower duration = faster travel
//    onUpdate: function() {
//      cameraTargetPercentage = tubePerc.percent;
//    }
// });

// Multiple scenes
var masterTimeline = gsap.timeline({
  scrollTrigger: {
      trigger: ".scrollTarget",
      start: "top top",
      end: "bottom 100%",
      scrub: 2,
      markers: {color: "white"}
  }
});

// Scene 1: Tube Travel
masterTimeline.to(tubePerc, {
  percent: .96,
  ease: Linear.easeNone,
  duration: 5,
  onUpdate: function() {
      cameraTargetPercentage = tubePerc.percent;
  }
})
// Scene 2: Transition to Open Space
.to(camera.position, {
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
// // Scene 3: New sphere in the open space
// .to({}, {
//   duration: 2,
//   onStart: function() {
//     console.log("Scene 3")
//       // Add new elements here
//       const geometry = new THREE.SphereGeometry(100, 32, 32);
//       const material = new THREE.MeshPhongMaterial({
//           color: 0xffffff,
//           emissive: 0xffffff,
//           emissiveIntensity: 0.5,
//           shininess: 100
//       });
//       const sphere = new THREE.Mesh(geometry, material);
//       sphere.position.set(0, 0, 50);
//       scene.add(sphere);

//       const sphereLight = new THREE.PointLight(0xffffff, 1, 1000);
//       sphereLight.position.set(0, 0, 50);
//       scene.add(sphereLight);
      
//       console.log("Sphere added at position:", sphere.position);
//   }
// });

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