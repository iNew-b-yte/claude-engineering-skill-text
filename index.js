'use strict';

const fs = require('fs');
const path = require('path');

const skillsDir = path.join(__dirname, 'skills');

// Reads the `name` and `description` fields from a SKILL.md frontmatter block.
function readFrontmatter(file) {
  const text = fs.readFileSync(file, 'utf8');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const meta = {};
  if (!match) return meta;
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim();
  }
  return meta;
}

function listSkills() {
  return fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && fs.existsSync(path.join(skillsDir, e.name, 'SKILL.md')))
    .map((e) => {
      const meta = readFrontmatter(path.join(skillsDir, e.name, 'SKILL.md'));
      return {
        name: e.name,
        description: meta.description || '',
        path: path.join(skillsDir, e.name),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = { skillsDir, listSkills };
