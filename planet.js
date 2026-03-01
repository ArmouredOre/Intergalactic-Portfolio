// ===== SCENE =====
const scene = new THREE.Scene();

// ===== CAMERA =====
const camera = new THREE.PerspectiveCamera(
    75,
    document.getElementById("planet-container").clientWidth /
    document.getElementById("planet-container").clientHeight,
    0.1,
    1000
);
camera.position.z = 8;

// ===== RENDERER =====
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setSize(
    document.getElementById("planet-container").clientWidth,
    document.getElementById("planet-container").clientHeight
);

renderer.setClearColor(0x000000, 0); // transparent
document.getElementById("planet-container").appendChild(renderer.domElement);

// ===== LIGHTING =====
const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// ===== TEXTURE LOADER =====
const textureLoader = new THREE.TextureLoader();

// ===== PLANET DATA =====
const planets = {
    Gaia: {
        texture: "Gaia.jpg",
        size: 0.73,
        displayName: "Gaia",
        description: "This shows the information of the creator of this universe",
        extractedData: "Atmosphere: 78% Nitrogen, 21% Oxygen. Status: Highly populated. Portfolio Creator coordinates confirmed."
    },
    Eros: {
        texture: "Eros.jpg",
        size: 0.61,
        displayName: "Eros",
        description: "A mysterious dwarf planet in the Kuiper Belt.",
        extractedData: "Atmosphere: Thin methane. Surface Temperature: 30K. High concentrations of tholins detected. No life signs."
    },
    Ares: {
        texture: "Ares.jpg",
        size: 0.89,
        displayName: "Ares",
        description: "A mysterious dwarf planet in the Kuiper Belt.",
        extractedData: "Atmosphere: Thin methane. Surface Temperature: 30K. High concentrations of tholins detected. No life signs."
    },
    Hera: {
        texture: "Hera.jpg",
        size: 1,
        displayName: "Hera",
        description: "A mysterious dwarf planet in the Kuiper Belt.",
        extractedData: "Atmosphere: Thin methane. Surface Temperature: 30K. High concentrations of tholins detected. No life signs."
    }
};

// ===== GEOMETRY (ONLY CREATED ONCE) =====
const geometry = new THREE.SphereGeometry(3, 64, 64);

// ===== DEFAULT MATERIAL (EARTH) =====
const material = new THREE.MeshStandardMaterial({
    map: textureLoader.load(planets.Gaia.texture),
    transparent: true,
    opacity: 1
});

// ===== PLANET MESH =====
const planetMesh = new THREE.Mesh(geometry, material);
scene.add(planetMesh);

// ===== PLANET ORDER =====
let planetKeys = Object.keys(planets);
let currentPlanetIndex = 0;

// ===== ANIMATION STATE =====
let isAnimating = false;

// ===== SMOOTH 3D TRANSITION FUNCTION =====
function switchPlanet(name) {
    if (isAnimating) return; 
    isAnimating = true; // Lock the button

    const data = planets[name];
    if (!data) {
        isAnimating = false;
        return;
    }

    const leaveDuration = 2000;
    const enterDuration = 3000;
    const dropDistance = -65;
    const topDistance = 0;
    const enlargeScale = 15; 

    const startScale = planetMesh.scale.x; 
    const targetScale = data.size; 
    
    let startTime = null;

    // --- PHASE 1: EXIT (Drop down and disappear) ---
    function animateExit(timestamp) {
        if (!startTime) startTime = timestamp;
        let progress = (timestamp - startTime) / leaveDuration;

        if (progress < 1) {
            const ease = progress * progress * progress; 
            planetMesh.position.y = dropDistance * ease;
            const currentScale = startScale + ((startScale * enlargeScale) - startScale) * ease;
            planetMesh.scale.set(currentScale, currentScale, currentScale);

            requestAnimationFrame(animateExit);
        } else {
            setTimeout(() => {
                planetMesh.material.map = textureLoader.load(data.texture);
                planetMesh.material.needsUpdate = true;
                
                startTime = null; 
                requestAnimationFrame(animateEnter);
            }, 300); 
        }
    }

    // --- PHASE 2: ENTER (Drop from top and settle) ---
    function animateEnter(timestamp) {
        if (!startTime) startTime = timestamp;
        let progress = (timestamp - startTime) / enterDuration;

        if (progress < 1) {
            const ease = 1 - Math.pow(1 - progress, 3); 
            
            planetMesh.position.y = topDistance - (topDistance * ease); 
            
            const currentScale = targetScale * ease; 
            planetMesh.scale.set(currentScale, currentScale, currentScale);

            requestAnimationFrame(animateEnter);
        } else {
            planetMesh.position.y = 0;
            planetMesh.scale.set(targetScale, targetScale, targetScale);
            isAnimating = false; 
        }
    }

    requestAnimationFrame(animateExit);
}

window.switchPlanet = switchPlanet;

// ===== ROTATION =====
const rotationSpeed = 0.004;
window.timeMultiplier = window.timeMultiplier || 1;

function animate() {
    requestAnimationFrame(animate);
    planetMesh.rotation.y += (rotationSpeed * window.timeMultiplier);
    renderer.render(scene, camera);
}

animate();

// ===== RESIZE HANDLER =====
window.addEventListener("resize", () => {
    const container = document.getElementById("planet-container");

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
});


