document.getElementById("test").innerHTML = "TEST"


// const container = document.getElementById('container');
// const width = container.clientWidth;
// const height = container.clientHeight;

// // 1. Scene Setup
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
// camera.position.z = 5;

// const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
// renderer.setSize(width, height);
// document.getElementById('gl-canvas-proxy').appendChild(renderer.domElement);

// // 2. Load Normal Map
// const loader = new THREE.TextureLoader();
// const normalMap = loader.load('textures/brickNormal.jpg');

// // 3. Create Material & Plane
// // MeshStandardMaterial reacts to lights automatically using the normal map
// const material = new THREE.MeshStandardMaterial({
//   color: 0x222222,
//   normalMap: normalMap,
//   roughness: 0.3,
//   metalness: 0.8
// });

// const geometry = new THREE.PlaneGeometry(10, 7); // Adjust size to fill container
// const plane = new THREE.Mesh(geometry, material);
// scene.add(plane);

// // 4. The Light Source
// const light = new THREE.PointLight(0xffffff, 2, 15);
// light.position.set(0, 0, 2);
// scene.add(light);

// // Ambient light so the "dark" parts aren't pitch black
// scene.add(new THREE.AmbientLight(0xffffff, 0.1));

// // 5. Mouse Interaction
// window.addEventListener('mousemove', (e) => {
//   const rect = container.getBoundingClientRect();
  
//   // Convert mouse pixels to WebGL coordinates (-5 to 5 range)
//   const x = ((e.clientX - rect.left) / width) * 2 - 1;
//   const y = -((e.clientY - rect.top) / height) * 2 + 1;

//   // Smoothly move the light (Lerp could be added here)
//   light.position.x = x * 5; 
//   light.position.y = y * 3;
// });

// function animate() {
//   requestAnimationFrame(animate);
//   renderer.render(scene, camera);
// }
// animate();

// --- CONFIGURATION ---
        const NORMAL_MAP_URL = 'textures/brickNormal.jpg'; // Example normal map (bumpy texture)
        const PLANE_WIDTH = 10; // Internal Three.js units
        // const PLANE_HEIGHT = (window.innerHeight / window.innerWidth) * PLANE_WIDTH;
        const PLANE_HEIGHT = 7;

        // --- WEBGL SETUP ---
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(
            PLANE_WIDTH / -2, PLANE_WIDTH / 2, 
            PLANE_HEIGHT / 2, PLANE_HEIGHT / -2, 
            0.1, 1000
        );
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('gl-canvas-proxy').appendChild(renderer.domElement);

        // Light setup
        const ambient = new THREE.AmbientLight(0xffffff, 0.05); // Subtle baseline light
        scene.add(ambient);

        const pointLight = new THREE.PointLight(0xffffff, 2.5, 15);
        pointLight.position.set(0, 0, 1.5); // Initial Z-height
        scene.add(pointLight);

        // Material setup
        const textureLoader = new THREE.TextureLoader();
        const material = new THREE.MeshStandardMaterial({
            color: 0x111111,
            normalMap: textureLoader.load(NORMAL_MAP_URL),
            roughness: 0.4,
            metalness: 0.7
        });

        const geometry = new THREE.PlaneGeometry(PLANE_WIDTH, PLANE_HEIGHT);
        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        // --- INTERACTION LOGIC ---
        const bulb = document.getElementById('light-bulb');
        let isDragging = false;

        // Initial Position
        let pixelX = window.innerWidth / 2;
        let pixelY = window.innerHeight / 2;

        function updatePositions() {
            // Update UI
            bulb.style.left = `${pixelX}px`;
            bulb.style.top = `${pixelY}px`;
            bulb.style.transform = `translate(-50%, -50%)`;

            // Convert Pixels to WebGL Units
            // Map 0 -> window.innerWidth TO -PLANE_WIDTH/2 -> PLANE_WIDTH/2
            const webglX = ((pixelX / window.innerWidth) * PLANE_WIDTH) - (PLANE_WIDTH / 2);
            const webglY = -((pixelY / window.innerHeight) * PLANE_HEIGHT) + (PLANE_HEIGHT / 2);
            
            pointLight.position.x = webglX;
            pointLight.position.y = webglY;
        }

        // Drag events
        bulb.addEventListener('mousedown', () => isDragging = true);
        window.addEventListener('mouseup', () => isDragging = false);
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            pixelX = e.clientX;
            pixelY = e.clientY;
            updatePositions();
        });

        // Window Resize Handling
        window.addEventListener('resize', () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            renderer.setSize(w, h);
            
            const newHeight = (h / w) * PLANE_WIDTH;
            camera.top = newHeight / 2;
            camera.bottom = newHeight / -2;
            camera.updateProjectionMatrix();
            
            plane.geometry = new THREE.PlaneGeometry(PLANE_WIDTH, newHeight);
            updatePositions();
        });

        // Animation Loop
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }

        updatePositions(); // Initialize
        animate();