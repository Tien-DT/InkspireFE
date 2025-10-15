#!/usr/bin/env node

/**
 * Pre-deployment verification script
 * Run this before deploying to Vercel to catch common issues
 */

import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const BLUE = '\x1b[34m'
const RESET = '\x1b[0m'

let hasErrors = false
let hasWarnings = false

function log(message, color = RESET) {
  console.log(`${color}${message}${RESET}`)
}

function checkExists(file, description) {
  const exists = existsSync(file)
  if (exists) {
    log(`✓ ${description}`, GREEN)
  } else {
    log(`✗ ${description}`, RED)
    hasErrors = true
  }
  return exists
}

function checkPackageJson() {
  log('\n📦 Checking package.json...', BLUE)

  const pkg = JSON.parse(readFileSync('package.json', 'utf-8'))

  // Check engines
  if (pkg.engines && pkg.engines.node) {
    log(`✓ Node version specified: ${pkg.engines.node}`, GREEN)
  } else {
    log('⚠ No Node version specified in engines', YELLOW)
    hasWarnings = true
  }

  // Check optional dependencies
  const requiredOptionalDeps = [
    '@rollup/rollup-linux-x64-gnu',
    'lightningcss-linux-x64-gnu',
    '@tailwindcss/oxide-linux-x64-gnu'
  ]

  const optDeps = pkg.optionalDependencies || {}

  requiredOptionalDeps.forEach((dep) => {
    if (optDeps[dep]) {
      log(`✓ ${dep} present`, GREEN)
    } else {
      log(`✗ Missing: ${dep}`, RED)
      hasErrors = true
    }
  })
}

function checkConfigFiles() {
  log('\n⚙️  Checking configuration files...', BLUE)

  checkExists('.npmrc', 'NPM configuration')
  checkExists('vercel.json', 'Vercel configuration')
  checkExists('.node-version', 'Node version file')
  checkExists('vite.config.ts', 'Vite configuration')
  checkExists('react-router.config.ts', 'React Router configuration')

  if (checkExists('.env.example', 'Environment variables template')) {
    if (!existsSync('.env') && !existsSync('.env.local')) {
      log('⚠ No .env or .env.local file found (okay for production)', YELLOW)
      hasWarnings = true
    }
  }
}

function checkVercelJson() {
  log('\n🔧 Checking vercel.json...', BLUE)

  try {
    const vercel = JSON.parse(readFileSync('vercel.json', 'utf-8'))

    if (vercel.buildCommand) {
      log(`✓ Build command: ${vercel.buildCommand}`, GREEN)
    } else {
      log('⚠ No build command specified', YELLOW)
      hasWarnings = true
    }

    if (vercel.installCommand) {
      log(`✓ Install command: ${vercel.installCommand}`, GREEN)
    } else {
      log('⚠ No install command specified', YELLOW)
      hasWarnings = true
    }

    if (vercel.rewrites && vercel.rewrites.length > 0) {
      log('✓ Rewrites configured for SPA routing', GREEN)
    } else {
      log('✗ No rewrites configured - SPA routing may fail', RED)
      hasErrors = true
    }
  } catch (e) {
    log('✗ Failed to parse vercel.json', RED)
    hasErrors = true
  }
}

function checkBuildLocally() {
  log('\n🏗️  Testing local build...', BLUE)

  try {
    log('Installing dependencies...', BLUE)
    execSync('npm install --legacy-peer-deps', { stdio: 'inherit' })

    log('Running typecheck...', BLUE)
    execSync('npm run typecheck', { stdio: 'inherit' })

    log('Running build...', BLUE)
    execSync('npm run build', { stdio: 'inherit' })

    log('✓ Build completed successfully!', GREEN)

    // Check build output
    if (existsSync('build')) {
      log('✓ Build directory created', GREEN)

      if (existsSync('build/server/index.js')) {
        log('✓ Server bundle generated', GREEN)
      } else {
        log('⚠ Server bundle not found', YELLOW)
        hasWarnings = true
      }

      if (existsSync('build/client')) {
        log('✓ Client assets generated', GREEN)
      } else {
        log('✗ Client assets not found', RED)
        hasErrors = true
      }
    } else {
      log('✗ Build directory not created', RED)
      hasErrors = true
    }
  } catch (e) {
    log('✗ Build failed!', RED)
    hasErrors = true
  }
}

function checkGitStatus() {
  log('\n📝 Checking git status...', BLUE)

  try {
    const status = execSync('git status --porcelain', { encoding: 'utf-8' })

    if (status.trim()) {
      log('⚠ Uncommitted changes detected:', YELLOW)
      log(status, YELLOW)
      hasWarnings = true
    } else {
      log('✓ Working directory clean', GREEN)
    }

    const branch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim()
    log(`Current branch: ${branch}`, BLUE)
  } catch (e) {
    log('⚠ Not a git repository or git not available', YELLOW)
    hasWarnings = true
  }
}

function printSummary() {
  log('\n' + '='.repeat(60), BLUE)
  log('VERIFICATION SUMMARY', BLUE)
  log('='.repeat(60), BLUE)

  if (hasErrors) {
    log('\n❌ FAILED - Please fix errors before deploying', RED)
    process.exit(1)
  } else if (hasWarnings) {
    log('\n⚠️  PASSED WITH WARNINGS - Review warnings before deploying', YELLOW)
    process.exit(0)
  } else {
    log('\n✅ ALL CHECKS PASSED - Ready to deploy!', GREEN)
    log('\nNext steps:', BLUE)
    log('1. git add .', RESET)
    log('2. git commit -m "fix: complete deployment configuration"', RESET)
    log('3. git push origin main-deploy', RESET)
    log('4. Monitor Vercel dashboard for deployment status', RESET)
    process.exit(0)
  }
}

// Main execution
async function main() {
  log('🚀 Pre-Deployment Verification', BLUE)
  log('='.repeat(60), BLUE)

  checkConfigFiles()
  checkPackageJson()
  checkVercelJson()
  checkGitStatus()

  const shouldBuild = process.argv.includes('--build')

  if (shouldBuild) {
    checkBuildLocally()
  } else {
    log('\n💡 Skipping build test. Run with --build to test build locally', YELLOW)
  }

  printSummary()
}

main().catch((err) => {
  log(`\n❌ Verification failed: ${err.message}`, RED)
  process.exit(1)
})
