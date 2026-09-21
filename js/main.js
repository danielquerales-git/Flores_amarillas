import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";


// =========================================================
// ELEMENTOS HTML
// =========================================================

const container = document.getElementById("sceneContainer");

const rotateButton = document.getElementById("rotateButton");
const messageButton = document.getElementById("messageButton");
const soundButton = document.getElementById("soundButton");

const letterSection = document.getElementById("letterSection");
const closeLetter = document.getElementById("closeLetter");

const effectsLayer = document.getElementById("effectsLayer");


// =========================================================
// ESCENA
// =========================================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x080706);

scene.fog = new THREE.FogExp2(
    0x080706,
    0.055
);


// =========================================================
// CÁMARA
// =========================================================

const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
);

camera.position.set(
    0,
    1.2,
    7
);


// =========================================================
// RENDERER
// =========================================================

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    container.clientWidth,
    container.clientHeight
);

renderer.shadowMap.enabled = true;

renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

container.appendChild(
    renderer.domElement
);


// =========================================================
// CONTROLES ORBITALES
// =========================================================

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;

controls.dampingFactor = 0.07;

controls.enablePan = false;

controls.minDistance = 4;

controls.maxDistance = 10;

controls.minPolarAngle = 0.75;

controls.maxPolarAngle = 2.35;

controls.target.set(
    0,
    0.4,
    0
);


// =========================================================
// LUCES
// =========================================================

const ambientLight = new THREE.HemisphereLight(
    0xfff4bd,
    0x17150f,
    2.2
);

scene.add(ambientLight);


const keyLight = new THREE.DirectionalLight(
    0xfff1b3,
    3.5
);

keyLight.position.set(
    4,
    7,
    4
);

keyLight.castShadow = true;

scene.add(keyLight);


const fillLight = new THREE.PointLight(
    0xf7c948,
    3,
    8
);

fillLight.position.set(
    -3,
    2,
    3
);

scene.add(fillLight);


const backLight = new THREE.PointLight(
    0xffcf5a,
    2.2,
    7
);

backLight.position.set(
    2,
    1,
    -4
);

scene.add(backLight);


// =========================================================
// SUELO SUTIL
// =========================================================

const floorGeometry =
    new THREE.CircleGeometry(
        4.5,
        64
    );

const floorMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x0d0b08,
        transparent: true,
        opacity: 0.5
    });

const floor =
    new THREE.Mesh(
        floorGeometry,
        floorMaterial
    );

floor.rotation.x =
    -Math.PI / 2;

floor.position.y =
    -2.15;

scene.add(floor);


// =========================================================
// GRUPO GENERAL DEL RAMO
// =========================================================

const bouquet = new THREE.Group();

scene.add(bouquet);


// =========================================================
// MATERIALES
// =========================================================

const petalMaterial =
    new THREE.MeshStandardMaterial({

        color: 0xf7c948,

        roughness: 0.72,

        metalness: 0.0,

        emissive: 0x4b3606,

        emissiveIntensity: 0.15
    });


const petalLightMaterial =
    new THREE.MeshStandardMaterial({

        color: 0xffdf70,

        roughness: 0.65,

        metalness: 0,

        emissive: 0x503900,

        emissiveIntensity: 0.1
    });


const centerMaterial =
    new THREE.MeshStandardMaterial({

        color: 0x8f5d08,

        roughness: 0.85,

        emissive: 0x241500,

        emissiveIntensity: 0.2
    });


const stemMaterial =
    new THREE.MeshStandardMaterial({

        color: 0x4f673d,

        roughness: 0.85
    });


const leafMaterial =
    new THREE.MeshStandardMaterial({

        color: 0x718b57,

        roughness: 0.88
    });


// =========================================================
// CREAR TALLO
// =========================================================

function createStem() {

    const geometry =
        new THREE.CylinderGeometry(
            0.045,
            0.065,
            2.25,
            10
        );

    const stem =
        new THREE.Mesh(
            geometry,
            stemMaterial
        );

    stem.position.y = -1.05;

    stem.castShadow = true;

    return stem;
}


// =========================================================
// CREAR HOJA
// =========================================================

function createLeaf(
    positionX,
    positionY,
    rotationZ,
    side
) {

    const geometry =
        new THREE.SphereGeometry(
            0.35,
            16,
            10
        );

    const leaf =
        new THREE.Mesh(
            geometry,
            leafMaterial
        );

    leaf.scale.set(
        1.4,
        0.34,
        0.10
    );

    leaf.position.set(
        positionX,
        positionY,
        0
    );

    leaf.rotation.z =
        rotationZ;

    leaf.position.x +=
        side * 0.1;

    return leaf;
}


