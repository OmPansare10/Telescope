export interface TelescopeParameters {
  aperture: number; // mm (80-100)
  focalLength: number; // mm (600-800)
  tubeLength: number; // mm
  objectiveAirGap: number; // mm (provisional)
  wavelength: number; // nm (default 656.28 nm - H-alpha)
  steeringLensTilt: number; // degrees
  sensorWidth: number; // mm
  sensorHeight: number; // mm
  pixelSize: number; // microns
  focalPlaneOffset: number; // mm
  gratingGrooveDensity: number; // lines/mm
  gratingAngle: number; // degrees
}

export interface DerivedOpticalSpecs {
  focalRatio: number; // f/number = f / D
  dawesLimitArcsec: number; // 116 / D(mm)
  rayleighCriterionArcsec: number; // 138 / D(mm) for 550nm or 1.22 * λ / D * 206265
  airyDiskDiameterMicrons: number; // 2.44 * λ * f_ratio
  solarDiskDiameterMm: number; // f * tan(32 arcmin) ~ f * 0.00931
  imageScaleArcsecPerMm: number; // 206.265 / f(m)
  pixelScaleArcsecPerPixel: number; // 206.265 * pixel_size(um) / f(mm)
  nyquistCriterion: string; // whether sampling is well-sampled, under-sampled, or over-sampled
  dispersionAngstromPerPixel: number; // spectral dispersion approx
}

export function calculateDerivedSpecs(params: TelescopeParameters): DerivedOpticalSpecs {
  const fRatio = params.focalLength / params.aperture;
  const dawes = 116 / params.aperture;
  const lambdaMm = params.wavelength * 1e-6; // nm to mm
  const rayleighArcsec = (1.22 * lambdaMm / params.aperture) * 206265;
  const airyDiskMicrons = 2.44 * (params.wavelength * 1e-3) * fRatio; // um
  const solarDiskMm = params.focalLength * Math.tan((32 / 60) * (Math.PI / 180));
  const imageScale = 206.265 / (params.focalLength / 1000);
  const pixelScale = (206.265 * params.pixelSize) / params.focalLength;
  
  // Nyquist: Airy disk diameter should cover ~2 to 3.5 pixels for solar diffraction-limited imaging
  const pixelsPerAiry = airyDiskMicrons / params.pixelSize;
  let nyquistDesc = "Optimal Nyquist sampling (2.5 - 3.5 px/Airy disc)";
  if (pixelsPerAiry < 2.0) {
    nyquistDesc = `Undersampled (${pixelsPerAiry.toFixed(1)} px/Airy disc) - consider Barlow lens`;
  } else if (pixelsPerAiry > 4.5) {
    nyquistDesc = `Oversampled (${pixelsPerAiry.toFixed(1)} px/Airy disc) - potential diffraction smearing`;
  }

  // Grating dispersion in Littrow approx: dλ/dx = d*cos(θ) / (f_collimator * m)
  const dMm = 1.0 / params.gratingGrooveDensity; // mm per line
  const gratingRad = (params.gratingAngle * Math.PI) / 180;
  // Collimator focal length ~ 150mm
  const fColl = 150;
  const dispersionNmPerMm = (dMm * Math.cos(gratingRad) / fColl) * 1e6; // nm/mm
  const dispersionAperPx = (dispersionNmPerMm * (params.pixelSize * 1e-3)) * 10; // Angstroms/pixel

  return {
    focalRatio: Number(fRatio.toFixed(2)),
    dawesLimitArcsec: Number(dawes.toFixed(2)),
    rayleighCriterionArcsec: Number(rayleighArcsec.toFixed(2)),
    airyDiskDiameterMicrons: Number(airyDiskMicrons.toFixed(2)),
    solarDiskDiameterMm: Number(solarDiskMm.toFixed(2)),
    imageScaleArcsecPerMm: Number(imageScale.toFixed(2)),
    pixelScaleArcsecPerPixel: Number(pixelScale.toFixed(2)),
    nyquistCriterion: nyquistDesc,
    dispersionAngstromPerPixel: Number(dispersionAperPx.toFixed(3)),
  };
}
