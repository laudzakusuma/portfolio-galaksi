import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// Data Portofolio - Edit bagian ini sesuai kebutuhan Anda
const portfolioData = {
    name: "Yve Leonardo Alexandr",
    tagline: "Web 3 Enthusiast & AI Enhanced Creative Technologist",
    about: "Selamat datang di portofolio interaktif saya. Saya adalah seorang engineer perangkat lunak dengan hasrat untuk menciptakan pengalaman digital yang mulus dan menarik secara visual. Keahlian saya terletak pada perpaduan antara backend yang tangguh dan frontend yang dinamis.",
    projects: [
        { title: "SISTEM ANALITIK", description: "Membangun dasbor analitik performa tinggi yang memproses dan memvisualisasikan jutaan titik data per menit menggunakan arsitektur berbasis event." },
        { title: "MESIN REKOMENDASI", description: "Mengembangkan layanan mikro yang menyediakan rekomendasi produk yang dipersonalisasi, meningkatkan keterlibatan pengguna sebesar 25%." },
        { title: "INSTALASI SENI", description: "Berkolaborasi dalam sebuah instalasi seni generatif yang merespons gerakan pengunjung, menggunakan React dan Three.js untuk menciptakan visual yang imersif." }
    ],
    contact: {
        email: "mailto:ganti.dengan.email.valid@anda.com",
        linkedin: "https://www.linkedin.com/in/username-anda/",
        github: "https://github.com/username-anda/"
    }
};

// Komponen baru untuk Konsol Proyek
function ProjectsConsole() {
    const [activeIndex, setActiveIndex] = useState(0);
    const hologramScreenRef = useRef(null);

    const handleTargetClick = (index) => {
        if (activeIndex === index) return;
        
        gsap.to(hologramScreenRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                setActiveIndex(index);
                gsap.fromTo(hologramScreenRef.current, 
                    { opacity: 0, y: 20, filter: 'blur(5px)' }, 
                    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4, ease: 'power2.out' }
                );
            }
        });
    };

    return (
        <div className="projects-console">
            <div className="targets-list">
                {portfolioData.projects.map((project, index) => (
                    <div 
                        key={index} 
                        className={`target-item ${index === activeIndex ? 'active' : ''}`}
                        onClick={() => handleTargetClick(index)}
                    >
                        {project.title}
                    </div>
                ))}
            </div>
            <div ref={hologramScreenRef} className="hologram-screen">
                <h3>{portfolioData.projects[activeIndex].title}</h3>
                <p>{portfolioData.projects[activeIndex].description}</p>
            </div>
        </div>
    );
}

// Fungsi helper untuk membuat galaksi
const generateGalaxy = (parameters) => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);
    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;
        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin;
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / parameters.radius);
        colors[i3] = mixedColor.r; colors[i3 + 1] = mixedColor.g; colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({ size: parameters.size, sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true, transparent: true, opacity: 1 });
    return new THREE.Points(geometry, material);
};


