// Shared by the Savings Calculator page (browser) and server.js (emailed report),
// so both always show the same numbers. Rates live in savings-rates.json.
const rates = require('./savings-rates.json')

const MAX_TEAM = 50

function calcSavings(roleId, region, teamSize) {
  const role = rates.roles.find((r) => r.id === roleId)
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

module.exports = { rates, calcSavings, money, MAX_TEAM }
