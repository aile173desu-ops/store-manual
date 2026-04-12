const fs = require('fs');

let html = fs.readFileSync('C:/Users/173de/OneDrive/Documents/小顔矯正マニュアル/index.html', 'utf-8');

// Add image style if not present
if (!html.includes('.tool-img')) {
  html = html.replace('</style>', `
    .tool-img {
      width: 100%;
      border-radius: 6px;
      border: 1px solid var(--border);
      margin-top: 10px;
    }
  </style>`);
}

// Mapping: page-tag label -> PDF page number (image file)
// PDF pages correspond directly to P numbers
const mappings = [
  { tag: 'P1', img: 'p1.png' },
  { tag: 'P2', img: 'p2.png' },
  { tag: 'P3', img: 'p3.png' },
  { tag: 'P4', img: 'p4.png' },
  { tag: 'P5', img: 'p5.png' },
  { tag: 'P6', img: 'p6.png' },
  { tag: 'P7', img: 'p7.png' },
  { tag: 'P8', img: 'p8.png' },
  { tag: 'P9', img: 'p9.png' },
  { tag: 'P10', img: 'p10.png' },
  { tag: 'P11', img: 'p11.png' },
  { tag: 'P12', img: 'p12.png' },
  { tag: 'P13', img: 'p13.png' },
  { tag: 'P14', img: 'p14.png' },
  { tag: 'P15', img: 'p15.png' },
  { tag: 'P16', img: 'p16.png' },
  { tag: 'P17', img: 'p17.png' },
  { tag: 'P19', img: 'p19.png' },
  { tag: 'P20', img: 'p20.png' },
  { tag: 'P21', img: 'p21.png' },
  { tag: 'P22', img: 'p22.png' },
  { tag: 'P24', img: 'p24.png' },
];

for (const m of mappings) {
  const imgTag = `<img src="images/${m.img}" alt="${m.tag} ツール画面" class="tool-img">`;

  // Find the page-tag span and insert image after the closing </h3> in the same col-tool
  // Pattern: <span class="page-tag">P1</span> ... </h3> (possibly with content between)
  // We need to insert the image right before </div> that closes col-tool

  // Strategy: find the page-tag, then find the next </div> that closes col-tool
  const tagPattern = `<span class="page-tag">${m.tag}</span>`;
  const tagIndex = html.indexOf(tagPattern);

  if (tagIndex === -1) {
    console.log(`Tag ${m.tag} not found, skipping`);
    continue;
  }

  // Check if image already inserted for this tag
  const checkArea = html.substring(tagIndex, tagIndex + 500);
  if (checkArea.includes(m.img)) {
    console.log(`Image for ${m.tag} already exists, skipping`);
    continue;
  }

  // Find the closing </div> of col-tool (first </div> after the </h3> or </table>)
  // Look for </div> that closes the col-tool div
  let searchFrom = tagIndex;

  // Find the end of the h3 or table that follows the page-tag
  let endOfContent = html.indexOf('</h3>', searchFrom);
  if (endOfContent === -1) continue;
  endOfContent += 5; // past </h3>

  // Check if there's a table or paragraph before the closing </div>
  const nextDiv = html.indexOf('</div>', endOfContent);
  const nextTable = html.indexOf('</table>', endOfContent);
  const nextP = html.indexOf('</p>', endOfContent);

  // Find what comes first after h3 - could be table, p, or directly </div>
  let insertPoint = endOfContent;

  // Check if there's a table between h3 end and the next </div>
  if (nextTable !== -1 && nextTable < nextDiv) {
    insertPoint = nextTable + 8; // after </table>
  } else if (nextP !== -1 && nextP < nextDiv) {
    insertPoint = nextP + 4; // after </p>
  }

  // Insert image
  html = html.substring(0, insertPoint) + '\n    ' + imgTag + html.substring(insertPoint);
  console.log(`Inserted image for ${m.tag}`);
}

fs.writeFileSync('C:/Users/173de/OneDrive/Documents/小顔矯正マニュアル/index.html', html, 'utf-8');
console.log('\nDone! Images inserted into manual HTML.');
