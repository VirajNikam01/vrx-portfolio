# Package Explanations

## `three`

The core 3D library. Gives you all the fundamental building blocks — geometries, materials, meshes, lights, cameras, renderers, vectors, matrices, etc. Everything 3D happens through Three.js under the hood. Without this, nothing works.

---

## `@types/three`

TypeScript type definitions for `three`. Since Three.js is written in JavaScript, this package gives TypeScript the type information it needs — so you get autocomplete, type checking, and IntelliSense for things like `THREE.Vector3`, `THREE.InstancedMesh`, `THREE.PointLight`, etc.

---

## `@react-three/fiber`

A React renderer for Three.js. Instead of manually creating a WebGL canvas, animation loops, scenes, and cameras in imperative Three.js code, Fiber lets you write all of it as declarative JSX — `<mesh>`, `<pointLight>`, `<sphereGeometry>`, etc. It handles the render loop (`useFrame`), scene graph, and keeps everything in sync with React's state system. Think of it as "React DOM but for 3D".

---

## `@react-three/drei`

A collection of ready-made helpers and abstractions built on top of Fiber. Things like `<PerspectiveCamera>`, `<OrbitControls>`, `<Text>`, `<Environment>`, `<Loader>` etc. that would otherwise require a lot of boilerplate to set up manually. In your code specifically, it provides `<PerspectiveCamera makeDefault />` which sets up and registers the camera into the Fiber scene automatically.
