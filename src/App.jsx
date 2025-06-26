import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// Data Portofolio - Edit bagian ini sesuai kebutuhan Anda
const portfolioData = {
    name: "Nama Anda",
    tagline: "Full-Stack Developer & Creative Technologist",
    about: "Selamat datang di portofolio interaktif saya. Saya adalah seorang engineer perangkat lunak dengan hasrat untuk menciptakan pengalaman digital yang mulus dan menarik secara visual. Keahlian saya terletak pada perpaduan antara backend yang tangguh dan frontend yang dinamis.",
    projects: [
        { title: "Platform Analitik Real-Time", description: "Membangun dasbor analitik performa tinggi yang memproses dan memvisualisasikan jutaan titik data per menit." },
        { title: "Proyek: Mesin Rekomendasi E-commerce", description: "Mengembangkan layanan mikro yang menyediakan rekomendasi produk yang dipersonalisasi, meningkatkan keterlibatan pengguna sebesar 25%." },
        { title: "Proyek: Instalasi Seni Interaktif", description: "Berkolaborasi dalam sebuah instalasi seni generatif yang merespons gerakan pengunjung, menggunakan React dan Three.js." }
    ],
    contact: {
        email: "mailto:ganti.dengan.email.valid@anda.com",
        linkedin: "https://www.linkedin.com/in/username-anda/",
        github: "https://github.com/username-anda/"
    }
};

export default function App() {
    const canvasRef = useRef(null);
    const mainContainerRef = useRef(null);

    useEffect(() => {
        // --- Inisialisasi Scene Three.js ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
            alpha: true,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // --- Logika Pembuatan Galaksi ---
        const parameters = { count: 200000, size: 0.01, radius: 8, branches: 5, spin: 1, randomness: 0.5, randomnessPower: 4, insideColor: '#ff6030', outsideColor: '#1b3984' };
        
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
        const material = new THREE.PointsMaterial({ size: parameters.size, sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true });
        const points = new THREE.Points(geometry, material);
        scene.add(points);
        camera.position.set(0, 2, 15);
        
        // --- TIMELINE UTAMA GSAP UNTUK SEMUA ANIMASI ---
        const mainContainer = mainContainerRef.current;
        const sections = gsap.utils.toArray(".section");
        
        const masterTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: mainContainer,
                pin: true, 
                scrub: 1.5,
                start: "top top",
                end: "+=5000",
            }
        });

        masterTimeline
            .to(camera.position, { z: 2.5, y: -0.2, ease: "power1.inOut" })
            .to(points.rotation, { y: Math.PI * 0.25 }, "<") 
            .to('.intro-view', { opacity: 0 }, "<")
            .fromTo('.portfolio-sections', { opacity: 0 }, { opacity: 1 }, "<0.5");

        masterTimeline.to(sections, {
            xPercent: -100 * (sections.length - 1),
            ease: "none",
        });

        sections.forEach(section => {
            const content = section.querySelector('.section-content');
            // Animasikan elemen di dalam section-content
            const elementsToAnimate = content.querySelectorAll("h2, p, .projects-list, .contact-links");

            gsap.from(elementsToAnimate, {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                stagger: 0.2,
                scrollTrigger: {
                    trigger: section,
                    containerAnimation: masterTimeline, 
                    start: 'left center', 
                }
            });
        });

        
        // --- Loop Animasi & Penanganan Resize ---
        const clock = new THREE.Clock();
        const animate = () => {
            points.rotation.y += clock.getDelta() * 0.05;
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            ScrollTrigger.refresh();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            renderer.dispose();
            geometry.dispose();
            material.dispose();
        };
    }, []);

    return (
        <div ref={mainContainerRef} style={{height: "500vh"}}>
            <div className="content-container">
                <canvas id="galaxy-canvas" ref={canvasRef}></canvas>
                <div className="intro-view">
                    <h1>{portfolioData.name}</h1>
                    <p>{portfolioData.tagline}</p>
                    <p className="scroll-prompt">↓ Scroll untuk Memulai ↓</p>
                </div>
                
                <div className="portfolio-sections">
                    <section className="section">
                        <div className="section-content">
                            <h2>Tentang Saya</h2>
                            <p>{portfolioData.about}</p>
                        </div>
                    </section>
                    <section className="section">
                        <div className="section-content">
                            <h2>Proyek Unggulan</h2>
                            <div className="projects-list"> 
                                {portfolioData.projects.map((project, index) => (
                                    <div key={index} className="project-item">
                                        <h3>{project.title}</h3>
                                        <p>{project.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    <section className="section">
                        <div className="section-content">
                            <h2>Hubungi Saya</h2>
                            <p>Tertarik untuk berkolaborasi? Hubungi saya.</p>
                            <div className="contact-links">
                                <a href={portfolioData.contact.email} className="contact-link">Email</a>
                                <a href={portfolioData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">LinkedIn</a>
                                <a href={portfolioData.contact.github} target="_blank" rel="noopener noreferrer" className="contact-link">GitHub</a>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
