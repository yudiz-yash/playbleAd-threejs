import * as THREE from 'three';
import * as dat from 'dat.gui';
// eslint-disable-next-line import/no-unresolved
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import LoaderManager from '../Manager/LoaderManager';
import { texture } from 'three/examples/jsm/nodes/Nodes.js';
import CannonDebugger from 'cannon-es-debugger';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import gsap from 'gsap';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { HueSaturationShader } from 'three/examples/jsm/shaders/HueSaturationShader.js';
import { BrightnessContrastShader } from 'three/examples/jsm/shaders/BrightnessContrastShader.js';

console.log(BrightnessContrastShader);

const container = document.getElementById('canvas-parent');
const width = container.clientWidth;
const height = container.clientHeight;
const device = {
  pixelRatio: window.devicePixelRatio
};
let movement = new THREE.Vector3(0, 0, 0);
let world, plateServeAnimation, cookMixer, playerMixer, standWithplates, idleAnimation, runAnimation, devotee1Mixer, devotee2Mixer, devotee3Mixer, devotee4Mixer, devotee5Mixer, devotee6Mixer, devotee7Mixer, devotee8Mixer, devotee9Mixer, devotee10Mixer;
let isPlatetaken = false;
let isEatenCount = 0;
let isPlateEaten = false;
let isPlateReadytoTake = false;
let plateCarryCount = 0;
let playerPlates = 0;
let platesArray = [];
let mixerArray = [];
let devoteePlates = [];
let tablePlates = [];
let flowerCount = 0;
let plateCapacity = 2;
let composer;
const originalConsoleWarn = console.warn;

const assets = [
  //////////////Models....
  {
    name: 'fullScene',
    gltf: 'public/assets/Models/bhandara_Area_low4.glb',
  },
  {
    name: 'kadhai',
    gltf: 'public/assets/Models/kadhai_solo.glb',
  },
  // {
  //   name: 'bentGate2',
  //   gltf: 'public/assets/Models/gate_bent.glb',
  // },
  // {
  //   name: 'Table1',
  //   gltf: 'public/assets/Models/table.glb',
  // },
  {
    name: 'Cook',
    gltf: 'public/assets/Models/food_making_pose.glb',
  },
  {
    name: 'player',
    gltf: 'public/assets/Models/pandit_pick_run_with_plates.glb',
  },
  {
    name: 'devotee1',
    gltf: 'public/assets/Animations/male_devotee_walk.glb',
  },
  {
    name: 'devotee2',
    gltf: 'public/assets/Animations/male_devotee_walk.glb',
  },
  {
    name: 'devotee3',
    gltf: 'public/assets/Animations/male_devotee_walk.glb',
  },
  {
    name: 'devotee4',
    gltf: 'public/assets/Animations/male_devotee_walk.glb',
  },
  {
    name: 'devotee5',
    gltf: 'public/assets/Animations/male_devotee_walk.glb',
  },
  {
    name: 'devotee6',
    gltf: 'public/assets/Animations/male_devotee_walk.glb',
  },
  {
    name: 'devotee7',
    gltf: 'public/assets/Animations/male_devotee_walk.glb',
  },
  {
    name: 'devotee8',
    gltf: 'public/assets/Animations/male_devotee_walk.glb',
  },
  {
    name: 'devotee9',
    gltf: 'public/assets/Animations/male_devotee_walk.glb',
  },
  {
    name: 'devotee10',
    gltf: 'public/assets/Animations/male_devotee_walk.glb',
  },
  {
    name: 'bhandara_plate',
    gltf: 'public/assets/Models/bhandara_thaali.glb',
  },
  {
    name: 'devotee1Plate',
    gltf: 'public/assets/Models/bhandara_thaali.glb',
  },
  {
    name: 'devotee2Plate',
    gltf: 'public/assets/Models/bhandara_thaali.glb',
  },
  {
    name: 'devotee3Plate',
    gltf: 'public/assets/Models/bhandara_thaali.glb',
  },
  {
    name: 'devotee4Plate',
    gltf: 'public/assets/Models/bhandara_thaali.glb',
  },
  {
    name: 'devotee5Plate',
    gltf: 'public/assets/Models/bhandara_thaali.glb',
  },
  {
    name: 'devotee6Plate',
    gltf: 'public/assets/Models/bhandara_thaali.glb',
  },
  {
    name: 'devotee7Plate',
    gltf: 'public/assets/Models/bhandara_thaali.glb',
  },
  {
    name: 'devotee8Plate',
    gltf: 'public/assets/Models/bhandara_thaali.glb',
  },
  {
    name: 'devotee9Plate',
    gltf: 'public/assets/Models/bhandara_thaali.glb',
  },
  {
    name: 'devotee10Plate',
    gltf: 'public/assets/Models/bhandara_thaali.glb',
  },
  {
    name: 'dustbin',
    gltf: 'public/assets/Models/dustbin.glb',
  },

  //////////////Textures....  


  ////////////////Animations....
  {
    name: 'pick-and-runAnimation',
    gltf: 'public/assets/Models/pandit_pick_run_with_plates.glb',
  },
  // {
  //   name: 'cookingAnimation',
  //   gltf: 'public/assets/Models/food_making_with_stick.glb',
  // },
  {
    name: 'IdleAnimation',
    gltf: 'public/assets/Models/pandit_idle_pose.glb',
  },
  {
    name: 'runningAnimation',
    gltf: 'public/assets/Models/pandit_running.glb',
  },
  {
    name: 'walkingAnimation',
    gltf: 'public/assets/Animations/male_devotee_walk.glb',
  },
  {
    name: 'idleDevoteeAnimation',
    gltf: 'public/assets/Models/male_devotee_idle.glb',
  },
  {
    name: 'idlePickPlateDevoteeAnimation',
    gltf: 'public/assets/Models/pandit_idle_with_plates_pose.glb',
  },
  {
    name: 'eatingAnimation',
    gltf: 'public/assets/Animations/female_devotee_sit.glb',
  },
  // {
  //   name: 'cookingAnimation',
  //   gltf: 'public/assets/Animations/dish_making_anim.glb',
  // },
]

export default class Three {
  constructor(canvas) {
    this.canvas = canvas;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      100,
      width / height,
      0.1,
      10000
    );
    this.camera.position.set(0, 0, 1);
    this.scene.add(this.camera);

    world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
    world.broadphase = new CANNON.NaiveBroadphase();

    this.cannonDebugRenderer = new CannonDebugger(this.scene, world);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(width, height);

    this.renderer.setPixelRatio(2);
    this.renderer.shadowMap.enabled = true;

    // Assuming 'renderer' is your Three.js renderer
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Use PCFSoftShadowMap for softer shadows

    // Increase the resolution of the shadow map
    this.renderer.shadowMap.width = 1920; // Adjust as needed
    this.renderer.shadowMap.height = 1080; // Adjust as needed

    // const gui = new dat.GUI();

    const values = {
      hue: 0.005,
      saturation: 0.09,
    };

    // Add controls to the GUI
    // gui.add(values, 'hue', -1, 1).onChange((value) => {
    //   hueSaturation.uniforms['hue'].value = value;
    // });
    // gui.add(values, 'saturation', -1, 1).onChange((value) => {
    //   hueSaturation.uniforms['saturation'].value = value;
    // });

    const brightnessContrastPass = new ShaderPass(BrightnessContrastShader);

    brightnessContrastPass.uniforms['contrast'].value = -0.2; // Adjust as needed

