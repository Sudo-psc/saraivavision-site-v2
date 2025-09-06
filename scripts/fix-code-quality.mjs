#!/usr/bin/env node

/**
 * @fileoverview Automated code quality fixes
 * Fixes common ESLint issues across the codebase
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all JS/JSX files recursively
function getAllFiles(dir, extension = '.jsx') {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      results = results.concat(getAllFiles(filePath, extension));
    } else if (file.endsWith(extension) || file.endsWith('.js')) {
      results.push(filePath);
    }
  });
  
  return results;
}

// Fix unused React imports
function fixUnusedReactImports(content) {
  // Check if React is used in JSX
  const hasJSX = /<[A-Z]/.test(content) || /<\/[a-z]/.test(content);
  
  if (!hasJSX) {
    // Remove React import if no JSX is used
    content = content.replace(/^import React(?:,\s*\{[^}]*\})?\s+from\s+['"]react['"];\s*\n?/m, '');
    content = content.replace(/^import\s+React\s*,?\s*(?:\{[^}]*\})?\s+from\s+['"]react['"];\s*\n?/m, (match, p1) => {
      // If there are other imports, keep them
      const namedImports = match.match(/\{([^}]*)\}/);
      if (namedImports) {
        return `import { ${namedImports[1]} } from 'react';\n`;
      }
      return '';
    });
  } else {
    // Replace React import with only what's needed
    content = content.replace(/^import React,\s*(\{[^}]*\})\s+from\s+['"]react['"];/m, 'import $1 from \'react\';');
  }
  
  return content;
}

// Fix unused imports
function fixUnusedImports(content) {
  const lines = content.split('\n');
  const usedImports = new Set();
  
  // Find all used identifiers
  const identifierRegex = /\b([A-Z][a-zA-Z0-9]*)\b/g;
  content.replace(identifierRegex, (match, identifier) => {
    usedImports.add(identifier);
  });
  
  // Remove unused imports
  return lines.map(line => {
    if (line.startsWith('import ') && !line.includes('from \'react\'')) {
      const importMatch = line.match(/import\s+\{([^}]*)\}\s+from/);
      if (importMatch) {
        const imports = importMatch[1].split(',').map(imp => imp.trim());
        const usedInLine = imports.filter(imp => usedImports.has(imp));
        
        if (usedInLine.length === 0) {
          return ''; // Remove entire line
        } else if (usedInLine.length < imports.length) {
          return line.replace(importMatch[1], usedInLine.join(', '));
        }
      }
    }
    return line;
  }).filter(line => line !== '').join('\n');
}

// Add missing curly braces
function addMissingCurlyBraces(content) {
  // Fix if statements
  content = content.replace(/\bif\s*\([^)]+\)\s*([^{].*?)(?=\n|\r|$)/g, (match, p1) => {
    if (!p1.trim().startsWith('{')) {
      return match.replace(p1, `{\n    ${p1.trim()}\n  }`);
    }
    return match;
  });
  
  return content;
}

// Remove console.log statements (but keep console.error, console.warn)
function removeConsoleLogs(content) {
  return content.replace(/^\s*console\.log\([^)]*\);\s*\n?/gm, '');
}

// Add missing prop-types (basic implementation)
function addMissingPropTypes(content) {
  // This is a basic implementation - in a real scenario, you'd want more sophisticated analysis
  const componentMatch = content.match(/const\s+(\w+)\s*=\s*\(\s*\{([^}]*)\}\s*\)/);
  
  if (componentMatch) {
    const componentName = componentMatch[1];
    const props = componentMatch[2].split(',').map(p => p.trim());
    
    if (props.length > 0 && !content.includes(`${componentName}.propTypes`)) {
      const propTypesImport = !content.includes('prop-types') ? 
        "import PropTypes from 'prop-types';\n" : '';
      
      const propTypesDefinition = `\n${componentName}.propTypes = {\n${
        props.map(prop => `  ${prop}: PropTypes.any,`).join('\n')
      }\n};\n`;
      
      content = propTypesImport + content + propTypesDefinition;
    }
  }
  
  return content;
}

// Main fix function
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    
    // Apply fixes
    content = fixUnusedReactImports(content);
    content = fixUnusedImports(content);
    content = addMissingCurlyBraces(content);
    content = removeConsoleLogs(content);
    
    // Only write if content changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
function main() {
  const srcDir = path.join(__dirname, '..', 'src');
  const files = getAllFiles(srcDir);
  
  let fixedCount = 0;
  
  console.log(`Processing ${files.length} files...`);
  
  files.forEach(file => {
    // Skip test files for some fixes
    if (!file.includes('__tests__') && !file.includes('.test.')) {
      if (fixFile(file)) {
        fixedCount++;
      }
    }
  });
  
  console.log(`\nFixed ${fixedCount} files.`);
  console.log('\nPlease review the changes and run ESLint again to verify.');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { fixFile, getAllFiles };