// remove-css-hacks.cjs

const fs = require("fs");
const path = require("path");

const distPath = path.resolve(__dirname, "dist");

// Define the regex pattern to find all instances
const pattern = /(:not\(#\\#\))+/g;

// Function to process a single CSS file
function processCssFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");

    // Count the number of matches
    const matches = content.match(pattern);
    const count = matches ? matches.length : 0;

    // Replace the matches
    const cleanedContent = content.replace(pattern, "");

    // Write the cleaned content back to the file
    if (count > 0) {
      fs.writeFileSync(filePath, cleanedContent, "utf8");
      console.log(`✓ ${count} CSS hacks removed from: ${filePath}`);
    } else {
      console.log(`- No CSS hacks found in: ${filePath}`);
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
  }
}

// Function to find all .css files in the dist folder
function findCssFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      findCssFiles(fullPath); // Recursively search in subdirectories
    } else if (file.isFile() && file.name.endsWith(".css")) {
      processCssFile(fullPath);
    }
  }
}

findCssFiles(distPath);