    // Hue and saturation adjustment
    const hueSaturation = new ShaderPass(HueSaturationShader);
    hueSaturation.uniforms['hue'].value = values.hue; // Convert from Unity's Hue Shift, which might need scaling
    hueSaturation.uniforms['saturation'].value = values.saturation;

    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    composer = new EffectComposer(this.renderer);
    composer.addPass(new RenderPass(this.scene, this.camera));
    composer.addPass(hueSaturation);
    composer.addPass(brightnessContrastPass);

    // this.controls = new OrbitControls(this.camera, this.canvas);

    console.warn = (message, ...args) => {
      // Check if the message is the one you want to ignore
      if (/THREE.PropertyBinding: No target node found for track/.test(message)) {
        return;
      }
      // Otherwise, use the original console.warn function
      originalConsoleWarn(message, ...args);
    };

    this.flowerCountElement = document.getElementById('flowerCount');

    this.clock = new THREE.Clock();

    LoaderManager.load(assets).then(() => {
      this.setLights();
      this.setGeometry();
      this.addColiders()
      this.addDevotees()
      this.addPlates()
      this.loadAnimation()
      this.addDustbin();
      // this.enableBtn()
      this.setControls();
      this.render();
      this.setResize();
    })
  }

  setLights() {
    this.ambientLight = new THREE.AmbientLight(new THREE.Color(1, 1, 1, 1));
    this.ambientLight.intensity = 1.8;
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
    this.directionalLight.position.set(-2.282, 4, -3.892);
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight);

    this.directionalLightTwo = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLightTwo.position.set(0, 4, 5);
    this.directionalLightTwo.castShadow = true;
    this.scene.add(this.directionalLightTwo);

    this.hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
    this.hemisphereLight.position.set(1.440, 2.799, 5.578);
    this.scene.add(this.hemisphereLight);
  }

  enableBtn() {

    if (flowerCount == 40) {
      const capacitybtn = document.getElementById('btnCapacity');
      const capacityHand = document.getElementById('capacityHand');
      capacitybtn.classList.add('active');
      capacityHand.classList.add('handVisible');

      capacitybtn.addEventListener('click', () => {
        plateCapacity += 2;
        capacitybtn.classList.remove('active');
        capacityHand.classList.remove('handVisible');
      })
    } else if (flowerCount >= 90) {
      const carpetbtn = document.getElementById('btnCarpet');
      const carpetHand = document.getElementById('carpetHand');
      carpetbtn.classList.add('active');
      carpetHand.classList.add('handVisible');

      carpetbtn.addEventListener('click', () => {
        const mat5 = this.traverseModel(this.model.scene.children, 'pPlane7001');
        mat5.visible = true;
        carpetbtn.classList.remove('active');
        carpetHand.classList.remove('handVisible');
        this.addLine();
      })
    }
  }

  setGeometry() {
    this.model = LoaderManager.assets['fullScene'].gltf;
    this.scene.add(this.model.scene);
    this.model.scene.position.set(1.359, 0, 1.534);
    this.model.scene.traverse((child) => {
      if (child.name === "pCube24") {
        child.receiveShadow = true;
        child.material.roughness = 1;
      }
      if (child.name === "pCube69") {
        // child.material.color = new THREE.Color(0x2b9500);
      }
      if (child.name === "kadhaiStandlegs_low" || child.name === "pCube30" || child.name === "pCube31") {
        child.castShadow = true;
      }
    });

    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x2b9500 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    this.scene.add(ground);

    const boundaries = this.model.scene.children[3];
    boundaries.material.emissiveIntensity = 100;
    const mat3 = this.traverseModel(this.model.scene.children, 'pPlane7001');
    mat3.visible = false;
    // const mat4 = this.traverseModel(this.model.scene.children, 'pPlane8');
    // mat4.visible = false;
    // const mat5 = this.traverseModel(this.model.scene.children, 'pPlane6');
    // mat5.visible = false;

    // const CounterTable = LoaderManager.assets['Table1'].gltf;
    // // this.scene.add(CounterTable.scene);
    // // CounterTable.scene.scale.set(0.1, 0.1, 0.1);
    // CounterTable.scene.position.set(1.35, 0, 1.51);

    const kadhai = LoaderManager.assets['kadhai'].gltf;
    this.scene.add(kadhai.scene);
    // CounterTable.scene.scale.set(0.1, 0.1, 0.1);
    kadhai.scene.position.set(1.359, 0, 1.54);

    const Cook = LoaderManager.assets['Cook'].gltf;
    console.log(Cook);
    this.scene.add(Cook.scene);
    this.cook = Cook
    Cook.scene.position.set(-0.300, 0.005, -0.350);
    Cook.scene.scale.set(0.08, 0.08, 0.08);
    Cook.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const player = LoaderManager.assets['player'].gltf;
    const plate = player.scene.children[0].children[1].children[0].children[0].children[0].children[2].children[0].children[0].children[0].children;
    for (let i = 5; i <= 9; i++) {
      const currentPlate = plate[i];
      currentPlate.material.metalness = 0;
      currentPlate.material.roughness = 0;
      platesArray.push(currentPlate);
      currentPlate.visible = false;
    }
    this.scene.add(player.scene);
    this.player = player
    player.scene.position.set(0, 0.00, 0.072);
    player.scene.scale.set(0.08, 0.08, 0.08);
    player.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
      }
    });

    const dustbin = LoaderManager.assets['dustbin'].gltf;
    this.scene.add(dustbin.scene);
    dustbin.scene.position.set(-0.275, 0.010, 0.029);
    dustbin.scene.scale.set(0.3, 0.3, 0.3);
    this.dustbin = dustbin.scene;

    const playerShape = new CANNON.Sphere(0.05);
    this.playerBody = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(this.player.scene.position.x, this.player.scene.position.y, this.player.scene.position.z),
      shape: playerShape
    });
    world.addBody(this.playerBody);


  }

  addDevotees() {
    function applyShadowMesh(model) {
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
        }
      });
    }
    this.devotee1 = LoaderManager.assets['devotee1'].gltf.scene;
    this.devotee1.name = "Devotee1";
    this.scene.add(this.devotee1);
    this.devotee1.renderOrder = 50;
    this.devotee1.position.set(0.18, 0.1, 1.38);
    this.devotee1.scale.set(0.07, 0.07, 0.07);
    applyShadowMesh(this.devotee1)
    // this.devotee1.rotation.set(0, Math.PI, 0);

    this.devotee2 = LoaderManager.assets['devotee2'].gltf.scene;
    this.devotee2.name = "Devotee2";
    this.scene.add(this.devotee2);
    this.devotee2.renderOrder = 51;
    this.devotee2.position.set(0.18, 0.1, 1.43);
    this.devotee2.scale.set(0.07, 0.07, 0.07);
    applyShadowMesh(this.devotee2)

    this.devotee3 = LoaderManager.assets['devotee3'].gltf.scene;
    this.devotee3.name = "Devotee3";
    this.scene.add(this.devotee3);
    this.devotee3.renderOrder = 52;
    this.devotee3.position.set(0.18, 0.1, 1.48);
    this.devotee3.scale.set(0.07, 0.07, 0.07);
    applyShadowMesh(this.devotee3)

    this.devotee4 = LoaderManager.assets['devotee4'].gltf.scene;
    this.devotee4.name = "Devotee4";
    this.scene.add(this.devotee4);
    this.devotee4.renderOrder = 53;
    this.devotee4.position.set(0.18, 0.1, 1.53);
    this.devotee4.scale.set(0.07, 0.07, 0.07);
    applyShadowMesh(this.devotee4)

    this.devotee5 = LoaderManager.assets['devotee5'].gltf.scene;
    this.devotee5.name = "Devotee5";
    this.scene.add(this.devotee5);
    this.devotee5.renderOrder = 54;
    this.devotee5.position.set(0.18, 0.1, 1.58);
    this.devotee5.scale.set(0.07, 0.07, 0.07);
    applyShadowMesh(this.devotee5)

    this.devotee6 = LoaderManager.assets['devotee6'].gltf.scene;
    this.devotee6.name = "Devotee6";
    this.scene.add(this.devotee6);
    this.devotee6.renderOrder = 55;
    this.devotee6.position.set(0.18, 0.1, 1.63);
    this.devotee6.scale.set(0.07, 0.07, 0.07);
    applyShadowMesh(this.devotee6)

    this.devotee7 = LoaderManager.assets['devotee7'].gltf.scene;
    this.devotee7.name = "Devotee7";
    this.scene.add(this.devotee7);
    this.devotee7.renderOrder = 56;
    this.devotee7.position.set(0.18, 0.1, 1.68);
    this.devotee7.scale.set(0.07, 0.07, 0.07);
    applyShadowMesh(this.devotee7)

    this.devotee8 = LoaderManager.assets['devotee8'].gltf.scene;
    this.devotee8.name = "Devotee8";
    this.scene.add(this.devotee8);
    this.devotee8.renderOrder = 57;
    this.devotee8.position.set(0.18, 0.1, 1.73);
    this.devotee8.scale.set(0.07, 0.07, 0.07);
    applyShadowMesh(this.devotee8)

    this.devotee9 = LoaderManager.assets['devotee9'].gltf.scene;
    this.devotee9.name = "Devotee9";
    this.scene.add(this.devotee9);
    this.devotee9.renderOrder = 58;
    this.devotee9.position.set(0.18, 0.1, 1.78);
    this.devotee9.scale.set(0.07, 0.07, 0.07);
    applyShadowMesh(this.devotee9)

    this.devotee10 = LoaderManager.assets['devotee10'].gltf.scene;
    this.devotee10.name = "Devotee10";
    this.scene.add(this.devotee10);
    this.devotee10.renderOrder = 59;
    this.devotee10.position.set(0.18, 0.1, 1.83);
    this.devotee10.scale.set(0.07, 0.07, 0.07);
    applyShadowMesh(this.devotee10)

    const devotee1Position = { x: 0.221, y: 0.01, z: 0.150 };
    const devotee2Position = { x: 0.221, y: 0.01, z: 0.300 };
    const devotee3Position = { x: 0.221, y: 0.01, z: 0.450 };
    const devotee4Position = { x: 0.221, y: 0.01, z: 0.600 };
    const devotee5Position = { x: 0.221, y: 0.01, z: 0.750 };
    const devotee6Position = { x: 0.069, y: 0.01, z: 0.098 };
    const devotee7Position = { x: 0.069, y: 0.01, z: 0.250 };
    const devotee8Position = { x: 0.069, y: 0.01, z: 0.400 };
    const devotee9Position = { x: 0.069, y: 0.01, z: 0.550 };
    const devotee10Position = { x: 0.069, y: 0.01, z: 0.700 };

    this.plate1 = LoaderManager.assets['devotee1Plate'].gltf;
    this.plate1.scene.position.set(devotee1Position.x - 0.070, devotee1Position.y, devotee1Position.z - 0.035);
    this.plate1.scene.name = "plate1Devotee";
    this.plate1.scene.scale.set(0.8, 0.8, 0.8);
    this.plate1.scene.visible = false;
    this.scene.add(this.plate1.scene);
    devoteePlates.push(this.plate1.scene);

    this.plate2 = LoaderManager.assets['devotee2Plate'].gltf;
    this.plate2.scene.position.set(devotee2Position.x - 0.070, devotee2Position.y, devotee2Position.z - 0.035);
    this.plate2.scene.name = "plate2Devotee";
    this.plate2.scene.scale.set(0.8, 0.8, 0.8);
    this.plate2.scene.visible = false;
    this.scene.add(this.plate2.scene);
    devoteePlates.push(this.plate2.scene);

    this.plate3 = LoaderManager.assets['devotee3Plate'].gltf;
    this.plate3.scene.position.set(devotee3Position.x - 0.070, devotee3Position.y, devotee3Position.z - 0.035);
    this.plate3.scene.name = "plate3Devotee";
    this.plate3.scene.scale.set(0.8, 0.8, 0.8);
    this.plate3.scene.visible = false;
    this.scene.add(this.plate3.scene);
    devoteePlates.push(this.plate3.scene);

    this.plate4 = LoaderManager.assets['devotee4Plate'].gltf;
    this.plate4.scene.position.set(devotee4Position.x - 0.070, devotee4Position.y, devotee4Position.z - 0.035);
    this.plate4.scene.name = "plate4Devotee";
    this.plate4.scene.scale.set(0.8, 0.8, 0.8);
    this.plate4.scene.visible = false;
    this.scene.add(this.plate4.scene);
    devoteePlates.push(this.plate4.scene);

    this.plate5 = LoaderManager.assets['devotee5Plate'].gltf;
    this.plate5.scene.position.set(devotee5Position.x - 0.070, devotee5Position.y, devotee5Position.z - 0.035);
    this.plate5.scene.name = "plate5Devotee";
    this.plate5.scene.visible = false;
    this.plate5.scene.scale.set(0.8, 0.8, 0.8);
    this.scene.add(this.plate5.scene);
    devoteePlates.push(this.plate5.scene);

    this.plate6 = LoaderManager.assets['devotee6Plate'].gltf;
    this.plate6.scene.position.set(devotee6Position.x + 0.045, devotee6Position.y, devotee6Position.z - 0.035);
    this.plate6.scene.name = "plate6Devotee";
    this.plate6.scene.scale.set(0.8, 0.8, 0.8);
    this.plate6.scene.visible = false;
    this.scene.add(this.plate6.scene);
    devoteePlates.push(this.plate6.scene);

    this.plate7 = LoaderManager.assets['devotee7Plate'].gltf;
    this.plate7.scene.position.set(devotee7Position.x + 0.045, devotee7Position.y, devotee7Position.z - 0.035);
    this.plate7.scene.name = "plate7Devotee";
    this.plate7.scene.visible = false;
    this.plate7.scene.scale.set(0.8, 0.8, 0.8);
    this.scene.add(this.plate7.scene);
    devoteePlates.push(this.plate7.scene);

    this.plate8 = LoaderManager.assets['devotee8Plate'].gltf;
    this.plate8.scene.position.set(devotee8Position.x + 0.045, devotee8Position.y, devotee8Position.z - 0.035);
    this.plate8.scene.name = "plate8Devotee";
    this.plate8.scene.visible = false;
    this.plate8.scene.scale.set(0.8, 0.8, 0.8);
    this.scene.add(this.plate8.scene);
    devoteePlates.push(this.plate8.scene);

    this.plate9 = LoaderManager.assets['devotee9Plate'].gltf;
    this.plate9.scene.position.set(devotee9Position.x + 0.045, devotee9Position.y, devotee9Position.z - 0.035);
    this.plate9.scene.name = "plate9Devotee";
    this.plate9.scene.visible = false;
    this.plate9.scene.scale.set(0.8, 0.8, 0.8);
    this.scene.add(this.plate9.scene);
    devoteePlates.push(this.plate9.scene);

    this.plate10 = LoaderManager.assets['devotee10Plate'].gltf;
    this.plate10.scene.position.set(devotee10Position.x + 0.045, devotee10Position.y, devotee10Position.z - 0.035);
    this.plate10.scene.name = "plate10Devotee";
    this.plate10.scene.visible = false;
    this.plate1.scene.scale.set(0.8, 0.8, 0.8);
    this.scene.add(this.plate10.scene);
    devoteePlates.push(this.plate10.scene);

    this.line1Animation()

  }

  line1Animation() {
    const devotee1Position = { x: 0.221, y: 0.009, z: 0.150 };
    const devotee2Position = { x: 0.221, y: 0.009, z: 0.300 };
    const devotee3Position = { x: 0.221, y: 0.009, z: 0.450 };
    const devotee4Position = { x: 0.221, y: 0.009, z: 0.600 };
    const devotee5Position = { x: 0.221, y: 0.009, z: 0.750 };

    gsap.to(this.devotee1.position, {
      duration: 5, ...devotee1Position, ease: "linear", onComplete: () => {
        this.devotee1.rotation.y = Math.PI / 2
        this.devotee1.readyToEat = true;
        this.devotee1RunAnimation.stop()
        // this.devotee1IdleAnimation.play();
        this.devotee1EatAnimation.setLoop(THREE.LoopOnce); // Set the loop mode to LoopOnce
        this.devotee1EatAnimation.clampWhenFinished = true;
        this.devotee1EatAnimation.play();
        console.warn = originalConsoleWarn;
        // this.devotee1Mixer.stopAllAction(); // Stop the mixer for devotee1
      }
    });
    gsap.to(this.devotee2.position, {
      duration: 5, ...devotee2Position, ease: "linear", delay: 5, onComplete: () => {
        this.devotee2.rotation.y = Math.PI / 2
        this.devotee2.readyToEat = true;
        this.devotee2RunAnimation.stop()
        // this.devotee2IdleAnimation.play();
        this.devotee2EatAnimation.setLoop(THREE.LoopOnce); // Set the loop mode to LoopOnce
        this.devotee2EatAnimation.clampWhenFinished = true;
        this.devotee2EatAnimation.play();
        console.warn = originalConsoleWarn;
        // this.devotee2Mixer.stopAllAction(); // Stop the mixer for devotee2
      }
    });
    gsap.to(this.devotee3.position, {
      duration: 5, ...devotee3Position, ease: "linear", delay: 7, onComplete: () => {
        this.devotee3.rotation.y = Math.PI / 2
        this.devotee3.readyToEat = true;
        this.devotee3RunAnimation.stop()
        // this.devotee3IdleAnimation.play();
        this.devotee3EatAnimation.setLoop(THREE.LoopOnce); // Set the loop mode to LoopOnce
        this.devotee3EatAnimation.clampWhenFinished = true;
        this.devotee3EatAnimation.play();
        console.warn = originalConsoleWarn;
        // this.devotee3Mixer.stopAllAction(); // Stop the mixer for devotee3
      }
    });
    gsap.to(this.devotee4.position, {
      duration: 5, ...devotee4Position, ease: "linear", delay: 9, onComplete: () => {
        this.devotee4.rotation.y = Math.PI / 2
        this.devotee4.readyToEat = true;
        this.devotee4RunAnimation.stop()
        // this.devotee4IdleAnimation.play();
        this.devotee4EatAnimation.setLoop(THREE.LoopOnce); // Set the loop mode to LoopOnce
        this.devotee4EatAnimation.clampWhenFinished = true;
        this.devotee4EatAnimation.play();
        console.warn = originalConsoleWarn;
        // this.devotee4Mixer.stopAllAction(); // Stop the mixer for devotee4
      }
    });
    gsap.to(this.devotee5.position, {
      duration: 5, ...devotee5Position, ease: "linear", delay: 11, onComplete: () => {
        this.devotee5.rotation.y = Math.PI / 2
        this.devotee5.readyToEat = true;
        this.devotee5RunAnimation.stop()
        // this.devotee5IdleAnimation.play();
        this.devotee5EatAnimation.setLoop(THREE.LoopOnce); // Set the loop mode to LoopOnce
        this.devotee5EatAnimation.clampWhenFinished = true;
        this.devotee5EatAnimation.play();
        console.warn = originalConsoleWarn;
        // this.devotee5Mixer.stopAllAction(); // Stop the mixer for devotee5
        isPlateReadytoTake = false;
        plateCarryCount = 0;
      }
    });
  }

  addLine() {
    this.devotee6RunAnimation.play();
    this.devotee7RunAnimation.play();
    this.devotee8RunAnimation.play();
    this.devotee9RunAnimation.play();
    this.devotee10RunAnimation.play();

    const devotee6Position = { x: 0.069, y: 0.009, z: 0.098 };
    const devotee7Position = { x: 0.069, y: 0.009, z: 0.250 };
    const devotee8Position = { x: 0.069, y: 0.009, z: 0.400 };
    const devotee9Position = { x: 0.069, y: 0.009, z: 0.550 };
    const devotee10Position = { x: 0.069, y: 0.009, z: 0.700 };

    gsap.to(this.devotee6.position, {
      duration: 5, ...devotee6Position, ease: "linear", delay: 1, onComplete: () => {
        this.devotee6.rotation.y = -Math.PI / 2
        this.devotee6.readyToEat = true;
        this.devotee6RunAnimation.stop()
        this.devotee6EatAnimation.setLoop(THREE.LoopOnce); // Set the loop mode to LoopOnce
        this.devotee6EatAnimation.clampWhenFinished = true;
        this.devotee6EatAnimation.play();
        console.warn = originalConsoleWarn;
        // this.devotee6Mixer.stopAllAction(); // Stop the mixer for devotee6
      }
    });
    gsap.to(this.devotee7.position, {
      duration: 5, ...devotee7Position, ease: "linear", delay: 2, onComplete: () => {
        this.devotee7.rotation.y = -Math.PI / 2
        this.devotee7.readyToEat = true;
        this.devotee7RunAnimation.stop()
        this.devotee7EatAnimation.setLoop(THREE.LoopOnce); // Set the loop mode to LoopOnce
        this.devotee7EatAnimation.clampWhenFinished = true;
        this.devotee7EatAnimation.play();
        console.warn = originalConsoleWarn;
        // this.devotee7Mixer.stopAllAction(); // Stop the mixer for devotee7
      }
    });
    gsap.to(this.devotee8.position, {
      duration: 5, ...devotee8Position, ease: "linear", delay: 3, onComplete: () => {
        this.devotee8.rotation.y = -Math.PI / 2
        this.devotee8.readyToEat = true;
        this.devotee8RunAnimation.stop()
        this.devotee8EatAnimation.setLoop(THREE.LoopOnce); // Set the loop mode to LoopOnce
        this.devotee8EatAnimation.clampWhenFinished = true;
        this.devotee8EatAnimation.play();
        console.warn = originalConsoleWarn;
        // this.devotee8Mixer.stopAllAction(); // Stop the mixer for devotee8
      }
    });
    gsap.to(this.devotee9.position, {
      duration: 5, ...devotee9Position, ease: "linear", delay: 4, onComplete: () => {
        this.devotee9.rotation.y = -Math.PI / 2
        this.devotee9.readyToEat = true;
        this.devotee9RunAnimation.stop()
        this.devotee9EatAnimation.setLoop(THREE.LoopOnce); // Set the loop mode to LoopOnce
        this.devotee9EatAnimation.clampWhenFinished = true;
        this.devotee9EatAnimation.play();
        console.warn = originalConsoleWarn;
        // this.devotee9Mixer.stopAllAction(); // Stop the mixer for devotee9
      }
    });
    gsap.to(this.devotee10.position, {
      duration: 5, ...devotee10Position, ease: "linear", delay: 5, onComplete: () => {
        this.devotee10.rotation.y = -Math.PI / 2
        this.devotee10.readyToEat = true;
        this.devotee10RunAnimation.stop()
        this.devotee10EatAnimation.setLoop(THREE.LoopOnce); // Set the loop mode to LoopOnce
        this.devotee10EatAnimation.clampWhenFinished = true;
        this.devotee10EatAnimation.play();
        console.warn = originalConsoleWarn;
        // this.devotee10Mixer.stopAllAction(); // Stop the mixer for devotee10
        isPlateReadytoTake = false;
        plateCarryCount = 0;
      }
    });
  }

  loadAnimation() {
    // const cookingAnim = LoaderManager.assets['cookingAnimation'].gltf;
    const hathJodo = LoaderManager.assets['pick-and-runAnimation'].gltf;
    const idle = LoaderManager.assets['IdleAnimation'].gltf;
    const idleDevotee = LoaderManager.assets['idleDevoteeAnimation'].gltf;
    const run = LoaderManager.assets['runningAnimation'].gltf;
    const walk = LoaderManager.assets['walkingAnimation'].gltf;
    const eating = LoaderManager.assets['eatingAnimation'].gltf;
    const plateCarringIdle = LoaderManager.assets['idlePickPlateDevoteeAnimation'].gltf;
    // eating.scene.scale.set(0.07, 0.07, 0.07);

    // const clip1 = cookingAnim.animations[0];
    const clip2 = hathJodo.animations[0];
    const clip3 = idle.animations[0];
    const clip4 = run.animations[1];
    const clip5 = walk.animations[0];
    const clip6 = idleDevotee.animations[0];
    const clip7 = eating.animations[0];
    const clip8 = plateCarringIdle.animations[0];

    cookMixer = new THREE.AnimationMixer(this.cook.scene);
    playerMixer = new THREE.AnimationMixer(this.player.scene);

    devotee1Mixer = new THREE.AnimationMixer(this.devotee1);
    devotee2Mixer = new THREE.AnimationMixer(this.devotee2);
    devotee3Mixer = new THREE.AnimationMixer(this.devotee3);
    devotee4Mixer = new THREE.AnimationMixer(this.devotee4);
    devotee5Mixer = new THREE.AnimationMixer(this.devotee5);
    devotee6Mixer = new THREE.AnimationMixer(this.devotee6);
    devotee7Mixer = new THREE.AnimationMixer(this.devotee7);
    devotee8Mixer = new THREE.AnimationMixer(this.devotee8);
    devotee9Mixer = new THREE.AnimationMixer(this.devotee9);
    devotee10Mixer = new THREE.AnimationMixer(this.devotee10);

    this.devotee1RunAnimation = devotee1Mixer.clipAction(clip5);
    this.devotee2RunAnimation = devotee2Mixer.clipAction(clip5);
    this.devotee3RunAnimation = devotee3Mixer.clipAction(clip5);
    this.devotee4RunAnimation = devotee4Mixer.clipAction(clip5);
    this.devotee5RunAnimation = devotee5Mixer.clipAction(clip5);
    this.devotee6RunAnimation = devotee6Mixer.clipAction(clip5);
    this.devotee7RunAnimation = devotee7Mixer.clipAction(clip5);
    this.devotee8RunAnimation = devotee8Mixer.clipAction(clip5);
    this.devotee9RunAnimation = devotee9Mixer.clipAction(clip5);
    this.devotee10RunAnimation = devotee10Mixer.clipAction(clip5);

    this.devotee1IdleAnimation = devotee1Mixer.clipAction(clip6);
    this.devotee2IdleAnimation = devotee2Mixer.clipAction(clip6);
    this.devotee3IdleAnimation = devotee3Mixer.clipAction(clip6);
    this.devotee4IdleAnimation = devotee4Mixer.clipAction(clip6);
    this.devotee5IdleAnimation = devotee5Mixer.clipAction(clip6);
    this.devotee6IdleAnimation = devotee6Mixer.clipAction(clip6);
    this.devotee7IdleAnimation = devotee7Mixer.clipAction(clip6);
    this.devotee8IdleAnimation = devotee8Mixer.clipAction(clip6);
    this.devotee9IdleAnimation = devotee9Mixer.clipAction(clip6);
    this.devotee10IdleAnimation = devotee10Mixer.clipAction(clip6);

    this.devotee1EatAnimation = devotee1Mixer.clipAction(clip7);
    this.devotee2EatAnimation = devotee2Mixer.clipAction(clip7);
    this.devotee3EatAnimation = devotee3Mixer.clipAction(clip7);
    this.devotee4EatAnimation = devotee4Mixer.clipAction(clip7);
    this.devotee5EatAnimation = devotee5Mixer.clipAction(clip7);
    this.devotee6EatAnimation = devotee6Mixer.clipAction(clip7);
    this.devotee7EatAnimation = devotee7Mixer.clipAction(clip7);
    this.devotee8EatAnimation = devotee8Mixer.clipAction(clip7);
    this.devotee9EatAnimation = devotee9Mixer.clipAction(clip7);
    this.devotee10EatAnimation = devotee10Mixer.clipAction(clip7);

    this.devotee1RunAnimation.setLoop(THREE.LoopRepeat);
    this.devotee2RunAnimation.setLoop(THREE.LoopRepeat);
    this.devotee3RunAnimation.setLoop(THREE.LoopRepeat);
    this.devotee4RunAnimation.setLoop(THREE.LoopRepeat);
    this.devotee5RunAnimation.setLoop(THREE.LoopRepeat);
    this.devotee6RunAnimation.setLoop(THREE.LoopRepeat);
    this.devotee7RunAnimation.setLoop(THREE.LoopRepeat);
    this.devotee8RunAnimation.setLoop(THREE.LoopRepeat);
    this.devotee9RunAnimation.setLoop(THREE.LoopRepeat);
    this.devotee10RunAnimation.setLoop(THREE.LoopRepeat);

    this.devotee1IdleAnimation.setLoop(THREE.LoopRepeat);
    this.devotee2IdleAnimation.setLoop(THREE.LoopRepeat);
    this.devotee3IdleAnimation.setLoop(THREE.LoopRepeat);
    this.devotee4IdleAnimation.setLoop(THREE.LoopRepeat);
    this.devotee5IdleAnimation.setLoop(THREE.LoopRepeat);
    this.devotee6IdleAnimation.setLoop(THREE.LoopRepeat);
    this.devotee7IdleAnimation.setLoop(THREE.LoopRepeat);
    this.devotee8IdleAnimation.setLoop(THREE.LoopRepeat);
    this.devotee9IdleAnimation.setLoop(THREE.LoopRepeat);
    this.devotee10IdleAnimation.setLoop(THREE.LoopRepeat);

    // this.devotee1EatAnimation.setLoop(THREE.LoopRepeat);
    // this.devotee2EatAnimation.setLoop(THREE.LoopRepeat);
    // this.devotee3EatAnimation.setLoop(THREE.LoopRepeat);
    // this.devotee4EatAnimation.setLoop(THREE.LoopRepeat);
    // this.devotee5EatAnimation.setLoop(THREE.LoopRepeat);
    // this.devotee6EatAnimation.setLoop(THREE.LoopRepeat);
    // this.devotee7EatAnimation.setLoop(THREE.LoopRepeat);
    // this.devotee8EatAnimation.setLoop(THREE.LoopRepeat);
    // this.devotee9EatAnimation.setLoop(THREE.LoopRepeat);
    // this.devotee10EatAnimation.setLoop(THREE.LoopRepeat);

    this.devotee1RunAnimation.play();
    this.devotee2RunAnimation.play();
    this.devotee3RunAnimation.play();
    this.devotee4RunAnimation.play();
    this.devotee5RunAnimation.play();

    mixerArray = [cookMixer, playerMixer, devotee1Mixer, devotee2Mixer, devotee3Mixer, devotee4Mixer, devotee5Mixer, devotee6Mixer, devotee7Mixer, devotee8Mixer, devotee9Mixer, devotee10Mixer];

    // cookAnimation = cookMixer.clipAction(clip1);
    plateServeAnimation = playerMixer.clipAction(clip2);
    idleAnimation = playerMixer.clipAction(clip3);
    runAnimation = playerMixer.clipAction(clip4);
    standWithplates = playerMixer.clipAction(clip8);

    // cookAnimation.setLoop(THREE.LoopRepeat);
    plateServeAnimation.setLoop(THREE.LoopRepeat);
    idleAnimation.setLoop(THREE.LoopRepeat);
    runAnimation.setLoop(THREE.LoopRepeat);
    standWithplates.setLoop(THREE.LoopRepeat);

    // cookAnimation.play();
    idleAnimation.play();
    // plateServeAnimation.play();

    console.warn = originalConsoleWarn;

  }

  setControls() {
    let isPointerDown = false;
    let initialPointerPosition = { x: 0, y: 0 };

    const onPointerDown = (event) => {
      isPointerDown = true;
      runAnimation.play();
      console.warn = originalConsoleWarn;
      if (event.touches) {
        initialPointerPosition.x = event.touches[0].clientX;
        initialPointerPosition.y = event.touches[0].clientY;
      } else {
        initialPointerPosition.x = event.clientX;
        initialPointerPosition.y = event.clientY;
      }
    };

    const onPointerMove = (event) => {
      event.preventDefault(); // Prevent default touch behavior like scrolling
      if (isPointerDown) {

        if (isPlatetaken) {
          runAnimation.stop()
          standWithplates.stop();
          plateServeAnimation.play();
        } else {
          standWithplates.stop();
          plateServeAnimation.stop();
          idleAnimation.stop();
          runAnimation.play();
        }

        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;

        const deltaX = clientX - initialPointerPosition.x;
        const deltaY = clientY - initialPointerPosition.y;
        if (isPlatetaken) {
          plateServeAnimation.play();
        } else {
          runAnimation.play();
        }


        // Calculate angle

        let angle = Math.atan2(deltaX, deltaY);

        // Convert radians to degrees
        let angleDegrees = angle * (180 / Math.PI);

        // Set player rotation
        this.player.scene.rotation.y = angle;


        // Set movement
        const moveSpeed = 0.004;
        movement.x = Math.sin(angle) * moveSpeed;
        movement.z = Math.cos(angle) * moveSpeed;

        // animations.walk.play();
      }
    };

    const onPointerUp = () => {
      // animations.walk.stop()
      isPointerDown = false;
      movement.x = 0;
      movement.z = 0;
      // playerMixer.stopAllAction();
      if (isPlatetaken) {
        runAnimation.stop();
        plateServeAnimation.stop();
        standWithplates.play();
      } else {
        runAnimation.stop();
        plateServeAnimation.stop();
        standWithplates.stop();
        idleAnimation.play();
      }
      console.warn = originalConsoleWarn;
      this.playerBody.quaternion.set(0, 0, 0, 1);
    };

    document.addEventListener("mousedown", onPointerDown, false);
    document.addEventListener("touchstart", onPointerDown, false);

    document.addEventListener("mousemove", onPointerMove, false);
    document.addEventListener("touchmove", onPointerMove, false);

    document.addEventListener("mouseup", onPointerUp, false);
    document.addEventListener("touchend", onPointerUp, false);
  }

  updateCharacterPosition() {
    this.playerBody.velocity.z = movement.z * 100
    this.playerBody.velocity.x = movement.x * 100
    this.player.scene.position.y = this.playerBody.position.y - 0.052
    this.player.scene.position.x = this.playerBody.position.x
    this.player.scene.position.z = this.playerBody.position.z
    this.camera.position.copy(this.player.scene.position);
    this.camera.position.y += 0.55;
    this.camera.position.z += 0.4;
    this.camera.lookAt(this.player.scene.position);
  };

  updateCameraPosition() {
    this.camera.position.set(0, 1, 0.5);
    this.camera.lookAt(this.scene.position);
  }

  checkIntersection() {
    if (!this.player) return; // Ensure player model is loaded

    const playerSphere = new THREE.Sphere();
    new THREE.Box3().setFromObject(this.player.scene).getBoundingSphere(playerSphere);

    // Reduce the radius of the player sphere to make the intersection area smaller
    playerSphere.radius *= 0.25;

    const devotees = [this.devotee1, this.devotee2, this.devotee3, this.devotee4, this.devotee5, this.devotee6, this.devotee7, this.devotee8, this.devotee9, this.devotee10];

    const plates = [this.plate1, this.plate2, this.plate3, this.plate4, this.plate5, this.plate6, this.plate7, this.plate8, this.plate9, this.plate10];


    plates.forEach((plate, index) => {
      if (!plate.scene.visible) return;

      const plateSphere = new THREE.Sphere();
      new THREE.Box3().setFromObject(plate.scene).getBoundingSphere(plateSphere);

      // Reduce the radius of the plate sphere to make the intersection area smaller
      plateSphere.radius *= 1.5;

      if (playerSphere.intersectsSphere(plateSphere) && isPlateEaten) {
        // this.scene.remove(plateSphere);
        if (isPlateReadytoTake && devotees[index].eating == false) {
          console.log("At the Time Collecting ", devotees[index]);
          plate.isEatable = false;
          isPlatetaken = true;
          plates[index].scene.visible = false;
          if (plateCarryCount < 5) {
            plateCarryCount++
          }
          console.log(plateCarryCount);
          // this.scene.remove(plates[index].scene);
          plateServeAnimation.play();
          if (index > 4) {
            console.log("index", index);
            runAnimation.stop();
            plateServeAnimation.play();
            platesArray[9 - index].visible = true;
          }
          else {
            platesArray[plateCarryCount - 1].visible = true;
          }
          playerPlates = 5;
        }
      }
    });

    devotees.forEach((devotee, index) => {
      if (!devotee) return; // Ensure devotee model is loaded

      const devoteeSphere = new THREE.Sphere();
      new THREE.Box3().setFromObject(devotee).getBoundingSphere(devoteeSphere);

      // Reduce the radius of the devotee sphere to make the intersection area smaller
      devoteeSphere.radius *= 0.7;

      if (playerSphere.intersectsSphere(devoteeSphere)) {
        if (playerPlates > 0 && devotee.readyToEat && platesArray[playerPlates - 1].isEatable) {
          devotee.readyToEat = false;
          console.log("At the Time of Serving ::", devotees[index]);
          playerPlates--;
          if (platesArray[playerPlates] && platesArray[playerPlates].isEatable) {
            platesArray.isEatable = false;
            devotees[index].eating = true;
            platesArray[playerPlates].visible = false;
            devoteePlates.forEach((plate) => {
              if (plate.name === `plate${index + 1}Devotee`) {
                this.thaliServeAnim(plate)
              }
            });
            setTimeout(() => {
              devotee.eating = false;
              this.leaveBhandaraAnim(devotee)
              flowerCount += 10
              this.flowerCountElement.textContent = flowerCount;
            }, 10000);
          }
          // this.showDevoteetimer(devotee);
        }

        if (playerPlates == 0) {
          isPlatetaken = false;
        }
      } else {
        // console.log(`No intersection with devotee ${index + 1}.`);
      }
    });
  }

  showDevoteetimer(devotee) {
    this.timer = 0;

    // Set the total time
    this.totalTime = 10;

    // Start the interval
    this.interval = setInterval(() => {
      // Increase the timer
      this.timer += 0.1;

      // If the timer is less than the total time, update the loader
      if (this.timer < this.totalTime) {
        // Calculate the new arc based on the elapsed time
        const arc = (this.timer / this.totalTime) * Math.PI * 2;

        // Remove the old loader from the scene
        this.scene.remove(this.devoteeTimer);

        // Create a new loader with the updated arc
        const newLoaderGeometry = new THREE.TorusGeometry(0.01, 0.002, 16, 100, arc);
        const loaderMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.75 });
        this.devoteeTimer = new THREE.Mesh(newLoaderGeometry, loaderMaterial);

        this.devoteeTimer.position.x = devotee.position.x;
        this.devoteeTimer.position.y = devotee.position.y + 0.08;
        this.devoteeTimer.position.z = devotee.position.z;

        // Add the new loader to the scene
        this.scene.add(this.devoteeTimer);
      } else {
        // If the timer is equal to or greater than the total time, stop the interval and hide the loader
        clearInterval(this.interval);
        this.devoteeTimer.visible = false;
      }
    }, 100);
  }




  addPlates() {
    const plateModel = LoaderManager.assets['bhandara_plate'].gltf;

    if (!plateModel) {
      return;
    }

    const plateCount = 10;

    for (let i = 0; i < plateCount; i++) {
      setTimeout(() => {
        const plate = plateModel.scene.clone();
        // Calculate y position dynamically based on plates taken
        const lastPlate = tablePlates[tablePlates.length - 1];
        const yPos = lastPlate ? lastPlate.position.y + 0.005 : 0.06;
        plate.position.set(
          -0.15,
          yPos,
          -0.17
        );
        plate.scale.set(0.8, 0.8, 0.8);
        const pivot = new THREE.Object3D();
        pivot.add(plate);
        plate.isEatable = true;
        this.scene.add(pivot);
        tablePlates.push(plate);
      }, i * 2000);
    }
  };


  leaveBhandaraAnim(model) {
    const modelName = model.name;
    model.readyToEat = false;
    isEatenCount++;
    if (isEatenCount === 5) {
      isPlateReadytoTake = true;
      setTimeout(() => {
        this.line1Animation();
      }, 1000)
      isPlateEaten = true;
      if (flowerCount == 40) {
        this.enableBtn()
      }
      this.isEatenCount = 0;
    } else if (isEatenCount === 10) {
      isPlateReadytoTake = true;
      this.enableBtn()
    } else if (isEatenCount === 15) {
      isPlateReadytoTake = true;
    }
    if (isEatenCount > 5) {
      isPlateEaten = true;
    }
    switch (modelName) {
      case "Devotee1":
        this.devotee1EatAnimation.stop();
        this.devotee1RunAnimation.play();
        break;
      case "Devotee2":
        this.devotee2EatAnimation.stop();
        this.devotee2RunAnimation.play();
        break;
      case "Devotee3":
        this.devotee3EatAnimation.stop();
        this.devotee3RunAnimation.play();
        break;
      case "Devotee4":
        this.devotee4EatAnimation.stop();
        this.devotee4RunAnimation.play();
        break;
      case "Devotee5":
        this.devotee5EatAnimation.stop();
        this.devotee5RunAnimation.play();
        break;
      case "Devotee6":
        this.devotee6EatAnimation.stop();
        this.devotee6RunAnimation.play();
        break;
      case "Devotee7":
        this.devotee7EatAnimation.stop();
        this.devotee7RunAnimation.play();
        break;
      case "Devotee8":
        this.devotee8EatAnimation.stop();
        this.devotee8RunAnimation.play();
        break;
      case "Devotee9":
        this.devotee9EatAnimation.stop();
        this.devotee9RunAnimation.play();
        break;
      case "Devotee10":
        this.devotee10EatAnimation.stop();
        this.devotee10RunAnimation.play();
        break;
      default:
        break;
    }

    model.rotation.y = -Math.PI / 2;
    const targetPosition = new THREE.Vector3(model.position.x + 0.1, model.position.y, model.position.z);
    const duration = 2;
    gsap.to(model.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: duration,
      ease: "linear",
      onComplete: () => {
        model.rotation.y = Math.PI;
        switch (modelName) {
          case "devotee1":
            this.devotee1RunAnimation.play();
            break;
          case "devotee2":
            this.devotee2RunAnimation.play();
            break;
          case "devotee3":
            this.devotee3RunAnimation.play();
            break;
          case "devotee4":
            this.devotee4RunAnimation.play();
            break;
          case "devotee5":
            this.devotee5RunAnimation.play();
            break;
          case "devotee6":
            this.devotee6RunAnimation.play();
            break;
          case "devotee7":
            this.devotee7RunAnimation.play();
            break;
          case "devotee8":
            this.devotee8RunAnimation.play();
            break;
          case "devotee9":
            this.devotee9RunAnimation.play();
            break;
          case "devotee10":
            this.devotee10RunAnimation.play();
            break;
          default:
            break;
        }
        gsap.to(model.position, {
          x: 0.150,
          y: 0.009,
          z: 1.816,
          duration: 10,
          ease: "linear",
          onComplete: () => {

            model.rotation.y = 0;

            switch (modelName) {
              case "devotee1":
                this.devotee1RunAnimation.stop();
                this.devotee1IdleAnimation.play();
                break;
              case "devotee2":
                this.devotee2RunAnimation.stop();
                this.devotee2IdleAnimation.play();
                break;
              case "devotee3":
                this.devotee3RunAnimation.stop();
                this.devotee3IdleAnimation.play();
                break;
              case "devotee4":
                this.devotee4RunAnimation.stop();
                this.devotee4IdleAnimation.play();
                break;
              case "devotee5":
                this.devotee5RunAnimation.stop();
                this.devotee5IdleAnimation.play();
                break;
              case "devotee6":
                this.devotee6RunAnimation.stop();
                this.devotee6IdleAnimation.play();
                break;
              case "devotee7":
                this.devotee7RunAnimation.stop();
                this.devotee7IdleAnimation.play();
                break;
              case "devotee8":
                this.devotee8RunAnimation.stop();
                this.devotee8IdleAnimation.play();
                break;
              case "devotee9":
                this.devotee9RunAnimation.stop();
                this.devotee9IdleAnimation.play();
                break;
              case "devotee10":
                this.devotee10RunAnimation.stop();
                this.devotee10IdleAnimation.play();
                break;
              default:
                break;
            }
          }
        });
      }
    });
  }

  addColiders() {
    const rightGeometry = new THREE.BoxGeometry(0.040, 0.080, 2.200, 1, 1, 1);
    const rightMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const rightBoundary = new THREE.Mesh(rightGeometry, rightMaterial);
    rightBoundary.visible = false
    rightBoundary.position.set(0.371, 0.044, 0.176);
    this.scene.add(rightBoundary);
    this.createStaticBox(0.040, 0.080, 2.200, rightBoundary.position)

    const leftGeometry = new THREE.BoxGeometry(0.040, 0.080, 2.260, 1, 1, 1);
    const leftMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const leftBoundary = new THREE.Mesh(leftGeometry, leftMaterial);
    leftBoundary.visible = false
    leftBoundary.position.set(-0.394, 0.045, 0.184);
    this.createStaticBox(0.040, 0.080, 2.260, leftBoundary.position)
    this.scene.add(leftBoundary);

    const backGeometry = new THREE.BoxGeometry(0.800, 0.220, 0.080, 1, 1, 1);
    const backMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const backBoundary = new THREE.Mesh(backGeometry, backMaterial);
    backBoundary.visible = false
    backBoundary.position.set(-0.007, 0.045, -0.963);
    this.createStaticBox(0.800, 0.220, 0.080, backBoundary.position)
    this.scene.add(backBoundary);

    const middleWall1Geometry = new THREE.BoxGeometry(0.400, 0.180, 0.040, 1, 1, 1);
    const middleWall1Material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const middleWall1 = new THREE.Mesh(middleWall1Geometry, middleWall1Material);
    middleWall1.visible = false
    middleWall1.position.set(-0.196, 0.02, -0.064);
    this.createStaticBox(0.400, 0.180, 0.040, middleWall1.position)
    this.scene.add(middleWall1);

    const middleWall2Geometry = new THREE.BoxGeometry(0.240, 0.180, 0.040, 1, 1, 1);
    const middleWall2Material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const middleWall2 = new THREE.Mesh(middleWall2Geometry, middleWall2Material);
    middleWall2.visible = false
    middleWall2.position.set(0.246, 0.014, -0.065);
    this.createStaticBox(0.240, 0.180, 0.040, middleWall2.position)
    this.scene.add(middleWall2);

    const frontWall1Geometry = new THREE.BoxGeometry(0.520, 0.080, 0.040, 1, 1, 1);
    const frontWall1Material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const frontWall1 = new THREE.Mesh(frontWall1Geometry, frontWall1Material);
    frontWall1.position.set(-0.141, 0.044, 1.290);
    frontWall1.visible = false
    this.createStaticBox(0.520, 0.080, 0.040, frontWall1.position)
    this.scene.add(frontWall1);

    const frontWall2Geometry = new THREE.BoxGeometry(0.180, 0.080, 0.040, 1, 1, 1);
    const frontWall2Material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const frontWall2 = new THREE.Mesh(frontWall2Geometry, frontWall2Material);
    frontWall2.position.set(0.334, 0.040, 1.295);
    frontWall2.visible = false
    this.createStaticBox(0.880, 0.080, 0.040, frontWall2.position)
    this.scene.add(frontWall2);

    const tableGeometry = new THREE.BoxGeometry(0.150, 0.060, 0.060, 1, 1, 1);
    const tableMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.set(-0.140, 0.047, -0.130);
    table.visible = false
    this.tableBody = this.createStaticBox(0.180, 0.080, 0.040, table.position)
    this.scene.add(table);

    const surfaceGeometry = new THREE.BoxGeometry(0.800, 0.040, 2.240, 1, 1, 1);
    const surfaceMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
    surface.position.set(-0.019, -0.012, 0.162);
    surface.visible = false
    this.createStaticBox(0.800, 0.040, 2.240, surface.position)
    this.scene.add(surface);

    this.playerBody.addEventListener('collide', event => {
      if (event.body === this.tableBody && playerPlates == 0 && tablePlates.length > 0) {
        isPlatetaken = true;
        playerPlates = plateCapacity;
        tablePlates.splice(tablePlates.length - playerPlates, playerPlates).forEach(plate => {
          plate.visible = false;
        });
        platesArray.slice(0, plateCapacity).forEach((plate, index) => {
          console.log("PLate :::::", plate);
          runAnimation.stop();
          plate.isEatable = true;
          this.thaliTakefromtable(index, plate)
          plateServeAnimation.play();
        });
      }

      if (tablePlates.length === 0) {
        this.addPlates()
      }

    });
  }

  thaliServeAnim(plate) {
    const plateModel = LoaderManager.assets['bhandara_plate'].gltf;
    let targetPosition = plate.position
    let plate1 = plateModel.scene.clone();
    plate1.scale.set(0.8, 0.8, 0.8);
    plate1.position.x = this.player.scene.position.x
    plate1.position.y = this.player.scene.position.y + 0.1
    plate1.position.z = this.player.scene.position.z
    this.scene.add(plate1);
    gsap.to(plate1.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 0.5,
      ease: "power1.inOut",
      onComplete: () => {
        plate.visible = true;
        plate1.visible = false;
        this.scene.remove(plate1);
      }
    });
  }

  thaliTakefromtable(index, plate) {
    const plateModel = LoaderManager.assets['bhandara_plate'].gltf;
    let targetPosition = this.player.scene.position
    let plate1 = plateModel.scene.clone();
    plate1.scale.set(0.8, 0.8, 0.8);
    plate1.position.x = this.tableBody.position.x
    plate1.position.y = this.tableBody.position.y
    plate1.position.z = this.tableBody.position.z
    this.scene.add(plate1);
    console.log("Target Position :: ", targetPosition);
    console.log("Table Position  :: ", this.tableBody.position);

    gsap.to(plate1.position, {
      x: targetPosition.x,
      y: targetPosition.y + ((index + 2) * 0.005) + 0.1,
      z: targetPosition.z,
      delay: 0.01 + (index * 0.1),
      duration: 0.2,
      ease: "power",
      onComplete: () => {
        plate.visible = true;
        plate1.visible = false;
        this.scene.remove(plate1);
      },
    });

    gsap.to(plate1.scale, {
      x: 0.6,
      y: 0.6,
      z: 0.6,
      duration: 0.2,
      ease: "power",
    });

  }

  createStaticBox(width, height, depth, position) {
    const shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
    const body = new CANNON.Body({
      mass: 0, // mass == 0 makes the body static
      position: new CANNON.Vec3(position.x, position.y, position.z),
      shape: shape
    });
    world.addBody(body);
    return body;
  }

  createBoxHelper(body, color) {
    const geometry = new THREE.BoxGeometry(body.shape.halfExtents.x * 2, body.shape.halfExtents.y * 2, body.shape.halfExtents.z * 2);
    const material = new THREE.MeshBasicMaterial({ color: color, wireframe: true });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(body.position);
    scene.add(mesh);
    return mesh;
  }

  addDustbin() {
    // Check for intersection between dustbin and player
    const playerBox = new THREE.Box3().setFromObject(this.player.scene);
    const dustbinBox = new THREE.Box3().setFromObject(this.dustbin);


    if (playerBox.intersectsBox(dustbinBox)) {
      this.dustbin.children[0].children[0].rotation.z = 43.40;
      if (playerPlates > 0) {
        playerPlates--;
        platesArray.forEach((plate) => {
          plate.visible = false;
        });
        if (playerPlates == 0) {
          console.log("PLayer plates are empty");
          isPlatetaken = false;
        }
      }

    } else {
      this.dustbin.children[0].children[0].rotation.z = 0;
    }

  }

  traverseModel(objects, name) {
    let result = null;
    objects.forEach(object => {
      if (object.traverse) {
        object.traverse(child => {
          if (child.name === name) {
            result = child;
          }
        });
      }
    });
    return result;
  };

  addSound() {
    // Audio Listener
    const listener = new THREE.AudioListener();
    camera.add(listener);

    // Background music setup
    const sound = new THREE.Audio(listener);

    // Audio loader
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('path_to_your_sound.wav', function (buffer) {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.5);
      sound.play();
    });
  }


  render() {
    const elapsedTime = this.clock.getElapsedTime();
    world.step(1 / 60);
    // this.cannonDebugRenderer.update();
    const delta = this.clock.getDelta();
    // console.log(delta)
    if (cookMixer && playerMixer && devotee1Mixer && devotee2Mixer && devotee3Mixer && devotee4Mixer && devotee5Mixer && devotee6Mixer && devotee7Mixer && devotee8Mixer && devotee9Mixer && devotee10Mixer) {
      const updateDelta = 0.017;
      mixerArray.forEach(mixer => {
        mixer.update(updateDelta);
      });
    }

    if (playerPlates < 12) {
      this.addDustbin();
      this.checkIntersection();
    }
    this.updateCameraPosition()
    this.updateCharacterPosition();
    // this.renderer.render(this.scene, this.camera);
    if (composer) {
      composer.render()
    }
    requestAnimationFrame(this.render.bind(this));
  }

  setResize() {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  onResize() {
    device.width = window.innerWidth;
    device.height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(device.pixelRatio, 2));
  }
}
