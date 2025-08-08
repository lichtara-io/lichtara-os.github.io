#!/usr/bin/env node
/**
 * Validador de manifests de agentes Lichtara.
 * Uso: node scripts/validate-manifests.js [--fix]
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import yaml from 'yaml';

const AGENTS_DIR = path.resolve('agents');
const REQUIRED_TOP = [
  'name','code','version','status','maturity','role','description',
  'scope','identity','inputs','outputs','capabilities','limitations',
  'dependencies','interfaces','lifecycle','safeguards','ethics',
  'telemetry','fallback','alignment_protocols','vibrational_signature',
  'tags','maintainer','licensing','public'
];

let errors = 0;
let warnings = 0;

function hash(str) {
  return crypto.createHash('sha1').update(str).digest('hex').slice(0,10);
}

function log(kind, msg, file) {
  const base = file ? `[${file}]` : '';
  if (kind === 'ERROR') { errors++; console.error(`✖ ERROR ${base} ${msg}`); }
  else if (kind === 'WARN') { warnings++; console.warn(`⚠ WARN  ${base} ${msg}`); }
  else console.log(`• INFO  ${base} ${msg}`);
}

function validateManifest(obj, file) {
  REQUIRED_TOP.forEach(k => {
    if (!(k in obj)) log('ERROR', `Campo obrigatório ausente: ${k}`, file);
  });

  if (obj.code && obj.name && obj.code !== obj.name.toUpperCase()) {
    log('WARN', `code != name.toUpperCase() → code=${obj.code} name=${obj.name}`, file);
  }

  if (!Array.isArray(obj.inputs)) log('ERROR', 'inputs deve ser array', file);
  else if (!obj.inputs.length) log('WARN', 'inputs vazio', file);

  if (!Array.isArray(obj.outputs)) log('ERROR', 'outputs deve ser array', file);

  if (obj.status && !['planned','active','deprecated'].includes(obj.status)) {
    log('WARN', `status desconhecido: ${obj.status}`, file);
  }

  if (obj.public && obj.telemetry && obj.telemetry.enabled !== true) {
    log('WARN', 'Agente público sem telemetria habilitada', file);
  }

  // assinatura vibracional leve
  const canonical = JSON.stringify({
    name: obj.name,
    code: obj.code,
    version: obj.version
  });
  const sig = hash(canonical);
  if (!obj.vibrational_signature || !obj.vibrational_signature.seed) {
    log('WARN', `Assinatura vibracional ausente (seed)`, file);
  } else {
    log('INFO', `Assinatura prevista: ${sig}`, file);
  }
}

function collectManifests() {
  if (!fs.existsSync(AGENTS_DIR)) {
    console.error('Diretório agents não encontrado.');
    process.exit(1);
  }
  const entries = fs.readdirSync(AGENTS_DIR);
  const manifests = [];
  entries.forEach(dir => {
    if (dir.startsWith('_')) return;
    const manifestPath = path.join(AGENTS_DIR, dir, 'manifest.yml');
    if (fs.existsSync(manifestPath)) {
      manifests.push(manifestPath);
    }
  });
  return manifests;
}

function main() {
  console.log('== Validação de Manifests Lichtara ==');
  const manifests = collectManifests();
  if (!manifests.length) {
    console.log('Nenhum manifest encontrado.');
    process.exit(0);
  }
  manifests.forEach(file => {
    try {
      const raw = fs.readFileSync(file, 'utf-8');
      const parsed = yaml.parse(raw);
      validateManifest(parsed, path.relative('.', file));
    } catch (e) {
      log('ERROR', `Falha ao parsear: ${e.message}`, file);
    }
  });
  console.log('\nResumo:');
  console.log(`Erros: ${errors} | Avisos: ${warnings}`);
  if (errors > 0) process.exit(2);
}

main();
