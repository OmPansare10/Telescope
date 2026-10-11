export type DetailLevel = 'engineering' | 'photorealistic' | 'cad';

export type CameraType = 'scientific-cmos' | 'dslr' | 'both';

export type SubassemblyId = 
  | 'all'
  | 'objective'
  | 'optical-tube'
  | 'steering'
  | 'flip-mirror'
  | 'camera'
  | 'spectroscopy'
  | 'mount';

export type ViewMode = 'solid' | 'transparent' | 'cutaway';

export type FlipMirrorState = 'imaging' | 'spectroscopy';

export type CameraPreset = 'front' | 'side' | 'top' | 'rear' | 'isometric';

export interface ComponentItem {
  id: string;
  name: string;
  subassembly: SubassemblyId;
  category: string;
  material: string;
  weightGrams?: number;
  dimensionsMm: string;
  isProvisional: boolean;
  opticalRole?: string;
  description: string;
  mechanicalInterface?: string;
  explodeDirection: [number, number, number]; // vector multiplier
  explodeDistance: number; // mm in model scale
}

export interface TelescopeState {
  // Master 9 configuration combinations
  detailLevel: DetailLevel;
  cameraType: CameraType;
  
  // Interactive mechanical settings
  steeringTilt: number; // degrees, -5.0 to +5.0
  flipMirrorPosition: FlipMirrorState;
  explodedProgress: number; // 0.0 to 1.0
  
  // Visualization controls
  viewMode: ViewMode;
  showRays: boolean;
  raySpeed: number; // 0.5 to 3.0
  isRayPlaying: boolean;
  
  // Inspection and filtering
  activeSubassembly: SubassemblyId;
  selectedComponentId: string | null;
  hoveredComponentId: string | null;
  searchQuery: string;
  hiddenComponentIds: Set<string>;
  
  // CAD / Drawing annotations
  showDimensions: boolean;
  showLabels: boolean;
  showCenterlines: boolean;
  showWireframeOverlay: boolean;
  
  // Camera view preset
  currentPreset: CameraPreset;
}
