import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { 
  DetailLevel, 
  CameraType, 
  SubassemblyId, 
  ViewMode, 
  FlipMirrorState, 
  CameraPreset, 
  ComponentItem 
} from '../types/telescope';
import { TelescopeParameters, DerivedOpticalSpecs, calculateDerivedSpecs } from '../types/specs';
import { TELESCOPE_COMPONENTS } from '../data/componentsData';

interface TelescopeContextType {
  // Configuration combinations (9 total)
  detailLevel: DetailLevel;
  setDetailLevel: (level: DetailLevel) => void;
  cameraType: CameraType;
  setCameraType: (camera: CameraType) => void;
  
  // Dynamic mechanisms
  steeringTilt: number;
  setSteeringTilt: (tilt: number) => void;
  resetSteeringTilt: () => void;
  convexLensPosition: number; // -0.4 to +0.4 units along optical tube
  setConvexLensPosition: (pos: number) => void;
  resetConvexLensPosition: () => void;
  flipMirrorPosition: FlipMirrorState;
  setFlipMirrorPosition: (pos: FlipMirrorState) => void;
  toggleFlipMirror: () => void;
  explodedProgress: number;
  setExplodedProgress: (p: number) => void;
  resetExploded: () => void;
  
  // Views and ray tracing
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  showRays: boolean;
  setShowRays: (show: boolean) => void;
  toggleRays: () => void;
  raySpeed: number;
  setRaySpeed: (speed: number) => void;
  isRayPlaying: boolean;
  setIsRayPlaying: (playing: boolean) => void;
  
  // Subassembly and component selection
  activeSubassembly: SubassemblyId;
  setActiveSubassembly: (sub: SubassemblyId) => void;
  selectedComponentId: string | null;
  setSelectedComponentId: (id: string | null) => void;
  selectedComponent: ComponentItem | null;
  hoveredComponentId: string | null;
  setHoveredComponentId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  
  // Visibility control
  hiddenComponentIds: Set<string>;
  toggleComponentVisibility: (id: string) => void;
  isComponentVisible: (id: string) => boolean;
  resetAllVisibility: () => void;
  
  // Annotations & camera presets
  showDimensions: boolean;
  setShowDimensions: (show: boolean) => void;
  showLabels: boolean;
  setShowLabels: (show: boolean) => void;
  showCenterlines: boolean;
  setShowCenterlines: (show: boolean) => void;
  showWireframeOverlay: boolean;
  setShowWireframeOverlay: (show: boolean) => void;
  currentPreset: CameraPreset;
  setCurrentPreset: (preset: CameraPreset) => void;
  
  // Configurable technical parameters
  parameters: TelescopeParameters;
  updateParameter: <K extends keyof TelescopeParameters>(key: K, value: TelescopeParameters[K]) => void;
  derivedSpecs: DerivedOpticalSpecs;
  resetParametersToDefault: () => void;
}

const defaultParameters: TelescopeParameters = {
  aperture: 90, // mm (range 80-100)
  focalLength: 720, // mm (range 600-800)
  tubeLength: 580, // mm
  objectiveAirGap: 2.4, // mm (provisional)
  wavelength: 656.28, // nm (H-alpha)
  steeringLensTilt: 0.0, // deg (-5 to +5)
  sensorWidth: 23.5, // mm (APS-C)
  sensorHeight: 15.6, // mm
  pixelSize: 3.76, // microns
  focalPlaneOffset: 17.5, // mm (standard backfocus)
  gratingGrooveDensity: 1800, // lines/mm
  gratingAngle: 36.2, // degrees
};

const TelescopeContext = createContext<TelescopeContextType | null>(null);

