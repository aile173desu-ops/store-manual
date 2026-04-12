const fs = require('fs');

// Read the manual HTML
const manual = fs.readFileSync('C:/Users/173de/OneDrive/Documents/小顔矯正マニュアル/index.html', 'utf-8');

// Extract style and body
const styleMatch = manual.match(/<style>([\s\S]*?)<\/style>/);
const bodyMatch = manual.match(/<body>([\s\S]*?)<\/body>/);
const css = styleMatch ? styleMatch[1] : '';
const body = bodyMatch ? bodyMatch[1].trim() : '';

// Build page content with scoped styles
let scopedCss = css
  .replace(/\*\s*\{[^}]+\}/, '')
  .replace(/body\b/g, '.km')
  .replace(/:root/g, '.km');

const pageContent = '<style>.km{all:initial;display:block;}' + scopedCss + '</style><div class="km">' + body + '</div>';

// Escape for JS template literal
const escaped = pageContent
  .split('\\').join('\\\\')
  .split('`').join('\\`')
  .split('${').join('\\${');

// Read the store manual
let storeManual = fs.readFileSync('C:/Users/173de/store-manual/index.html', 'utf-8');

// Remove any previous seed block
storeManual = storeManual.replace(/\n\/\/ === 教育ツール自動セット ===[\s\S]*?}\)\(\);/g, '');

// Build the seed script
const seedScript = `
// === 教育ツール自動セット ===
(function seedKogaoManual() {
  const DEPT_ID = 'biyou';
  const PAGE_TITLE = '教育ツール';
  const PAGE_CONTENT = \`${escaped}\`;

  let page = data.pages.find(p => p.deptId === DEPT_ID && p.title === PAGE_TITLE);
  if (page) {
    page.content = PAGE_CONTENT;
    page.updatedAt = new Date().toISOString();
  } else {
    page = {
      id: generateId(),
      deptId: DEPT_ID,
      title: PAGE_TITLE,
      content: PAGE_CONTENT,
      order: data.pages.filter(p => p.deptId === DEPT_ID).length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.pages.push(page);
  }
  saveData();
  showWelcome();
})();
`;

// Insert after the init showWelcome() call
storeManual = storeManual.replace(
  '// Init\nshowWelcome();',
  '// Init\nshowWelcome();' + seedScript
);

fs.writeFileSync('C:/Users/173de/store-manual/index.html', storeManual, 'utf-8');
console.log('Done! Store manual updated successfully.');