// =========================================================
// CREAR FLOR
// =========================================================

function createFlower({
    x = 0,
    y = 0,
    z = 0,
    scale = 1,
    rotation = 0,
    petals = 12,
    lightPetals = false
}) {

    const flower =
        new THREE.Group();

    flower.position.set(
        x,
        y,
        z
    );

    flower.rotation.z =
        rotation;

    flower.scale.setScalar(
        scale
    );

    // Identificador para el Raycaster
    flower.userData.flowerRoot =
        flower;

    // -------------------------------
    // TALLO
    // -------------------------------

    flower.add(
        createStem()
    );

    // -------------------------------
    // HOJAS
    // -------------------------------

    flower.add(
        createLeaf(
            0.13,
            -0.9,
            -0.65,
            1
        )
    );

    flower.add(
        createLeaf(
            -0.12,
            -1.22,
            0.55,
            -1
        )
    );

    // -------------------------------
    // CABEZA
    // -------------------------------

    const head =
        new THREE.Group();

    head.position.y =
        0.12;

    flower.add(head);


    // -------------------------------
    // PÉTALOS
    // -------------------------------

    for (
        let i = 0;
        i < petals;
        i++
    ) {

        const angle =
            (i / petals) *
            Math.PI *
            2;

        const geometry =
            new THREE.SphereGeometry(
                0.38,
                16,
                12
            );

        const material =
            lightPetals
                ? petalLightMaterial
                : petalMaterial;

        const petal =
            new THREE.Mesh(
                geometry,
                material.clone()
            );

        const radius = 0.34;

        petal.position.set(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            0
        );

        petal.scale.set(
            0.42,
            0.78,
            0.15
        );

        petal.rotation.z =
            angle;

        petal.castShadow = true;

        petal.userData.isPetal = true;

        head.add(
            petal
        );
    }


    // -------------------------------
    // CENTRO
    // -------------------------------

    const centerGeometry =
        new THREE.SphereGeometry(
            0.30,
            24,
            16
        );

    const center =
        new THREE.Mesh(
            centerGeometry,
            centerMaterial.clone()
        );

    center.scale.z =
        0.55;

    center.position.z =
        0.05;

    center.castShadow = true;

    head.add(
        center
    );


    // -------------------------------
    // PEQUEÑOS PUNTOS DEL CENTRO
    // -------------------------------

    for (
        let i = 0;
        i < 9;
        i++
    ) {

        const dotGeometry =
            new THREE.SphereGeometry(
                0.035,
                8,
                8
            );

        const dot =
            new THREE.Mesh(
                dotGeometry,
                new THREE.MeshStandardMaterial({
                    color: 0x5b3b05,
                    roughness: 1
                })
            );

        const angle =
            (i / 9) * Math.PI * 2;

        dot.position.set(
            Math.cos(angle) * 0.16,
            Math.sin(angle) * 0.16,
            0.18
        );

        head.add(dot);
    }


    bouquet.add(
        flower
    );

    return flower;
}


// =========================================================
// CREAR RAMO
// =========================================================

const flowers = [];

flowers.push(
    createFlower({
        x: -1.55,
        y: 0.45,
        z: 0.0,
        scale: 0.95,
        rotation: -0.13,
        petals: 13
    })
);

flowers.push(
    createFlower({
        x: -0.82,
        y: 1.05,
        z: 0.2,
        scale: 0.92,
        rotation: -0.05,
        petals: 12,
        lightPetals: true
    })
);

flowers.push(
    createFlower({
        x: 0,
        y: 1.32,
        z: 0.35,
        scale: 1.10,
        rotation: 0,
        petals: 14,
        lightPetals: true
    })
);

flowers.push(
    createFlower({
        x: 0.82,
        y: 1.05,
        z: 0.15,
        scale: 0.95,
        rotation: 0.07,
        petals: 12
    })
);

flowers.push(
    createFlower({
        x: 1.52,
        y: 0.48,
        z: -0.05,
        scale: 0.9,
        rotation: 0.13,
        petals: 13
    })
);

flowers.push(
    createFlower({
        x: -0.45,
        y: 0.35,
        z: 0.50,
        scale: 0.82,
        rotation: -0.09,
        petals: 11
    })
);

