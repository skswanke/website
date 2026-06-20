import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { feature, mesh } from "topojson-client";
import statesTopology from "us-atlas/states-10m.json";
import countriesTopology from "world-atlas/countries-50m.json";
import {
  countries,
  homeState,
  pins as pinCoordinates,
  states as visitedStateData,
  stateWishList,
  wishList,
} from "../_data/travel";
import { MOBILE_CUTOFF } from "../lib/use-is-mobile";

type Coordinate = [number, number];

type PolygonGeometry = {
  type: "Polygon";
  coordinates: Coordinate[][];
};

type MultiPolygonGeometry = {
  type: "MultiPolygon";
  coordinates: Coordinate[][][];
};

type NamedFeature = {
  geometry: PolygonGeometry | MultiPolygonGeometry | null;
  properties?: {
    name?: string;
  };
};

type NamedFeatureCollection = {
  features: NamedFeature[];
};

type LineGeometry = {
  type: "LineString" | "MultiLineString";
  coordinates: Coordinate[] | Coordinate[][];
};

type TextureSize = {
  height: number;
  width: number;
};

const countriesData = countriesTopology as any;
const statesData = statesTopology as any;

const countryFeatures = feature(
  countriesData,
  countriesData.objects.countries
) as unknown as NamedFeatureCollection;

const stateFeatures = feature(
  statesData,
  statesData.objects.states
) as unknown as NamedFeatureCollection;

const countryBorders = mesh(
  countriesData,
  countriesData.objects.countries,
  (a, b) => a !== b
) as unknown as LineGeometry;

const stateBorders = mesh(
  statesData,
  statesData.objects.states,
  (a, b) => a !== b
) as unknown as LineGeometry;

const TEXTURE_WIDTH = 8000;
const TEXTURE_HEIGHT = 8000;
const MOBILE_TEXTURE_WIDTH = 4096;
const GLOBE_RADIUS = 2.18;
const PIN_HEAD_COLOR = "#d43f3a";
const PIN_STEM_COLOR = "#111111";
const PIN_SCALE = 0.1;
const PIN_SURFACE_INSET = 0.002;
const MIN_CAMERA_DISTANCE = 4.2;
const MAX_CAMERA_DISTANCE = 20;

const countryAliases: Record<string, string> = {
  "Czech Republic": "Czechia",
};

const visitedCountries = new Set(countries.map(normalizeCountryName));
const wishListCountries = new Set(wishList.map(normalizeCountryName));
const homeStateName = normalizeStateName(homeState);
const visitedStates = new Set(visitedStateData.map(normalizeStateName));
const wishListStates = new Set(stateWishList.map(normalizeStateName));

const themes = {
  light: {
    ocean: "#376ea7",
    land: "#ece7dd",
    // border: "rgba(78, 95, 99, 0.62)",
    border: "rgba(0, 0, 0, 1)",
    home: "#efcc78",
    visited: "#7ab169",
    wishList: "#b16969",
    glow: "#8ec5d6",
    page: "#ffffff",
  },
  dark: {
    ocean: "#376ea7",
    land: "#2e3430",
    border: "rgba(206, 226, 225, 0.42)",
    home: "#5a9cbb",
    visited: "#6da65e",
    wishList: "#ad6262",
    glow: "#4d9cb7",
    page: "#000000",
  },
};

function normalizeCountryName(name: string) {
  const readableName = name.replace(/\./g, " ");
  return countryAliases[readableName] ?? readableName;
}

function normalizeStateName(name: string) {
  return name.replace(/\./g, " ");
}

function getTheme(darkMode: boolean) {
  return darkMode ? themes.dark : themes.light;
}

function getCountryFill(countryName: string | undefined, darkMode: boolean) {
  const theme = getTheme(darkMode);

  if (countryName && visitedCountries.has(countryName)) {
    return theme.visited;
  }

  if (countryName && wishListCountries.has(countryName)) {
    return theme.wishList;
  }

  return theme.land;
}

