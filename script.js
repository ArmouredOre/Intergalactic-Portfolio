// ===== NEXT PLANET BUTTON =====
document.getElementById("next-planet").addEventListener("click", () => {
    if (isAnimating || isOrbiting) return;

    currentPlanetIndex = (currentPlanetIndex + 1) % planetKeys.length;
    const nextKey = planetKeys[currentPlanetIndex];
    
    switchPlanet(nextKey);

    const planetNameEl = document.getElementById("planet-name");
    const descriptionEl = document.getElementById("description");
    planetNameEl.style.transition = "opacity 2s ease-out";
    descriptionEl.style.transition = "opacity 2s ease-out";

    planetNameEl.style.opacity = 0; 
    descriptionEl.style.opacity = 0;


    setTimeout(() => {
        planetNameEl.textContent = planets[nextKey].displayName;
        descriptionEl.textContent = planets[nextKey].description;
        planetNameEl.style.transition = "opacity 2s ease-out";
        descriptionEl.style.transition = "opacity 2s ease-out";
        planetNameEl.style.opacity = 1; 
        descriptionEl.style.opacity = 1; 
        tellMapToUpdate(nextKey);
    }, 2500);
});

// ===== ORBIT STATE & BUTTON =====
let isOrbiting = false;
const orbitBtn = document.getElementById("orbit");
const extractBtn = document.getElementById("extract");
const orbitWarning = document.getElementById("orbit-warning");

orbitBtn.addEventListener("click", () => {
    
    if (isAnimating) return;
    isOrbiting = !isOrbiting;
    const nextBtn = document.getElementById("next-planet");

    const currentData = planets[planetKeys[currentPlanetIndex]];
    const normalScale = currentData.size;
    const orbitScale = normalScale * 1.5;
    
    if (isOrbiting) {
        // ENTER ORBIT
        orbitBtn.textContent = "LEAVE ORBIT";
        orbitWarning.style.display = "none";
        extractBtn.style.display = "block"; 
        
        // NEW: Visually disable the Next Planet button
        nextBtn.style.opacity = "0.4";
        nextBtn.style.cursor = "not-allowed";
        
        animateScale(normalScale, orbitScale);
    } else {
        // LEAVE ORBIT
        orbitBtn.textContent = "ORBIT";
        orbitWarning.style.display = "block";
        extractBtn.style.display = "none";
        
        // NEW: Visually re-enable the Next Planet button
        nextBtn.style.opacity = "1";
        nextBtn.style.cursor = "pointer";
        
        animateScale(orbitScale, normalScale);
    }
});

function animateScale(startSize, endSize) {
    let scaleStartTime = null;
    const scaleDuration = 800;

    function scaleLoop(timestamp) {
        if (!scaleStartTime) scaleStartTime = timestamp;
        let progress = (timestamp - scaleStartTime) / scaleDuration;

        if (progress < 1) {
            const ease = 1 - Math.pow(1 - progress, 3);
            const currentScale = startSize + (endSize - startSize) * ease;
            planetMesh.scale.set(currentScale, currentScale, currentScale);
            requestAnimationFrame(scaleLoop);
        } else {
            planetMesh.scale.set(endSize, endSize, endSize);
        }
    }
    requestAnimationFrame(scaleLoop);
}

// ===== TIME MACHINE LOGIC =====
const speeds = [0.5, 1, 1.5, 2, 4];
let currentSpeedIndex = 1;

window.timeMultiplier = speeds[currentSpeedIndex]; 

const timeScreen = document.getElementById("time-screen");

function updateTimeMachine() {
    window.timeMultiplier = speeds[currentSpeedIndex];
    timeScreen.textContent = window.timeMultiplier + "x";
}

// Decrease Speed (<<)
document.getElementById("backward").addEventListener("click", () => {
    if (currentSpeedIndex > 0) {
        currentSpeedIndex--;
        updateTimeMachine();
    }
});

// Increase Speed (>>)
document.getElementById("forward").addEventListener("click", () => {
    if (currentSpeedIndex < speeds.length - 1) { 
        currentSpeedIndex++;
        updateTimeMachine();
    }
});

// ===== EXTRACTION POPUP LOGIC =====
const extractionPopup = document.getElementById("extraction-popup");
const closePopupBtn = document.getElementById("close-popup");
const extractedTitle = document.getElementById("extracted-title");
const extractedInfo = document.getElementById("extracted-info");

document.getElementById("extract").addEventListener("click", () => {
    const currentPlanetKey = planetKeys[currentPlanetIndex];
    const data = planets[currentPlanetKey];
    
    extractedTitle.textContent = `${data.displayName} Data`;
    extractedInfo.textContent = data.extractedData;
    
    extractionPopup.classList.add("show");
});

closePopupBtn.addEventListener("click", () => {
    extractionPopup.classList.remove("show");
});

// ===== IFRAME WALKIE-TALKIE HELPER =====
function tellMapToUpdate(planetId) {
    const mapIframe = document.querySelector("iframe"); 
    if (mapIframe && mapIframe.contentWindow) {
        mapIframe.contentWindow.postMessage({
            type: 'UPDATE_MAP',
            planetId: planetId
        }, '*');
    }
}

window.addEventListener("load", () => {
    setTimeout(() => {
        tellMapToUpdate(planetKeys[currentPlanetIndex]);
    }, 500);
});

window.addEventListener('message', (event) => {
    if (event.data.type === 'CHANGE_PLANET') {
        const nextKey = event.data.planetId;
        
        if (isAnimating || isOrbiting || planetKeys[currentPlanetIndex] === nextKey) return;
        
        currentPlanetIndex = planetKeys.indexOf(nextKey);
        switchPlanet(nextKey);
        
        tellMapToUpdate(nextKey);
        
        const planetNameEl = document.getElementById("planet-name");
        const descriptionEl = document.getElementById("description");

        planetNameEl.style.transition = "opacity 2s ease-out";
        descriptionEl.style.transition = "opacity 2s ease-out";
        planetNameEl.style.opacity = 0; 
        descriptionEl.style.opacity = 0; 

        setTimeout(() => {
            planetNameEl.textContent = planets[nextKey].displayName;
            descriptionEl.textContent = planets[nextKey].description;
            
            planetNameEl.style.transition = "opacity 2s ease-out";
            descriptionEl.style.transition = "opacity 2s ease-out";
            planetNameEl.style.opacity = 1; 
            descriptionEl.style.opacity = 1; 
        }, 2500); 
    }
});