flowers.push(
    createFlower({
        x: 0.48,
        y: 0.36,
        z: 0.52,
        scale: 0.84,
        rotation: 0.10,
        petals: 11,
        lightPetals: true
    })
);


// =========================================================
// PAPEL / ENVOLTORIO DEL RAMO
// =========================================================

const wrapperGeometry =
    new THREE.ConeGeometry(
        1.9,
        2.4,
        5,
        1,
        true
    );

const wrapperMaterial =
    new THREE.MeshStandardMaterial({

        color: 0x9f8656,

        roughness: 0.92,

        side: THREE.DoubleSide,

        transparent: true,

        opacity: 0.9
    });

const wrapper =
    new THREE.Mesh(
        wrapperGeometry,
        wrapperMaterial
    );

wrapper.position.y =
    -2.0;

wrapper.rotation.x =
    Math.PI;

wrapper.scale.set(
    0.78,
    0.72,
    0.78
);

bouquet.add(
    wrapper
);


// =========================================================
// CINTA
// =========================================================

const ribbonGeometry =
    new THREE.TorusGeometry(
        0.54,
        0.065,
        12,
        48
    );

const ribbonMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xf5d774,
        roughness: 0.55
    });

const ribbon =
    new THREE.Mesh(
        ribbonGeometry,
        ribbonMaterial
    );

ribbon.rotation.x =
    Math.PI / 2;

ribbon.position.y =
    -1.48;

ribbon.scale.set(
    1.2,
    0.78,
    1
);

bouquet.add(
    ribbon
);


// =========================================================
// PARTÍCULAS LUMINOSAS
// =========================================================

const particleCount = 100;

const particlePositions =
    new Float32Array(
        particleCount * 3
    );

for (
    let i = 0;
    i < particleCount;
    i++
) {

    particlePositions[i * 3] =
        (Math.random() - 0.5) * 7;

    particlePositions[i * 3 + 1] =
        (Math.random() - 0.2) * 5;

    particlePositions[i * 3 + 2] =
        (Math.random() - 0.5) * 5;
}

const particleGeometry =
    new THREE.BufferGeometry();

particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
        particlePositions,
        3
    )
);

const particleMaterial =
    new THREE.PointsMaterial({

        color: 0xffdc68,

        size: 0.025,

        transparent: true,

        opacity: 0.6,

        sizeAttenuation: true
    });

const particles =
    new THREE.Points(
        particleGeometry,
        particleMaterial
    );

scene.add(
    particles
);


// =========================================================
// RAYCASTER
// =========================================================

const raycaster =
    new THREE.Raycaster();

const pointer =
    new THREE.Vector2();


// =========================================================
// SONIDO
// =========================================================

let soundEnabled = true;

let audioContext = null;


function playClickSound() {

    if (!soundEnabled) {
        return;
    }

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();
    }

    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();

    oscillator.type = "sine";

    oscillator.frequency.setValueAtTime(
        523.25,
        audioContext.currentTime
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        783.99,
        audioContext.currentTime + 0.18
    );

    gain.gain.setValueAtTime(
        0.0001,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.07,
        audioContext.currentTime + 0.02
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + 0.22
    );

    oscillator.connect(gain);

    gain.connect(
        audioContext.destination
    );

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 0.25
    );
}


// =========================================================
// CORAZONES
// =========================================================

function createHearts() {

    for (
        let i = 0;
        i < 12;
        i++
    ) {

        const heart =
            document.createElement("div");

        heart.className =
            "floating-heart";

        heart.textContent =
            Math.random() > 0.25
                ? "♥"
                : "✦";

        heart.style.left =
            `${42 + Math.random() * 16}%`;

        heart.style.bottom =
            `${28 + Math.random() * 12}%`;

        heart.style.setProperty(
            "--drift",
            `${-80 + Math.random() * 160}px`
        );

        heart.style.animationDelay =
            `${Math.random() * 0.35}s`;

        heart.style.fontSize =
            `${12 + Math.random() * 13}px`;

        effectsLayer.appendChild(
            heart
        );

        setTimeout(() => {
            heart.remove();
        }, 2500);
    }
}


// =========================================================
// ANIMACIÓN DE UNA FLOR
// =========================================================