export const TelescopeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Master 9 configuration combinations
  const [detailLevel, setDetailLevel] = useState<DetailLevel>('photorealistic');
  const [cameraType, setCameraType] = useState<CameraType>('scientific-cmos');
  
  // Mechanical states
  const [steeringTilt, setSteeringTiltState] = useState<number>(0.0);
  const [convexLensPosition, setConvexLensPositionState] = useState<number>(0.0);
  const [flipMirrorPosition, setFlipMirrorPosition] = useState<FlipMirrorState>('imaging');
  const [explodedProgress, setExplodedProgress] = useState<number>(0.0);
  
  // Visualization
  const [viewMode, setViewMode] = useState<ViewMode>('solid');
  const [showRays, setShowRays] = useState<boolean>(true);
  const [raySpeed, setRaySpeed] = useState<number>(1.0);
  const [isRayPlaying, setIsRayPlaying] = useState<boolean>(true);
  
  // Hierarchy & selection
  const [activeSubassembly, setActiveSubassembly] = useState<SubassemblyId>('all');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hiddenComponentIds, setHiddenComponentIds] = useState<Set<string>>(new Set());
  
  // Annotations
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showCenterlines, setShowCenterlines] = useState<boolean>(false);
  const [showWireframeOverlay, setShowWireframeOverlay] = useState<boolean>(false);
  const [currentPreset, setCurrentPreset] = useState<CameraPreset>('isometric');
  
  // Technical parameters
  const [parameters, setParameters] = useState<TelescopeParameters>(defaultParameters);

  // Sync steeringTilt with parameters
  const setSteeringTilt = useCallback((tilt: number) => {
    const clamped = Math.max(-5.0, Math.min(5.0, Number(tilt.toFixed(2))));
    setSteeringTiltState(clamped);
    setParameters(prev => ({ ...prev, steeringLensTilt: clamped }));
  }, []);

  const resetSteeringTilt = useCallback(() => {
    setSteeringTilt(0.0);
  }, [setSteeringTilt]);

  const setConvexLensPosition = useCallback((pos: number) => {
    const clamped = Math.max(-0.4, Math.min(0.4, Number(pos.toFixed(3))));
    setConvexLensPositionState(clamped);
  }, []);

  const resetConvexLensPosition = useCallback(() => {
    setConvexLensPositionState(0.0);
  }, []);

  const toggleFlipMirror = useCallback(() => {
    setFlipMirrorPosition(prev => prev === 'imaging' ? 'spectroscopy' : 'imaging');
  }, []);

  const resetExploded = useCallback(() => {
    setExplodedProgress(0.0);
  }, []);

  const toggleRays = useCallback(() => {
    setShowRays(prev => !prev);
  }, []);

  const toggleComponentVisibility = useCallback((id: string) => {
    setHiddenComponentIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const isComponentVisible = useCallback((id: string) => {
    return !hiddenComponentIds.has(id);
  }, [hiddenComponentIds]);

  const resetAllVisibility = useCallback(() => {
    setHiddenComponentIds(new Set());
  }, []);

  const updateParameter = useCallback(<K extends keyof TelescopeParameters>(key: K, value: TelescopeParameters[K]) => {
    setParameters(prev => {
      const updated = { ...prev, [key]: value };
      if (key === 'steeringLensTilt') {
        setSteeringTiltState(value as number);
      }
      return updated;
    });
  }, []);

  const resetParametersToDefault = useCallback(() => {
    setParameters(defaultParameters);
    setSteeringTiltState(0.0);
  }, []);

  const selectedComponent = useMemo(() => {
    if (!selectedComponentId) return null;
    return TELESCOPE_COMPONENTS.find(c => c.id === selectedComponentId) || null;
  }, [selectedComponentId]);

  const derivedSpecs = useMemo(() => {
    return calculateDerivedSpecs(parameters);
  }, [parameters]);

  const value = {
    detailLevel,
    setDetailLevel,
    cameraType,
    setCameraType,
    steeringTilt,
    setSteeringTilt,
    resetSteeringTilt,
    convexLensPosition,
    setConvexLensPosition,
    resetConvexLensPosition,
    flipMirrorPosition,
    setFlipMirrorPosition,
    toggleFlipMirror,
    explodedProgress,
    setExplodedProgress,
    resetExploded,
    viewMode,
    setViewMode,
    showRays,
    setShowRays,
    toggleRays,
    raySpeed,
    setRaySpeed,
    isRayPlaying,
    setIsRayPlaying,
    activeSubassembly,
    setActiveSubassembly,
    selectedComponentId,
    setSelectedComponentId,
    selectedComponent,
    hoveredComponentId,
    setHoveredComponentId,
    searchQuery,
    setSearchQuery,
    hiddenComponentIds,
    toggleComponentVisibility,
    isComponentVisible,
    resetAllVisibility,
    showDimensions,
    setShowDimensions,
    showLabels,
    setShowLabels,
    showCenterlines,
    setShowCenterlines,
    showWireframeOverlay,
    setShowWireframeOverlay,
    currentPreset,
    setCurrentPreset,
    parameters,
    updateParameter,
    derivedSpecs,
    resetParametersToDefault,
  };

  return (
    <TelescopeContext.Provider value={value}>
      {children}
    </TelescopeContext.Provider>
  );
};

export const useTelescope = (): TelescopeContextType => {
  const context = useContext(TelescopeContext);
  if (!context) {
    throw new Error('useTelescope must be used within a TelescopeProvider');
  }
  return context;
};