function getStateFill(stateName: string | undefined, darkMode: boolean) {
  const theme = getTheme(darkMode);

  if (stateName === homeStateName) {
    return theme.home;
  }

  if (stateName && visitedStates.has(stateName)) {
    return theme.visited;
  }

  if (stateName && wishListStates.has(stateName)) {
    return theme.wishList;
  }

  return theme.land;
}

function projectCoordinate(
  [longitude, latitude]: Coordinate,
  textureSize: TextureSize
) {
  return {
    x: ((longitude + 180) / 360) * textureSize.width,
    y: ((90 - latitude) / 180) * textureSize.height,
  };
}

function unwrapCoordinates(
  coordinates: Coordinate[],
  textureSize: TextureSize
) {
  if (coordinates.length === 0) {
    return [];
  }

  const points = coordinates.map((coordinate) =>
    projectCoordinate(coordinate, textureSize)
  );

  for (let index = 1; index < points.length; index += 1) {
    const previousX = points[index - 1].x;

    while (points[index].x - previousX > textureSize.width / 2) {
      points[index].x -= textureSize.width;
    }

    while (previousX - points[index].x > textureSize.width / 2) {
      points[index].x += textureSize.width;
    }
  }

  return points;
}

function addRingToPath(
  context: CanvasRenderingContext2D,
  ring: Coordinate[],
  offset: number,
  textureSize: TextureSize
) {
  const points = unwrapCoordinates(ring, textureSize);

  if (points.length === 0) {
    return;
  }

  context.moveTo(points[0].x + offset, points[0].y);

  for (let index = 1; index < points.length; index += 1) {
    context.lineTo(points[index].x + offset, points[index].y);
  }

  context.closePath();
}

function addPolygonToPath(
  context: CanvasRenderingContext2D,
  polygon: Coordinate[][],
  textureSize: TextureSize
) {
  for (const offset of [-textureSize.width, 0, textureSize.width]) {
    for (const ring of polygon) {
      addRingToPath(context, ring, offset, textureSize);
    }
  }
}

function addCountryToPath(
  context: CanvasRenderingContext2D,
  geometry: PolygonGeometry | MultiPolygonGeometry,
  textureSize: TextureSize
) {
  if (geometry.type === "Polygon") {
    addPolygonToPath(context, geometry.coordinates, textureSize);
    return;
  }

  for (const polygon of geometry.coordinates) {
    addPolygonToPath(context, polygon, textureSize);
  }
}

function getLineStrings(geometry: LineGeometry) {
  if (geometry.type === "LineString") {
    return [geometry.coordinates as Coordinate[]];
  }

  return geometry.coordinates as Coordinate[][];
}

function drawLineGeometry(
  context: CanvasRenderingContext2D,
  geometry: LineGeometry,
  color: string,
  lineWidth: number,
  textureSize: TextureSize
) {
  context.save();
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.lineCap = "round";
  context.lineJoin = "round";

  for (const line of getLineStrings(geometry)) {
    const points = unwrapCoordinates(line, textureSize);

    for (const offset of [-textureSize.width, 0, textureSize.width]) {
      context.beginPath();

      points.forEach((point, index) => {
        if (index === 0) {
          context.moveTo(point.x + offset, point.y);
          return;
        }

        context.lineTo(point.x + offset, point.y);
      });

      context.stroke();
    }
  }

  context.restore();
}