function animateFlower(flower) {

    playClickSound();

    createHearts();


    // Guardamos escala original

    const originalScale =
        flower.userData.originalScale ||
        flower.scale.x;

    flower.userData.originalScale =
        originalScale;


    // Sacudida suave

    const startRotation =
        flower.rotation.z;


    let progress = 0;

    function bounce() {

        progress += 0.045;

        const wave =
            Math.sin(progress * Math.PI);

        flower.scale.setScalar(
            originalScale *
            (1 + wave * 0.16)
        );

        flower.rotation.z =
            startRotation +
            Math.sin(progress * Math.PI * 5) *
            0.025;

        if (progress < 1) {

            requestAnimationFrame(
                bounce
            );

        } else {

            flower.scale.setScalar(
                originalScale
            );

            flower.rotation.z =
                startRotation;
        }
    }

    bounce();


    // Iluminar pétalos

    flower.traverse(
        child => {

            if (
                child.isMesh &&
                child.material &&
                child.material.emissive
            ) {

                const old =
                    child.material.emissiveIntensity;

                child.material.emissiveIntensity =
                    0.7;

                setTimeout(() => {

                    child.material.emissiveIntensity =
                        old;

                }, 400);
            }
        }
    );
}


// =========================================================
// CLICK SOBRE EL RAMO
// =========================================================

renderer.domElement.addEventListener(
    "pointerdown",
    event => {

        const rect =
            renderer.domElement.getBoundingClientRect();

        pointer.x =
            ((event.clientX - rect.left) /
                rect.width) *
            2 - 1;

        pointer.y =
            -((event.clientY - rect.top) /
                rect.height) *
            2 + 1;


        raycaster.setFromCamera(
            pointer,
            camera
        );


        const intersections =
            raycaster.intersectObjects(
                bouquet.children,
                true
            );


        if (
            intersections.length === 0
        ) {
            return;
        }


        let object =
            intersections[0].object;

        let flower = null;


        while (object) {

            if (
                object.userData &&
                object.userData.flowerRoot
            ) {

                flower =
                    object.userData.flowerRoot;

                break;
            }

            object =
                object.parent;
        }


        if (flower) {

            animateFlower(
                flower
            );
        }
    }
);


// =========================================================
// BOTÓN DE MOVIMIENTO
// =========================================================

let autoRotation = false;

rotateButton.addEventListener(
    "click",
    () => {

        autoRotation =
            !autoRotation;

        controls.autoRotate =
            autoRotation;

        controls.autoRotateSpeed =
            0.7;

        rotateButton.innerHTML =
            autoRotation
                ? "<span>❚❚</span> Pausar movimiento"
                : "<span>↻</span> Movimiento";
    }
);


// =========================================================
// ABRIR CARTA
// =========================================================

messageButton.addEventListener(
    "click",
    () => {

        letterSection.classList.add(
            "open"
        );

        letterSection.setAttribute(
            "aria-hidden",
            "false"
        );

        createHearts();

        setTimeout(() => {

            letterSection.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }, 250);
    }
);


// =========================================================
// CERRAR CARTA
// =========================================================

closeLetter.addEventListener(
    "click",
    () => {

        letterSection.classList.remove(
            "open"
        );

        letterSection.setAttribute(
            "aria-hidden",
            "true"
        );
    }
);


// =========================================================
// SONIDO
// =========================================================

soundButton.addEventListener(
    "click",
    () => {

        soundEnabled =
            !soundEnabled;

        soundButton.textContent =
            soundEnabled
                ? "♪"
                : "🔇";

        if (soundEnabled) {
            playClickSound();
        }
    }
);


// =========================================================
// ANIMACIÓN GENERAL
// =========================================================

const clock =
    new THREE.Clock();

function animate() {

    requestAnimationFrame(
        animate
    );

    const elapsed =
        clock.getElapsedTime();


    // Movimiento de partículas

    particles.rotation.y =
        elapsed * 0.025;

    particles.rotation.x =
        Math.sin(elapsed * 0.1) *
        0.025;


    // Pequeño movimiento orgánico

    bouquet.position.y =
        Math.sin(elapsed * 1.2) *
        0.025;


    bouquet.rotation.y =
        Math.sin(elapsed * 0.35) *
        0.02;


    controls.update();

    renderer.render(
        scene,
        camera
    );
}

animate();


// =========================================================
// RESPONSIVE
// =========================================================

function resize() {

    const width =
        container.clientWidth;

    const height =
        container.clientHeight;


    camera.aspect =
        width / height;

    camera.updateProjectionMatrix();


    renderer.setSize(
        width,
        height
    );
}

window.addEventListener(
    "resize",
    resize
);