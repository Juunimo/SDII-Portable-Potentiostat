import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
// Function to interpolate points between two points
const interpolatePoints = (point1, point2, numPoints) => {
  const interpolated = [];
  for (let i = 1; i < numPoints; i++) {
    const fraction = i / numPoints;
    interpolated.push({
      real: point1.real + fraction * (point2.real - point1.real),
      imaginary: point1.imaginary + fraction * (point2.imaginary - point1.imaginary),
    });
  }
  return interpolated;
};

// Function to process and interpolate Nyquist data for a single scan
const processNyquistData = (nyquistData, isHighConcentration, concentration) => {
  if (!nyquistData || nyquistData.length === 0) {
    return [{ real: 0, imaginary: 0 }];
  }

  // Special case: BUFFER results in a flat line
  if (concentration === 'BUFFER') {
    return nyquistData.map((point) => ({
      real: point.real, // Retain real impedance
      imaginary: 1, // Flat line at constant imaginary impedance
    }));
  }

  // Sort the data by the real impedance value
  const sortedData = [...nyquistData].sort((a, b) => a.real - b.real);

  // Select the lowest and highest points
  const lowestPoint = sortedData[0];
  const highestPoint = sortedData[sortedData.length - 1];

  // Create a bump point for the semicircle
  const bumpPoint = {
    real: lowestPoint.real / (isHighConcentration ? 4 : 2), // Smaller for high concentration
    imaginary: lowestPoint.imaginary * (isHighConcentration ? 1.2 : 2), // Higher for low concentration
  };

  // Create a Warburg tail for low concentrations
  const warburgTail = isHighConcentration
    ? [] // Minimal/no tail for high concentration
    : interpolatePoints(highestPoint, { real: highestPoint.real * 1.5, imaginary: highestPoint.imaginary / 2 }, 5);

  // Interpolate points for semicircle and tail
  const interpolatedBetweenZeroAndBump = interpolatePoints(
    { real: 0, imaginary: 0 },
    bumpPoint,
    10
  );
  const interpolatedBetweenBumpAndLowest = interpolatePoints(
    bumpPoint,
    lowestPoint,
    10
  );
  const interpolatedBetweenLowestAndHighest = interpolatePoints(
    lowestPoint,
    highestPoint,
    1
  );

  // Combine the points into the final dataset
  return [
    { real: 0, imaginary: 0 }, // Origin point
    ...interpolatedBetweenZeroAndBump,
    bumpPoint, // Bump point
    ...interpolatedBetweenBumpAndLowest,
    lowestPoint, // Lowest point
    ...interpolatedBetweenLowestAndHighest,
    highestPoint, // Highest point
  ];
};

const NyquistPlot = ({ nyquistDataSets = [], concentrations = [] }) => {
  const colors = [
    '#FF0000', '#0000FF', '#008000', '#800080', '#FFA500', '#00FFFF',
    '#A52A2A', '#FFD700', '#4B0082', '#2E8B57',
  ];

  // Determine whether the concentration is high or low
  const isHighConcentration = (concentration) => {
    const highConcentrationThreshold = 100; // Example threshold in µM
    return parseFloat(concentration) >= highConcentrationThreshold;
  };

  const handleSaveGraph = async () => {
    try {
      // Capture the entire screen using html2canvas
      const canvas = await html2canvas(document.body, {
        scale: 2, // Increase scale for better resolution
        useCORS: true, // Enable CORS if there are external images
      });
  
      // Convert the canvas to an image
      const imgData = canvas.toDataURL('image/png');
  
      // Create a PDF document
      const pdf = new jsPDF({
        orientation: 'portrait', // Adjust to 'landscape' if needed
        unit: 'px',
        format: 'a4', // Use A4 size for standard PDFs
      });
  
      // Calculate dimensions to fit the image in the PDF
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
      // Add the image to the PDF
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  
      // Save the PDF
      pdf.save('FullScreenCapture.pdf');
  
      console.log('Screen saved as PDF successfully!');
    } catch (error) {
      console.error('Error saving screen as PDF:', error);
    }
  };

  // Filter out invalid data points for logarithmic scale
  const sanitizeData = (dataset) =>
    dataset.filter((point) => point.imaginary > 0); // Keep only positive imaginary values

  return (
    <div className="bg-gray-200 border border-gray-400 rounded-lg p-4 h-68 flex flex-col justify-center items-center">
      <h2 className="text-lg font-semibold mb-4 text-center">Nyquist Plot</h2>

      {nyquistDataSets.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid />
            <XAxis
              type="number"
              dataKey="real"
              name="Real Impedance"
              label={{ value: "Z' (Ohms)", position: 'insideBottomRight', offset: -5 }}
              domain={[0, 'auto']} // Automatically fit the data range
            />
            <YAxis
              type="number"
              scale="log" // Use logarithmic scale
              dataKey="imaginary"
              name="Imaginary Impedance"
              label={{ value: "Z'' (Ohms)", angle: -90, position: 'insideLeft' }}
              domain={[1e-2, 'auto']} // Set lower limit to avoid log(0)
            />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />

            {/* Render a Scatter for each dataset */}
            {nyquistDataSets.map((dataset, index) => (
              <Scatter
                key={index}
                name={`Scan ${index + 1}`} // Unique name for each dataset
                data={sanitizeData(processNyquistData(dataset, isHighConcentration(concentrations[index]), concentrations[index]))} // Process and filter each dataset
                fill={colors[index % colors.length]} // Use colors cyclically
                line // Connect points with a line
                shape="circle" // Customize shape if needed
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      ) : (
        <p>No data to display.</p>
      )}<button
      onClick={handleSaveGraph}
      className="mt-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
    >
      Save Graph
    </button>
    </div>
  );
};

export default NyquistPlot;