function prefersReducedTextureSize() {
  return (
    window.innerWidth <= MOBILE_CUTOFF ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

function getTextureSize(renderer: THREE.WebGLRenderer): TextureSize {
  const targetWidth = prefersReducedTextureSize()
    ? MOBILE_TEXTURE_WIDTH
    : TEXTURE_WIDTH;
  const maxTextureWidth = renderer.capabilities.maxTextureSize || targetWidth;
  const width = Math.min(targetWidth, maxTextureWidth);

  return {
    height: Math.round(width * (TEXTURE_HEIGHT / TEXTURE_WIDTH)),
    width,
  };
}

function createGlobeTextureCanvas(darkMode: boolean, textureSize: TextureSize) {
  const canvas = document.createElement("canvas");
  canvas.width = textureSize.width;
  canvas.height = textureSize.height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create a canvas texture for the travel globe.");
  }

  const theme = getTheme(darkMode);

  context.fillStyle = theme.ocean;
  context.fillRect(0, 0, textureSize.width, textureSize.height);

  for (const country of countryFeatures.features) {
    if (!country.geometry) {
      continue;
    }

    context.beginPath();
    addCountryToPath(context, country.geometry, textureSize);
    context.fillStyle = getCountryFill(country.properties?.name, darkMode);
    context.fill("evenodd");
  }

  for (const state of stateFeatures.features) {
    if (!state.geometry) {
      continue;
    }

    context.beginPath();
    addCountryToPath(context, state.geometry, textureSize);
    context.fillStyle = getStateFill(state.properties?.name, darkMode);
    context.fill("evenodd");
  }

  drawLineGeometry(context, countryBorders, theme.border, 1.5, textureSize);
  drawLineGeometry(context, stateBorders, theme.border, 1, textureSize);

  return canvas;
}

function getInitialDarkMode() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getLegacyStageSize(width: number, height: number) {
  if (width <= MOBILE_CUTOFF) {
    return {
      height: clamp(height * 0.45, 360, 420),
      width: Math.max(width - 64, 280),
    };
  }

  return {
    height: clamp(height * 0.6, 440, 680),
    width: Math.min(width - 128, 1080),
  };
}

function getInitialGlobeCenterY(
  width: number,
  height: number,
  stageHeight: number
) {
  if (width <= MOBILE_CUTOFF) {
    return Math.min(height * 0.65, 214 + stageHeight / 2);
  }

  return Math.min(height * 0.72, 246 + stageHeight / 2);
}

function getSphereNormal([latitude, longitude]: Coordinate) {
  const longitudeRadians = THREE.MathUtils.degToRad(longitude);
  const latitudeRadians = THREE.MathUtils.degToRad(latitude);
  const latitudeRadius = Math.cos(latitudeRadians);

  return new THREE.Vector3(
    latitudeRadius * Math.cos(longitudeRadians),
    Math.sin(latitudeRadians),
    -latitudeRadius * Math.sin(longitudeRadians)
  ).normalize();
}

function createLocationPin(coordinate: Coordinate) {
  const surfaceNormal = getSphereNormal(coordinate);
  const pinGroup = new THREE.Group();
  const surfaceOffset = GLOBE_RADIUS - PIN_SURFACE_INSET;
  const stemHeight = 0.32 * PIN_SCALE;
  const headRadius = 0.072 * PIN_SCALE;

  pinGroup.position.copy(surfaceNormal).multiplyScalar(surfaceOffset);
  pinGroup.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    surfaceNormal
  );

  const stemGeometry = new THREE.CylinderGeometry(
    0.014 * PIN_SCALE,
    0.02 * PIN_SCALE,
    stemHeight,
    18
  );
  const stemMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(PIN_STEM_COLOR),
    roughness: 0.42,
    metalness: 0,
  });
  const stem = new THREE.Mesh(stemGeometry, stemMaterial);
  stem.position.y = stemHeight / 2;
  pinGroup.add(stem);

  const headGeometry = new THREE.SphereGeometry(headRadius, 28, 18);
  const headMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(PIN_HEAD_COLOR),
    emissive: new THREE.Color(PIN_HEAD_COLOR),
    emissiveIntensity: 0.16,
    roughness: 0.36,
    metalness: 0,
  });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.y = stemHeight + headRadius * 0.7;
  pinGroup.add(head);

  const rimGeometry = new THREE.SphereGeometry(headRadius * 1.18, 28, 18);
  const rimMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(PIN_HEAD_COLOR),
    transparent: true,
    opacity: 0.22,
  });
  const rim = new THREE.Mesh(rimGeometry, rimMaterial);
  rim.position.copy(head.position);
  pinGroup.add(rim);

  return {
    group: pinGroup,
    geometries: [stemGeometry, headGeometry, rimGeometry],
    materials: [stemMaterial, headMaterial, rimMaterial],
  };
}

