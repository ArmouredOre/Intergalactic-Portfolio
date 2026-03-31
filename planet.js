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
        description: "Introduction - Meet the Creator",
        extractedData: `<div class="portfolio-intro">
            <h3>Welcome to My Universe</h3>
            <p class="intro-text">I'm <strong>Swaraj Mandar Rane</strong>, a passionate developer crafting digital experiences.</p>
            <div class="intro-details">
                <div class="intro-item">
                    <span class="intro-label">Mission</span>
                    <span class="intro-value">Building innovative solutions through code</span>
                </div>
                <div class="intro-item">
                    <span class="intro-label">Location</span>
                    <span class="intro-value">Earth, India</span>
                </div>
                <div class="intro-item">
                    <span class="intro-label">Status</span>
                    <span class="intro-value">Open for Opportunities</span>
                </div>
            </div>
            <p class="intro-footer">Navigate through the planets to explore my portfolio</p>
        </div>`
    },
    Eros: {
        texture: "Eros.jpg",
        size: 0.61,
        displayName: "Eros",
        description: "CV/Resume - Professional Journey",
        extractedData: `<div class="cv-container">
            <iframe src="SwarajMandarRane-Resume copy.pdf" class="cv-pdf" title="CV/Resume"></iframe>
        </div>`
    },
    Ares: {
        texture: "Ares.jpg",
        size: 0.89,
        displayName: "Ares",
        description: "Projects - My Work",
        extractedData: `<div class="projects-container">
            <h3>Projects</h3>
            <div class="projects-placeholder">
                <div class="placeholder-icon">🚀</div>
                <p class="placeholder-text">Exciting projects are in development and will be launched soon.</p>
                <p class="placeholder-subtext">Check back later to see my latest work and creations!</p>
            </div>
        </div>`
    },
    Hera: {
        texture: "Hera.jpg",
        size: 1,
        displayName: "Hera",
        description: "Skills - Technologies & Tools",
        extractedData: `<div class="skills-container">
            <h3>Technical Skills</h3>
            <div class="skills-grid">
                <div class="skill-category">
                    <div class="skill-category-title">Languages</div>
                    <div class="skill-bar">
                        <span class="skill-name">C</span>
                        <div class="skill-progress" style="width: 85%"></div>
                    </div>
                    <div class="skill-bar">
                        <span class="skill-name">C++</span>
                        <div class="skill-progress" style="width: 80%"></div>
                    </div>
                    <div class="skill-bar">
                        <span class="skill-name">Python</span>
                        <div class="skill-progress" style="width: 85%"></div>
                    </div>
                    <div class="skill-bar">
                        <span class="skill-name">Java</span>
                        <div class="skill-progress" style="width: 75%"></div>
                    </div>
                    <div class="skill-bar">
                        <span class="skill-name">JavaScript</span>
                        <div class="skill-progress" style="width: 85%"></div>
                    </div>
                </div>
                <div class="skill-category">
                    <div class="skill-category-title">Web Technologies</div>
                    <div class="skill-bar">
                        <span class="skill-name">HTML</span>
                        <div class="skill-progress" style="width: 90%"></div>
                    </div>
                    <div class="skill-bar">
                        <span class="skill-name">CSS</span>
                        <div class="skill-progress" style="width: 85%"></div>
                    </div>
                    <div class="skill-bar">
                        <span class="skill-name">React</span>
                        <div class="skill-progress" style="width: 80%"></div>
                    </div>
                </div>
                <div class="skill-category">
                    <div class="skill-category-title">Other Skills</div>
                    <div class="skill-bar">
                        <span class="skill-name">ALP</span>
                        <div class="skill-progress" style="width: 70%"></div>
                    </div>
                    <div class="skill-bar">
                        <span class="skill-name">R</span>
                        <div class="skill-progress" style="width: 65%"></div>
                    </div>
                    <div class="skill-bar">
                        <span class="skill-name">SQL</span>
                        <div class="skill-progress" style="width: 75%"></div>
                    </div>
                </div>
            </div>
        </div>`
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
function switchPlanet(name, onComplete) {
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
            if (onComplete) onComplete();
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


