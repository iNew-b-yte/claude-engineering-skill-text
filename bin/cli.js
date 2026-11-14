#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { listSkills } = require('..');
const pkg = require('../package.json');

const HELP = `${pkg.name} v${pkg.version}

Usage:
  npx ${pkg.name} [command] [options]

Commands:
  install      Copy the skills into a Claude skills folder (default command)
  uninstall    Remove the skills this package installed
  list         List the bundled skills and whether they are installed

Options:
  -g, --global       Target ~/.claude/skills (default; available in every project)
  -p, --project      Target ./.claude/skills in the current directory
  -d, --dir <path>   Target a custom skills directory
  -o, --only <list>  Comma-separated skill names, e.g. --only security,testing
  -f, --force        Overwrite skills that already exist in the target
  -n, --dry-run      Print what would happen without changing anything
  -h, --help         Show this help
  -v, --version      Show the version

Examples:
  npx ${pkg.name}                       # install all skills globally
  npx ${pkg.name} install --project     # install into this repo only
  npx ${pkg.name} install --only debugging,testing --force
  npx ${pkg.name} uninstall
`;

function fail(msg) {
  console.error(`error: ${msg}`);
  process.exit(1);
}

function parseArgs(argv) {
  const opts = { command: 'install', scope: 'global', dir: null, only: null, force: false, dryRun: false };
  let commandSet = false;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '-g': case '--global': opts.scope = 'global'; break;
      case '-p': case '--project': opts.scope = 'project'; break;
      case '-d': case '--dir':
        opts.dir = argv[++i];
        if (!opts.dir) fail('--dir needs a path');
        break;
      case '-o': case '--only':
        if (!argv[i + 1]) fail('--only needs a comma-separated list of skill names');
        opts.only = argv[++i].split(',').map((s) => s.trim()).filter(Boolean);
        break;
      case '-f': case '--force': opts.force = true; break;
      case '-n': case '--dry-run': opts.dryRun = true; break;
      case '-h': case '--help': opts.command = 'help'; commandSet = true; break;
      case '-v': case '--version': opts.command = 'version'; commandSet = true; break;
      default:
        if (arg.startsWith('-')) fail(`unknown option ${arg}\n\n${HELP}`);
        if (commandSet) fail(`unexpected argument ${arg}`);
        opts.command = arg;
        commandSet = true;
    }
  }
  return opts;
}

// Claude Code honours CLAUDE_CONFIG_DIR as an override for ~/.claude.
function targetDir(opts) {
  if (opts.dir) return path.resolve(opts.dir);
  if (opts.scope === 'project') return path.resolve('.claude', 'skills');
  const configDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
  return path.join(configDir, 'skills');
}

function selectSkills(opts) {
  const all = listSkills();
  if (!opts.only) return all;
  const known = new Set(all.map((s) => s.name));
  const unknown = opts.only.filter((n) => !known.has(n));
  if (unknown.length) {
    fail(`unknown skill(s): ${unknown.join(', ')}\nAvailable: ${[...known].join(', ')}`);
  }
  return all.filter((s) => opts.only.includes(s.name));
}

function install(opts) {
  const dest = targetDir(opts);
  const skills = selectSkills(opts);
  const prefix = opts.dryRun ? '[dry-run] ' : '';
  let installed = 0;
  let skipped = 0;

  if (!opts.dryRun) fs.mkdirSync(dest, { recursive: true });

  for (const skill of skills) {
    const to = path.join(dest, skill.name);
    const exists = fs.existsSync(to);
    if (exists && !opts.force) {
      console.log(`  skip     ${skill.name} (already exists; use --force to overwrite)`);
      skipped++;
      continue;
    }
    if (!opts.dryRun) {
      // Replace rather than merge so files removed upstream don't linger.
      if (exists) fs.rmSync(to, { recursive: true, force: true });
      fs.cpSync(skill.path, to, { recursive: true });
    }
    console.log(`  ${prefix}${exists ? 'update ' : 'install'}  ${skill.name}`);
    installed++;
  }

  console.log(`\n${prefix}${installed} installed, ${skipped} skipped -> ${dest}`);
  if (installed && !opts.dryRun) {
    console.log('Restart Claude Code (or start a new session) to load the skills.');
  }
}

function uninstall(opts) {
  const dest = targetDir(opts);
  const prefix = opts.dryRun ? '[dry-run] ' : '';
  let removed = 0;

  // Only touch folders whose names match a skill shipped in this package.
  for (const skill of selectSkills(opts)) {
    const to = path.join(dest, skill.name);
    if (!fs.existsSync(path.join(to, 'SKILL.md'))) continue;
    if (!opts.dryRun) fs.rmSync(to, { recursive: true, force: true });
    console.log(`  ${prefix}remove  ${skill.name}`);
    removed++;
  }

  console.log(`\n${prefix}${removed} removed from ${dest}`);
}

function list(opts) {
  const dest = targetDir(opts);
  const skills = selectSkills(opts);
  const width = Math.max(...skills.map((s) => s.name.length));
  console.log(`${skills.length} skills (installed status checked in ${dest}):\n`);
  for (const skill of skills) {
    const mark = fs.existsSync(path.join(dest, skill.name, 'SKILL.md')) ? '[x]' : '[ ]';
    const desc = skill.description.length > 90 ? `${skill.description.slice(0, 87)}...` : skill.description;
    console.log(`  ${mark} ${skill.name.padEnd(width)}  ${desc}`);
  }
}

const opts = parseArgs(process.argv.slice(2));
switch (opts.command) {
  case 'install': install(opts); break;
  case 'uninstall': case 'remove': uninstall(opts); break;
  case 'list': case 'ls': list(opts); break;
  case 'help': console.log(HELP); break;
  case 'version': console.log(pkg.version); break;
  default: fail(`unknown command "${opts.command}"\n\n${HELP}`);
}
