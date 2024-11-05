// Simulate DPV data based on concentration, scan rate, pulse amplitude, and additional parameters
export const simulateDPVData = (concentration, scanRate, pulseAmplitude, pulseHeight, stepHeight, pulseWidth, cycles, electrodeArea, numberOfElectrons, temperature) => {
    const peakVoltage = 0.35; // Voltage at which peak current occurs
    const diffusionCoefficient = 1e-6; // Hardcoded diffusion coefficient (cm²/s)
    const F = 96485; // Faraday constant in C/mol
    const R = 8.314; // Gas constant in J/(mol*K)
    
    // Calculate the peak current using the DPV equation
    const peakCurrent = 0.4463 * numberOfElectrons * F * electrodeArea * concentration * Math.sqrt((numberOfElectrons * F * diffusionCoefficient * scanRate) / (R * temperature));

    const width = 0.05; // Controls the width of the peak

    const data = {
      low: [
        { voltage: 0.1, current: peakCurrent * Math.exp(-((0.1 - peakVoltage) ** 2) / (2 * width ** 2)) },
        { voltage: 0.2, current: peakCurrent * Math.exp(-((0.2 - peakVoltage) ** 2) / (2 * width ** 2)) },
        { voltage: 0.3, current: peakCurrent * Math.exp(-((0.3 - peakVoltage) ** 2) / (2 * width ** 2)) },
        { voltage: 0.4, current: peakCurrent * Math.exp(-((0.4 - peakVoltage) ** 2) / (2 * width ** 2)) },
        { voltage: 0.5, current: peakCurrent * Math.exp(-((0.5 - peakVoltage) ** 2) / (2 * width ** 2)) },
      ],
      medium: [
        { voltage: 0.1, current: peakCurrent * 1.2 * Math.exp(-((0.1 - peakVoltage) ** 2) / (2 * width ** 2)) },
        { voltage: 0.2, current: peakCurrent * 1.2 * Math.exp(-((0.2 - peakVoltage) ** 2) / (2 * width ** 2)) },
        { voltage: 0.3, current: peakCurrent * 1.2 * Math.exp(-((0.3 - peakVoltage) ** 2) / (2 * width ** 2)) },
        { voltage: 0.4, current: peakCurrent * 1.2 * Math.exp(-((0.4 - peakVoltage) ** 2) / (2 * width ** 2)) },
        { voltage: 0.5, current: peakCurrent * 1.2 * Math.exp(-((0.5 - peakVoltage) ** 2) / (2 * width ** 2)) },
      ],
      high: [
        { voltage: 0.1, current: peakCurrent * 1.5 * Math.exp(-((0.1 - peakVoltage) ** 2) / (2 * width ** 2)) },
        { voltage: 0.2, current: peakCurrent * 1.5 * Math.exp(-((0.2 - peakVoltage) ** 2) / (2 * width ** 2)) },
        { voltage: 0.3, current: peakCurrent * 1.5 * Math.exp(-((0.3 - peakVoltage) ** 2) / (2 * width ** 2)) },
        { voltage: 0.4, current: peakCurrent * 1.5 * Math.exp(-((0.4 - peakVoltage) ** 2) / (2 * width ** 2)) },
        { voltage: 0.5, current: peakCurrent * 1.5 * Math.exp(-((0.5 - peakVoltage) ** 2) / (2 * width ** 2)) },
      ],
    };

    return data[concentration];
};

  
  
  // Simulate EIS data based on concentration, frequency range, amplitude, and additional parameters
  export const simulateEISData = (concentration, frequencyRange, amplitude, R_s, R_ct, C_dl, Z_w) => {
    // Ensure default values if parameters are missing
    const safeR_s = isNaN(R_s) ? 1 : R_s;
    const safeR_ct = isNaN(R_ct) ? 1 : R_ct;
    const safeC_dl = isNaN(C_dl) ? 1 : C_dl;
    const safeZ_w = isNaN(Z_w) ? 1 : Z_w;
  
    const data = {
      low: [
        { frequency: 1 * frequencyRange, impedance: safeR_s + amplitude * 10 + safeZ_w * 0.1 },
        { frequency: 10 * frequencyRange, impedance: safeR_ct + amplitude * 8 + safeZ_w * 0.1 },
        { frequency: 100 * frequencyRange, impedance: safeC_dl + amplitude * 6 },
        { frequency: 1000 * frequencyRange, impedance: safeR_s + safeC_dl * 0.05 },
        { frequency: 10000 * frequencyRange, impedance: safeZ_w + safeR_ct * 0.1 },
      ],

      medium: [
        { frequency: 1 * frequencyRange, impedance: R_s + amplitude * 12 + Z_w * 0.12 },
        { frequency: 10 * frequencyRange, impedance: R_ct + amplitude * 10 + Z_w * 0.12 },
        { frequency: 100 * frequencyRange, impedance: C_dl + amplitude * 8 },
        { frequency: 1000 * frequencyRange, impedance: R_s + C_dl * 0.06 },
        { frequency: 10000 * frequencyRange, impedance: Z_w + R_ct * 0.12 },
      ],
      high: [
        { frequency: 1 * frequencyRange, impedance: R_s + amplitude * 14 + Z_w * 0.14 },
        { frequency: 10 * frequencyRange, impedance: R_ct + amplitude * 12 + Z_w * 0.14 },
        { frequency: 100 * frequencyRange, impedance: C_dl + amplitude * 10 },
        { frequency: 1000 * frequencyRange, impedance: R_s + C_dl * 0.07 },
        { frequency: 10000 * frequencyRange, impedance: Z_w + R_ct * 0.14 },
      ],
    };
    return data[concentration];
  };
  