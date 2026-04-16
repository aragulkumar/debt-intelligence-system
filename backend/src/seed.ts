/**
 * Seed script — creates a demo user with realistic debt data
 * Run: npx ts-node src/seed.ts
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const EMAIL    = 'demo@debthelper.com';
const PASSWORD = 'Demo@1234';

async function main() {
  console.log('🌱  Seeding demo data...\n');

  // ── 1. Upsert demo user ─────────────────────────────────────
  const hashedPassword = await bcrypt.hash(PASSWORD, 10);
  const user = await prisma.user.upsert({
    where:  { email: EMAIL },
    update: { password: hashedPassword, name: 'Arjun Sharma', monthlyIncome: 75000 },
    create: {
      email: EMAIL, password: hashedPassword,
      name: 'Arjun Sharma', monthlyIncome: 75000, phone: '+91 98765 43210',
    },
  });
  console.log(`✅  User   : ${user.email}  (id: ${user.id})`);

  // ── 2. Delete existing data for clean re-seed ───────────────
  await prisma.debt.deleteMany({ where: { userId: user.id } });
  await prisma.rule.deleteMany({ where: { userId: user.id } });
  await prisma.healthScoreHistory.deleteMany({ where: { userId: user.id } });

  // ── 3. Create realistic debts (types from schema enum) ──────
  const d  = (n: number) => { const dt = new Date(); dt.setDate(dt.getDate() + n); return dt; };
  const debts = await Promise.all([
    prisma.debt.create({ data: {
      userId: user.id, name: 'HDFC Regalia Credit Card',
      type: 'CREDIT_CARD', principal: 60000, outstanding: 45000,
      emiAmount: 3500, interestRate: 18.5, dueDate: d(2), isActive: true,
    }}),
    prisma.debt.create({ data: {
      userId: user.id, name: 'SBI Personal Loan',
      type: 'PERSONAL_LOAN', principal: 150000, outstanding: 120000,
      emiAmount: 5800, interestRate: 14.5, dueDate: d(10), isActive: true,
    }}),
    prisma.debt.create({ data: {
      userId: user.id, name: 'Bajaj Finserv BNPL',
      type: 'BNPL', principal: 15000, outstanding: 12500,
      emiAmount: 2500, interestRate: 24.0, dueDate: d(18), isActive: true,
    }}),
    prisma.debt.create({ data: {
      userId: user.id, name: 'ICICI Bank Car Loan',
      type: 'OTHER', principal: 450000, outstanding: 350000,
      emiAmount: 7200, interestRate: 9.5, dueDate: d(28), isActive: true,
    }}),
    prisma.debt.create({ data: {
      userId: user.id, name: 'Amazon Pay Later',
      type: 'BNPL', principal: 10000, outstanding: 8000,
      emiAmount: 2000, interestRate: 26.0, dueDate: d(9), isActive: true,
    }}),
  ]);
  console.log(`✅  Debts  : ${debts.length} accounts seeded`);

  // ── 4. Create default rules (action field is required) ──────
  await Promise.all([
    prisma.rule.create({ data: {
      userId: user.id, trigger: 'dti_above', threshold: 40,
      action: 'notify', isActive: true,
    }}),
    prisma.rule.create({ data: {
      userId: user.id, trigger: 'emi_due_in_days', threshold: 3,
      action: 'notify', isActive: true,
    }}),
    prisma.rule.create({ data: {
      userId: user.id, trigger: 'dti_above', threshold: 20,
      action: 'notify', isActive: true,
    }}),
  ]);
  console.log(`✅  Rules  : 3 rules seeded`);

  // ── 5. Seed 6 months of health score history ────────────────
  const scores = [
    { score: 48, band: 'Fair', m: 5 }, { score: 52, band: 'Fair',      m: 4 },
    { score: 55, band: 'Fair', m: 3 }, { score: 60, band: 'Good',      m: 2 },
    { score: 63, band: 'Good', m: 1 }, { score: 65, band: 'Good',      m: 0 },
  ];
  for (const h of scores) {
    const dt = new Date(); dt.setMonth(dt.getMonth() - h.m);
    await prisma.healthScoreHistory.create({
      data: { userId: user.id, score: h.score, band: h.band, createdAt: dt },
    });
  }
  console.log(`✅  History: 6 months of health score trends seeded\n`);

  const totalDebt = debts.reduce((s, d) => s + d.outstanding, 0);
  const totalEmi  = debts.reduce((s, d) => s + (d.emiAmount || 0), 0);

  console.log('──────────────────────────────────────────');
  console.log('🎉  Demo account ready!\n');
  console.log(`   Email    :  ${EMAIL}`);
  console.log(`   Password :  ${PASSWORD}`);
  console.log(`   Name     :  Arjun Sharma`);
  console.log(`   Income   :  ₹75,000 / month`);
  console.log(`   Debts    :  ${debts.length} accounts   |   ₹${totalDebt.toLocaleString()} outstanding`);
  console.log(`   Monthly  :  ₹${totalEmi.toLocaleString()} EMI`);
  console.log('──────────────────────────────────────────\n');
}

main()
  .catch(e => { console.error('❌  Seed failed:', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
