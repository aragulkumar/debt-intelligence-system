import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding fake data...');

  // 1. Create User
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'arjun@example.com' },
    update: {},
    create: {
      email: 'arjun@example.com',
      password: passwordHash,
      name: 'Arjun Kumar',
      monthlyIncome: 85000,
      phone: '+919876543210',
      settings: {
        create: {
          overdueWarningDays: 3,
          maxEmiLoadPercent: 40,
        }
      }
    },
  });

  console.log(`User created: ${user.email} / password123`);

  // 2. Clear old debts (optional, to keep it clean)
  await prisma.debt.deleteMany({ where: { userId: user.id } });

  // 3. Create active fake debts
  const today = new Date();
  
  const d1 = new Date(today);
  d1.setDate(today.getDate() + 3); // Due in 3 days (triggers alert)

  const d2 = new Date(today);
  d2.setDate(today.getDate() + 15); // Due in 15 days

  const d3 = new Date(today);
  d3.setDate(today.getDate() + 7); // Due exactly in 7 days (triggers alert)

  await prisma.debt.createMany({
    data: [
      {
        userId: user.id,
        name: 'HDFC Credit Card',
        type: 'CREDIT_CARD',
        principal: 50000,
        outstanding: 45000,
        interestRate: 36,
        emiAmount: 5000,
        dueDate: d1,
      },
      {
        userId: user.id,
        name: 'Amazon Pay Later',
        type: 'BNPL',
        principal: 15000,
        outstanding: 15000,
        interestRate: 24,
        emiAmount: 2500,
        dueDate: d2,
      },
      {
        userId: user.id,
        name: 'Personal Loan',
        type: 'PERSONAL_LOAN',
        principal: 300000,
        outstanding: 250000,
        interestRate: 14,
        emiAmount: 12500,
        dueDate: d3,
      }
    ]
  });

  console.log('Fake debts attached to user!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