function usePrefersDarkMode() {
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);

  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");

    setDarkMode((current) =>
      current === query.matches ? current : query.matches
    );

    const handleChange = (event: MediaQueryListEvent) => {
      setDarkMode(event.matches);
    };

    if (query.addEventListener) {
      query.addEventListener("change", handleChange);
      return () => query.removeEventListener("change", handleChange);
    }

    query.addListener(handleChange);
    return () => query.removeListener(handleChange);
  }, []);

  return darkMode;
}

export default function TravelGlobe() {
  const globeRef = useRef<HTMLDivElement>(null);
  const darkMode = usePrefersDarkMode();

  useEffect(() => {
    const mount = globeRef.current;

    if (!mount) {
      return;
    }

    const theme = getTheme(darkMode);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 6.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(theme.page, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.touchAction = "none";
    mount.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    globeGroup.rotation.set(0.42, 5.9, 0);
    scene.add(globeGroup);

    const textureSize = getTextureSize(renderer);
    const texture = new THREE.CanvasTexture(
      createGlobeTextureCanvas(darkMode, textureSize)
    );
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

    const globeGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 128, 96);
    const globeMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.82,
      metalness: 0,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    globeGroup.add(globe);

    const pins = pinCoordinates.map((coordinate) =>
      createLocationPin(coordinate)
    );
    pins.forEach((pin) => globeGroup.add(pin.group));

    const atmosphereGeometry = new THREE.SphereGeometry(
      GLOBE_RADIUS * 1.012,
      96,
      64
    );
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(theme.glow),
      side: THREE.BackSide,
      transparent: true,
      opacity: darkMode ? 0.14 : 0.18,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphere);

    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      darkMode ? 0.92 : 1.08
    );
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(
      0xffffff,
      darkMode ? 1.7 : 1.45
    );
    keyLight.position.set(2.8, 3.2, 4.4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(
      new THREE.Color(theme.glow),
      darkMode ? 1.2 : 0.72
    );
    rimLight.position.set(-3.4, 1.8, -2.2);
    scene.add(rimLight);

    let animationFrame = 0;
    let isDragging = false;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let velocityX = 0.0015;
    let velocityY = 0;
    let viewportWidth = 0;
    let viewportHeight = 0;
    let pinchStartDistance = 0;
    let pinchStartCameraZ = camera.position.z;
    const activePointers = new Map<number, { x: number; y: number }>();

    const updateGlobeScreenPosition = () => {
      if (viewportWidth === 0 || viewportHeight === 0) {
        return;
      }

      const legacyStage = getLegacyStageSize(viewportWidth, viewportHeight);
      const targetCenterY = getInitialGlobeCenterY(
        viewportWidth,
        viewportHeight,
        legacyStage.height
      );
      const visibleWorldHeight =
        2 *
        camera.position.z *
        Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));

      globeGroup.position.y =
        (0.5 - targetCenterY / viewportHeight) * visibleWorldHeight;
    };

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      const legacyStage = getLegacyStageSize(width, height);
      const targetDiameter =
        Math.min(legacyStage.width, legacyStage.height) * 0.94;

      viewportWidth = width;
      viewportHeight = height;
      camera.aspect = width / height;
      camera.position.z = clamp(
        (GLOBE_RADIUS * 1.08 * height) /
          (targetDiameter * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))),
        6.4,
        20
      );
      updateGlobeScreenPosition();
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const setCameraDistance = (distance: number) => {
      camera.position.z = clamp(
        distance,
        MIN_CAMERA_DISTANCE,
        MAX_CAMERA_DISTANCE
      );
      updateGlobeScreenPosition();
      camera.updateProjectionMatrix();
    };

    const getPinchDistance = () => {
      const pointers = Array.from(activePointers.values());

      if (pointers.length < 2) {
        return 0;
      }

      return Math.hypot(
        pointers[0].x - pointers[1].x,
        pointers[0].y - pointers[1].y
      );
    };

    const beginPinch = () => {
      pinchStartDistance = getPinchDistance();
      pinchStartCameraZ = camera.position.z;
      isDragging = false;
      velocityX = 0;
      velocityY = 0;
    };

    const beginDrag = (pointer: { x: number; y: number }) => {
      isDragging = true;
      lastPointerX = pointer.x;
      lastPointerY = pointer.y;
      velocityX = 0;
      velocityY = 0;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const render = () => {
      if (!isDragging) {
        globeGroup.rotation.y += velocityX;
        globeGroup.rotation.x = clamp(
          globeGroup.rotation.x + velocityY,
          -1.15,
          1.15
        );
        velocityX *= 0.992;
        velocityY *= 0.992;

        if (Math.abs(velocityX) < 0.0008) {
          velocityX = 0.0008;
        }
      }

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(render);
    };

    const handlePointerDown = (event: PointerEvent) => {
      event.preventDefault();
      activePointers.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });
      renderer.domElement.setPointerCapture(event.pointerId);

      if (activePointers.size >= 2) {
        beginPinch();
        return;
      }

      beginDrag({ x: event.clientX, y: event.clientY });
    };

    const handlePointerMove = (event: PointerEvent) => {
      event.preventDefault();

      if (activePointers.has(event.pointerId)) {
        activePointers.set(event.pointerId, {
          x: event.clientX,
          y: event.clientY,
        });
      }

      if (activePointers.size >= 2) {
        const pinchDistance = getPinchDistance();

        if (pinchStartDistance > 0 && pinchDistance > 0) {
          setCameraDistance(
            pinchStartCameraZ * (pinchStartDistance / pinchDistance)
          );
        }

        return;
      }

      if (!isDragging) {
        return;
      }

      const deltaX = event.clientX - lastPointerX;
      const deltaY = event.clientY - lastPointerY;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;

      velocityX = deltaX * 0.0022;
      velocityY = deltaY * 0.0022;
      globeGroup.rotation.y += velocityX;
      globeGroup.rotation.x = clamp(
        globeGroup.rotation.x + velocityY,
        -1.15,
        1.15
      );
    };

    const handlePointerUp = (event: PointerEvent) => {
      event.preventDefault();
      activePointers.delete(event.pointerId);

      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }

      if (activePointers.size >= 2) {
        beginPinch();
        return;
      }

      if (activePointers.size === 1) {
        const remainingPointer = Array.from(activePointers.values())[0];
        beginDrag(remainingPointer);
        return;
      }

      isDragging = false;
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      setCameraDistance(camera.position.z + event.deltaY * 0.004);
    };

    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("pointerup", handlePointerUp);
    renderer.domElement.addEventListener("pointercancel", handlePointerUp);
    renderer.domElement.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    render();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("pointerup", handlePointerUp);
      renderer.domElement.removeEventListener("pointercancel", handlePointerUp);
      renderer.domElement.removeEventListener("wheel", handleWheel);
      mount.removeChild(renderer.domElement);
      const textureCanvas = texture.image as HTMLCanvasElement | undefined;
      texture.dispose();
      globeGeometry.dispose();
      globeMaterial.dispose();
      pins.forEach((pin) => {
        pin.geometries.forEach((geometry) => geometry.dispose());
        pin.materials.forEach((material) => material.dispose());
      });
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      renderer.dispose();
      renderer.forceContextLoss();

      if (textureCanvas) {
        textureCanvas.width = 1;
        textureCanvas.height = 1;
      }
    };
  }, [darkMode]);

  return (
    <div
      ref={globeRef}
      aria-label="Interactive WebGL globe showing home, visited, wishlist, and United States state divisions."
      data-testid="travel-globe"
      role="img"
      style={{ height: "100%", minHeight: "inherit", width: "100%" }}
    />
  );
}
