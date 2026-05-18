import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTheme } from "next-themes";
import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import * as THREE from "three";

const cameraPosVector = new THREE.Vector3(0, 0, 200);

function Random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

interface Particle {
    time: number;
    x: number;
    y: number;
    z: number;
    speed: number;
}

interface StarProps {
    scrollSpeed: number;
    scrollDirection: number;
    theme: string;
}

const Star: React.FC<StarProps> = ({ scrollSpeed, scrollDirection, theme }) => {
    const light = useRef<THREE.PointLight>(null);
    const mesh = useRef<THREE.InstancedMesh>(null);
    const count = 150;

    const particles = useMemo<Particle[]>(() => {
        const temp: Particle[] = [];
        for (let i = 0; i < count; i++) {
            const time = Random(0, 100);
            const x = Random(-100, 100);
            const y = Random(-100, 100);
            const z = Random(-100, 100);
            const speed = Random(0.01, 1) / 3;

            temp.push({ time, x, y, z, speed });
        }
        return temp;
    }, [count]);

    const dummy = useMemo(() => new THREE.Object3D(), []);
    const color = theme === "dark" ? "white" : "black";

    useFrame(() => {
        particles.forEach((particle, index) => {
            const { x, y, z, speed } = particle;
            particle.time += speed * scrollSpeed * scrollDirection;
            const t = particle.time;
            dummy.position.set(x, y, z + (t % 100));
            dummy.updateMatrix();
            mesh.current?.setMatrixAt(index, dummy.matrix);
        });
        if (mesh.current) mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <>
            <pointLight
                ref={light}
                distance={100}
                intensity={50}
                color={color}
                position={[
                    cameraPosVector.x,
                    cameraPosVector.y,
                    cameraPosVector.z + 10,
                ]}
            />
            <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
                <sphereGeometry args={[0.12]} />
                <dodecahedronGeometry args={[0.12, 0]} />
                <meshBasicMaterial color={color} />
            </instancedMesh>
        </>
    );
};

export const Stars: React.FC = () => {
    const [scrollSpeed, setScrollSpeed] = useState<number>(1);
    const [scrollDirection, setScrollDirection] = useState<number>(1);
    const lastScrollY = useRef<number>(0);
    const themeContext = useTheme();
    const backgroundColor = themeContext.resolvedTheme === "dark" ? "black" : "white";
    const resolvedTheme = themeContext.resolvedTheme ?? "light";

    useEffect(() => {
        const handleScroll = (): void => {
            const currentScrollY = window.scrollY;
            const delta = currentScrollY - lastScrollY.current;

            if (delta > 0) {
                setScrollDirection(1);
            } else if (delta < 0) {
                setScrollDirection(-1);
            }

            setScrollSpeed(Math.min(5, 1 + Math.abs(delta) / 100));

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <Canvas
            style={{
                height: "100vh",
                position: "fixed",
                top: "0",
                left: "0",
                background: backgroundColor,
            }}
            flat
            shadows={false}
        >
            <>
                <PerspectiveCamera makeDefault position={cameraPosVector} />
                <Star
                    scrollSpeed={scrollSpeed}
                    scrollDirection={scrollDirection}
                    theme={resolvedTheme}
                />
            </>
        </Canvas>
    );
};

export default Stars;