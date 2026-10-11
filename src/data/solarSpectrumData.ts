export interface SpectralLine {
  id: string;
  element: string;
  ion: string;
  wavelengthNm: number;
  wavelengthAngstrom: number;
  relativeStrength: number; // 0 to 1
  colorHex: string;
  scientificSignificance: string;
}

export const SOLAR_FRAUNHOFER_LINES: SpectralLine[] = [
  {
    id: 'ca-k',
    element: 'Calcium',
    ion: 'Ca II (K line)',
    wavelengthNm: 393.37,
    wavelengthAngstrom: 3933.7,
    relativeStrength: 0.95,
    colorHex: '#6b21a8',
    scientificSignificance: 'Deep violet line tracing solar magnetic supergranulation network and plage regions in the low chromosphere.'
  },
  {
    id: 'ca-h',
    element: 'Calcium',
    ion: 'Ca II (H line)',
    wavelengthNm: 396.85,
    wavelengthAngstrom: 3968.5,
    relativeStrength: 0.90,
    colorHex: '#7c3aed',
    scientificSignificance: 'Chromospheric magnetic active regions; closely coupled with Ca II K line.'
  },
  {
    id: 'h-gamma',
    element: 'Hydrogen',
    ion: 'H-γ (Balmer series)',
    wavelengthNm: 434.05,
    wavelengthAngstrom: 4340.5,
    relativeStrength: 0.55,
    colorHex: '#3b82f6',
    scientificSignificance: 'Balmer series diagnostic for electron temperature and plasma density in flares.'
  },
  {
    id: 'h-beta',
    element: 'Hydrogen',
    ion: 'H-β (Balmer series)',
    wavelengthNm: 486.13,
    wavelengthAngstrom: 4861.3,
    relativeStrength: 0.75,
    colorHex: '#06b6d4',
    scientificSignificance: 'Cyan Balmer line; complementary to H-alpha for temperature gradient profiling.'
  },
  {
    id: 'mg-b1',
    element: 'Magnesium',
    ion: 'Mg I (b triplet)',
    wavelengthNm: 518.36,
    wavelengthAngstrom: 5183.6,
    relativeStrength: 0.82,
    colorHex: '#10b981',
    scientificSignificance: 'Photospheric and low chromosphere temperature minimum boundary marker.'
  },
  {
    id: 'fe-i',
    element: 'Iron',
    ion: 'Fe I (E line)',
    wavelengthNm: 527.04,
    wavelengthAngstrom: 5270.4,
    relativeStrength: 0.65,
    colorHex: '#22c55e',
    scientificSignificance: 'High magnetic sensitivity; ideal for photospheric Zeeman magnetic field mapping.'
  },
  {
    id: 'he-d3',
    element: 'Helium',
    ion: 'He I (D3 line)',
    wavelengthNm: 587.56,
    wavelengthAngstrom: 5875.6,
    relativeStrength: 0.40,
    colorHex: '#eab308',
    scientificSignificance: 'Historic helium discovery line in solar prominences during the 1868 eclipse.'
  },
  {
    id: 'na-d2',
    element: 'Sodium',
    ion: 'Na I (D2 line)',
    wavelengthNm: 588.99,
    wavelengthAngstrom: 5889.9,
    relativeStrength: 0.88,
    colorHex: '#f59e0b',
    scientificSignificance: 'Strong neutral sodium resonance absorption in the solar photosphere.'
  },
  {
    id: 'na-d1',
    element: 'Sodium',
    ion: 'Na I (D1 line)',
    wavelengthNm: 589.59,
    wavelengthAngstrom: 5895.9,
    relativeStrength: 0.80,
    colorHex: '#f59e0b',
    scientificSignificance: 'Pair with Na D2 doublet; used for helioseismology and Doppler velocity oscillations.'
  },
  {
    id: 'h-alpha',
    element: 'Hydrogen',
    ion: 'H-α (Balmer series - Target Line)',
    wavelengthNm: 656.28,
    wavelengthAngstrom: 6562.8,
    relativeStrength: 0.98,
    colorHex: '#ef4444',
    scientificSignificance: 'The premier solar chromosphere line! Visualizes solar flares, active filaments, spicules, sunspot magnetic fields, and prominences against the solar limb.'
  },
  {
    id: 'k-i',
    element: 'Potassium',
    ion: 'K I line',
    wavelengthNm: 769.90,
    wavelengthAngstrom: 7699.0,
    relativeStrength: 0.50,
    colorHex: '#991b1b',
    scientificSignificance: 'Near-infrared solar line sensitive to global acoustic p-mode oscillations.'
  }
];

export function generateSpectrumCurve(
  centerNm: number = 656.28, 
  spanNm: number = 20, 
  points: number = 200,
  dopplerShiftKmS: number = 0
): { wavelengthNm: number; intensity: number; lineLabel?: string }[] {
  // Doppler shift: Δλ = λ0 * (v / c)
  const cKmS = 299792.458;
  const deltaWavelength = centerNm * (dopplerShiftKmS / cKmS);
  const startNm = centerNm - spanNm / 2;
  const step = spanNm / points;
  
  const results = [];
  for (let i = 0; i <= points; i++) {
    const wl = startNm + i * step;
    // Base continuum intensity with Planck-like curve approximation
    let intensity = 0.95 + 0.05 * Math.sin(i / 10);
    
    // Check for absorption dips from known Fraunhofer lines
    let matchedLine: string | undefined = undefined;
    for (const line of SOLAR_FRAUNHOFER_LINES) {
      const shiftedLineWl = line.wavelengthNm + deltaWavelength;
      const dist = Math.abs(wl - shiftedLineWl);
      // Gaussian absorption profile
      const lineFwhm = 0.15; // nm
      if (dist < lineFwhm * 4) {
        const dip = line.relativeStrength * 0.75 * Math.exp(-Math.pow(dist / (lineFwhm / 2.355), 2));
        intensity -= dip;
        if (dist < 0.1) {
          matchedLine = `${line.element} ${line.ion} (${line.wavelengthNm} nm)`;
        }
      }
    }
    
    intensity = Math.max(0.08, Math.min(1.0, intensity));
    results.push({
      wavelengthNm: Number(wl.toFixed(3)),
      intensity: Number(intensity.toFixed(3)),
      lineLabel: matchedLine
    });
  }
  return results;
}
