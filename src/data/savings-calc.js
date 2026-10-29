// Shared by the Savings Calculator page (browser) and server.js (emailed report),
// so both always show the same numbers. Rates live in savings-rates.json.
//
// Roles come from two places:
//  1. The fixed list in savings-rates.json (each has its own researched rates).
//  2. Job titles currently placed, synced from the GKP Placements app. These don't have
//     their own rates, so each title is matched by keywords (RULES below) to the closest
//     fixed role, then nudged up or down for seniority words like "Senior" or "Junior".
const rates = require('./savings-rates.json')

const MAX_TEAM = 50
const SYNCED_PREFIX = 't:' // role keys for synced titles look like "t:Senior Java Developer"

// Rate groups a synced title can match: the Popular roles plus the extra "families"
// in savings-rates.json (front-end, mobile, architect, support, ...).
const BASES = [...rates.roles, ...((rates.families && rates.families.list) || [])]

// First matching rule wins, so more specific patterns come first.
const RULES = [
  [/\bqa\b|quality|test|sdet/i, 'sfqa'],
  [/machine learning|mlops|\bml\b|\bai\b|data scien|deep learning|\bllm\b|nlp|computer vision/i, 'ml'],
  [/architect/i, 'architect'],
  [/devops|\bsre\b|site reliab|platform eng|kubernetes|infrastructure|release eng|build eng/i, 'devops'],
  [/\biam\b|identity|security|cyber|okta|sailpoint|ping\b|cyberark|soc\b|penetration/i, 'iam'],
  [/scrum|agile|product owner/i, 'scrum'],
  [/project manag|program manag|delivery manag|engagement manag|product manag|\bpmo?\b/i, 'pm'],
  [/oracle|\berp\b|\bsap\b|netsuite|workday|peoplesoft|dynamics|\bebs\b|jd ?edwards/i, 'oracle'],
  [/analyst|\bba\b|\bbsa\b/i, 'analyst'],
  [/\bios\b|android|mobile|swift|kotlin|flutter|react native/i, 'mobile'],
  [/front[\s-]?end|\bui\b|\bux\b|react|angular|vue|javascript|typescript/i, 'frontend'],
  [/full[\s-]?stack/i, 'fullstack'],
  [/data eng|database|\bdba\b|\bsql\b|postgres|\betl\b|\bgis\b|data warehouse|snowflake|databricks/i, 'data'],
  [/azure|\baws\b|\bgcp\b|cloud/i, 'azure'],
  [/support|help ?desk|technician|administrator|\badmin\b/i, 'support'],
  [/back[\s-]?end|\bapi\b|java|\.net|dotnet|c#|spring|golang|\bgo\b|ruby|php|node/i, 'backend'],
  [/writer|documentation/i, 'writer'],
  [/python|django|flask/i, 'python'],
]
const DEFAULT_ROLE = 'python' // general software engineering rates

const SENIOR = /\b(senior|sr\.?|lead|principal|staff|head|director)\b/i
const JUNIOR = /\b(junior|jr\.?|associate|entry|intern|trainee)\b/i

function baseRoleFor(title) {
  const hit = RULES.find(([re]) => re.test(title))
  const id = hit ? hit[1] : DEFAULT_ROLE
  return BASES.find((r) => r.id === id) || BASES.find((r) => r.id === DEFAULT_ROLE)
}

function seniorityFactor(title) {
  if (JUNIOR.test(title)) return 0.8
  if (SENIOR.test(title)) return 1.15
  return 1
}

// Tidies synced titles using the rename / hide lists in savings-rates.json, merges
// duplicates, and drops any that match a fixed role's name.
const synced = rates.syncedTitles || {}
const RENAME = Object.fromEntries(Object.entries(synced.rename || {}).map(([k, v]) => [k.toLowerCase(), v]))
const HIDE = new Set((synced.hide || []).map((t) => t.toLowerCase()))

function cleanSyncedTitles(titles) {
  const fixed = new Set(rates.roles.map((r) => r.label.toLowerCase()))
  const seen = new Set()
  const out = []
  for (const t of Array.isArray(titles) ? titles : []) {
    const raw = String(t || '').replace(/\s+/g, ' ').trim()
    if (HIDE.has(raw.toLowerCase())) continue
    const title = (RENAME[raw.toLowerCase()] || raw).slice(0, 80)
    const key = title.toLowerCase()
    if (!title || fixed.has(key) || seen.has(key)) continue
    seen.add(key)
    out.push(title)
  }
  return out.sort((a, b) => a.localeCompare(b))
}

// roleKey is a fixed role id ("python") or "t:<synced title>". Synced titles are only
// accepted if they're in syncedTitles, so visitors can't make up their own.
function resolveRole(roleKey, syncedTitles) {
  const fixed = rates.roles.find((r) => r.id === roleKey)
  if (fixed) return fixed
  if (typeof roleKey !== 'string' || !roleKey.startsWith(SYNCED_PREFIX)) return null
  const title = roleKey.slice(SYNCED_PREFIX.length)
  if (!cleanSyncedTitles(syncedTitles).includes(title)) return null
  const base = baseRoleFor(title)
  const f = seniorityFactor(title)
  const role = { id: roleKey, label: title, usSalary: Math.round((base.usSalary * f) / 1000) * 1000 }
  for (const region of Object.keys(rates.regions)) role[region] = Math.round(base[region] * f)
  return role
}

function calcSavings(roleKey, region, teamSize, syncedTitles = []) {
  const role = resolveRole(roleKey, syncedTitles)
  if (!role || !rates.regions[region]) return null
  const team = Math.min(MAX_TEAM, Math.max(1, Math.round(Number(teamSize) || 1)))

  const usPerPerson = Math.round(role.usSalary * rates.usLoadedMultiplier)
  const gkpPerPerson = Math.round(role[region] * rates.hoursPerYear)
  const usTotal = usPerPerson * team
  const gkpTotal = gkpPerPerson * team
  const savings = usTotal - gkpTotal

  return {
    roleLabel: role.label,
    regionLabel: rates.regions[region],
    team,
    usPerPerson,
    gkpPerPerson,
    usTotal,
    gkpTotal,
    savings,
    savingsPct: usTotal > 0 ? Math.round((savings / usTotal) * 100) : 0,
    usSalary: role.usSalary,
    hourlyRate: role[region],
  }
}

const money = (n) => '$' + Math.round(n).toLocaleString('en-US')

module.exports = { rates, calcSavings, cleanSyncedTitles, money, MAX_TEAM, SYNCED_PREFIX }
