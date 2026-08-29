/**
 * AutoCAD DXF (Drawing Exchange Format) Generator
 * Generates standard, zero-dependency ASCII DXF files (AutoCAD R12 / 2000 compliant)
 * Compatible with LibreCAD, AutoCAD, Revit, QCAD, Blender CAD, and SketchUp.
 */

export function generateFloorPlanDXF(layout, schoolName = 'OpenSchool Project', countryName = 'Kenya') {
  const { placedRooms = [], svgWidth = 1000, svgHeight = 800 } = layout || {};

  const safeSchoolName = typeof schoolName === 'object' && schoolName !== null ? (schoolName.name || 'OpenSchool Project') : String(schoolName || 'OpenSchool Project');
  const safeCountryName = typeof countryName === 'object' && countryName !== null ? (countryName.name || 'Kenya') : String(countryName || 'Kenya');

  // Header section
  let dxf = `0
SECTION
2
HEADER
9
$ACADVER
1
AC1009
9
$INSUNITS
70
4
0
ENDSEC
0
SECTION
2
TABLES
0
TABLE
2
LAYER
70
7
0
LAYER
2
WALLS
70
0
62
7
6
CONTINUOUS
0
LAYER
2
DOORS
70
0
62
4
6
CONTINUOUS
0
LAYER
2
WINDOWS
70
0
62
3
6
CONTINUOUS
0
LAYER
2
FURNITURE
70
0
62
5
6
CONTINUOUS
0
LAYER
2
DIMENSIONS
70
0
62
1
6
CONTINUOUS
0
LAYER
2
ANNOTATIONS
70
0
62
2
6
CONTINUOUS
0
LAYER
2
MEP_SERVICES
70
0
62
6
6
CONTINUOUS
0
ENDTAB
0
ENDSEC
0
SECTION
2
ENTITIES
`;

  // Helper to add lines in DXF
  const addLine = (x1, y1, x2, y2, layer = 'WALLS', color = 7) => {
    // Invert Y for standard CAD Cartesian coordinates (CAD Y goes UP, SVG goes DOWN)
    const cadY1 = (svgHeight - y1).toFixed(2);
    const cadY2 = (svgHeight - y2).toFixed(2);
    const cadX1 = x1.toFixed(2);
    const cadX2 = x2.toFixed(2);

    dxf += `0
LINE
8
${layer}
62
${color}
10
${cadX1}
20
${cadY1}
30
0.0
11
${cadX2}
21
${cadY2}
31
0.0
`;
  };

  // Helper to add rect outline
  const addRect = (x, y, w, h, layer = 'WALLS', color = 7) => {
    addLine(x, y, x + w, y, layer, color);
    addLine(x + w, y, x + w, y + h, layer, color);
    addLine(x + w, y + h, x, y + h, layer, color);
    addLine(x, y + h, x, y, layer, color);
  };

  // Helper to add text entity in DXF
  const addText = (x, y, text, height = 12, layer = 'ANNOTATIONS', color = 2) => {
    const cadY = (svgHeight - y).toFixed(2);
    const cadX = x.toFixed(2);
    // Sanitize string for DXF
    const cleanText = String(text || '').replace(/[\r\n]+/g, ' ');

    dxf += `0
TEXT
8
${layer}
62
${color}
10
${cadX}
20
${cadY}
30
0.0
40
${height.toFixed(1)}
1
${cleanText}
`;
  };

  // Outer Drawing Border
  addRect(20, 20, svgWidth - 40, svgHeight - 40, 'DIMENSIONS', 1);

  // Title Block & Institutional Attribution
  addText(40, 45, `${safeSchoolName.toUpperCase()} - ARCHITECTURAL BLUEPRINT`, 18, 'ANNOTATIONS', 2);
  addText(40, 68, `Location: ${safeCountryName} | Scale 1:100 | OpenSchool Blueprint Engine™ (100% Free & Open Platform)`, 10.5, 'ANNOTATIONS', 7);
  addText(40, 85, `Platform Author: @cambridgeacademytutorsfreeknowledgeworld | Contact: cambridgeacademytutorstz@gmail.com`, 9, 'ANNOTATIONS', 3);

  // Render Rooms, Walls, Doors, Windows
  placedRooms.forEach(room => {
    const rx = room.x;
    const ry = room.y;
    const rw = room.width;
    const rh = room.height;

    // Outer double-line walls (simulate wall thickness)
    const wallThick = 4;
    addRect(rx, ry, rw, rh, 'WALLS', 7);
    addRect(rx + wallThick, ry + wallThick, rw - (wallThick * 2), rh - (wallThick * 2), 'WALLS', 7);

    // Doorway opening
    if (room.door) {
      const dx = room.door.x;
      const dy = room.door.y;
      const dw = room.door.width || 14;
      addLine(dx, dy, dx + dw, dy - dw, 'DOORS', 4); // Door leaf
      addLine(dx, dy, dx + dw, dy, 'DOORS', 4); // Threshold
    }

    // Windows (exterior top wall)
    const winWidth = Math.min(rw * 0.5, 60);
    const winX = rx + (rw - winWidth) / 2;
    addLine(winX, ry, winX + winWidth, ry, 'WINDOWS', 3);
    addLine(winX, ry - 2, winX + winWidth, ry - 2, 'WINDOWS', 3);

    // Room Text Annotation
    addText(rx + (rw / 2) - 40, ry + 25, room.name, 11, 'ANNOTATIONS', 2);
    addText(rx + (rw / 2) - 40, ry + 42, `${room.widthM}m x ${room.lengthM}m (${room.areaM2}m2)`, 9, 'DIMENSIONS', 1);
    addText(rx + (rw / 2) - 30, ry + 56, `Capacity: ${room.capacity} Stds`, 8.5, 'ANNOTATIONS', 4);

    // If room has furniture CAD items
    if (room.furniture && Array.isArray(room.furniture)) {
      room.furniture.forEach(item => {
        addRect(rx + item.x, ry + item.y, item.width, item.height, 'FURNITURE', 5);
        if (item.label) {
          addText(rx + item.x + 2, ry + item.y + (item.height / 2), item.label, 6.5, 'FURNITURE', 5);
        }
      });
    }
  });

  // End of DXF file
  dxf += `0
ENDSEC
0
EOF
`;

  return dxf;
}

/**
 * Trigger client-side download of DXF file
 */
export function downloadDXFFile(filename, dxfString) {
  const blob = new Blob([dxfString], { type: 'application/dxf;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.dxf') ? filename : `${filename}.dxf`;
  a.click();
  URL.revokeObjectURL(url);
}