export default function App() {
    const canvasRef = useRef(null);
    const mainContainerRef = useRef(null);
    const contentContainerRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            
            // Galaksi A (About)
            const galaxyA = generateGalaxy({ count: 200000, size: 0.01, radius: 8, branches: 5, spin: 1, randomness: 0.5, randomnessPower: 4, insideColor: '#ff6030', outsideColor: '#1b3984' });
            scene.add(galaxyA);

            // Galaksi B (Projects)
            const galaxyB = generateGalaxy({ count: 150000, size: 0.015, radius: 6, branches: 3, spin: -1.5, randomness: 0.8, randomnessPower: 3, insideColor: '#90cdf4', outsideColor: '#a855f7' });
            galaxyB.visible = false;
            scene.add(galaxyB);
            
            // Galaksi C (Contact)
            const galaxyC = generateGalaxy({ count: 250000, size: 0.01, radius: 10, branches: 7, spin: 0.5, randomness: 0.4, randomnessPower: 4, insideColor: '#4ade80', outsideColor: '#16a34a' });
            galaxyC.visible = false;
            scene.add(galaxyC);


            camera.position.set(0, 2, 15);
            
            const mainContainer = mainContainerRef.current;
            
            const masterTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: mainContainer,
                    pin: contentContainerRef.current, 
                    scrub: 1.5,
                    start: "top top",
                    end: "bottom+=100% bottom", 
                }
            });

            // Bagian 1: Zoom ke Galaksi A (About)
            masterTimeline
                .to(".intro-view", { autoAlpha: 0 })
                .to(camera.position, { z: 2.5, y: -0.2, ease: "power1.inOut" }, "<")
                .to(galaxyA.rotation, { y: Math.PI * 0.25 }, "<")
                .to("#about-wrapper", { autoAlpha: 1, pointerEvents: 'auto' }, "<0.5");

            masterTimeline.to({}, { duration: 1 }); // Tahan

            // Bagian 2: Zoom out dari Galaksi A & Transisi ke B
            masterTimeline
                .to(camera.position, { z: 15, y: 2, ease: "power1.inOut" })
                .to("#about-wrapper", { autoAlpha: 0, pointerEvents: 'none' }, "<")
                .to(galaxyA, { onStart: () => { galaxyB.visible = true; } })
                .to(galaxyA.material, { opacity: 0, onComplete: () => { galaxyA.visible = false; } }, ">-0.5")
                .to(galaxyB.material, { opacity: 1 }, "<")
                .to(camera.rotation, { y: Math.PI * 1, ease: "power2.inOut"}, "<");

            // Bagian 3: Zoom ke Galaksi B (Projects)
            masterTimeline
                .to(camera.position, { z: 3.5, y: 0, ease: "power1.inOut" })
                .to(galaxyB.rotation, { y: Math.PI * 0.3 }, "<")
                .to("#projects-wrapper", { autoAlpha: 1, pointerEvents: 'auto' }, "<0.5");
            
            masterTimeline.to({}, { duration: 1 }); // Tahan

            // Bagian 4: Zoom out dari Galaksi B & Transisi ke C
            masterTimeline
                .to(camera.position, { z: 15, y: 2, ease: "power1.inOut" })
                .to("#projects-wrapper", { autoAlpha: 0, pointerEvents: 'none' }, "<")
                .to(galaxyB, { onStart: () => { galaxyC.visible = true; } })
                .to(galaxyB.material, { opacity: 0, onComplete: () => { galaxyB.visible = false; } }, ">-0.5")
                .to(galaxyC.material, { opacity: 1 }, "<")
                .to(camera.rotation, { y: Math.PI * 2, ease: "power2.inOut"}, "<");

            // Bagian 5: Zoom ke Galaksi C (Contact)
            masterTimeline
                .to(camera.position, { z: 2.5, y: -0.2, ease: "power1.inOut" })
                .to(galaxyC.rotation, { y: Math.PI * 0.15 }, "<")
                .to("#contact-wrapper", { autoAlpha: 1, pointerEvents: 'auto' }, "<0.5");


            const clock = new THREE.Clock();
            const animate = () => {
                const delta = clock.getDelta();
                galaxyA.rotation.y += delta * 0.05;
                galaxyB.rotation.y += delta * 0.08;
                galaxyC.rotation.y += delta * 0.03;
                renderer.render(scene, camera);
                requestAnimationFrame(animate);
            };
            animate();

            const handleResize = () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                ScrollTrigger.refresh(true);
            };
            window.addEventListener('resize', handleResize);
            
            return () => {
                window.removeEventListener('resize', handleResize);
                renderer.dispose();
            };
        }, mainContainerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={mainContainerRef} style={{height: "1000vh"}}>
            <div ref={contentContainerRef} className="content-container">
                <canvas id="galaxy-canvas" ref={canvasRef}></canvas>
                
                <div className="section-wrapper intro-view">
                    <div className="intro-view-content">
                      <h1>{portfolioData.name}</h1>
                      <p>{portfolioData.tagline}</p>
                      <p className="scroll-prompt">↓ Scroll untuk Memulai ↓</p>
                    </div>
                </div>

                <div id="about-wrapper" className="section-wrapper">
                    <div className="section-content">
                        <h2>PROFIL MISI</h2>
                        <p>{portfolioData.about}</p>
                    </div>
                </div>

                 <div id="projects-wrapper" className="section-wrapper">
                    <div className="section-content">
                        <h2>KONSOL PROYEK</h2>
                        <ProjectsConsole />
                    </div>
                </div>
                
                 <div id="contact-wrapper" className="section-wrapper">
                    <div className="section-content">
                        <h2>SALURAN KOMUNIKASI</h2>
                        <p>Buka saluran komunikasi untuk kolaborasi atau pertanyaan lebih lanjut.</p>
                         <div className="contact-links">
                            <a href={portfolioData.contact.email} className="contact-link">TRANSMISI DATA</a>
                            <a href={portfolioData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">LOG PROFESIONAL</a>
                            <a href={portfolioData.contact.github} target="_blank" rel="noopener noreferrer" className="contact-link">ARSIP KODE</a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
