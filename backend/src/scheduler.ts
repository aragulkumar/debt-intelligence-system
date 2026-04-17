import cron from 'node-cron';
import prisma from './db/prisma';
import { NotificationService } from './services/notifications';

// Run every day at 09:00 AM
cron.schedule('0 9 * * *', async () => {
  console.log('[Scheduler] Running daily due date check...');
  
  try {
    // 1. Get all active rules that look for EMI due dates
    const rules = await prisma.rule.findMany({
      where: { isActive: true, trigger: 'EMI_DUE' },
      include: { user: true }
    });

    for (const rule of rules) {
      const thresholdDays = Math.round(rule.threshold); // 1, 3, or 7
      
      // 2. Find debts for this user where due date is exactly `thresholdDays` away
      const debts = await prisma.debt.findMany({
        where: { userId: rule.userId, isActive: true }
      });

      const today = new Date();
      today.setHours(0,0,0,0);
      
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + thresholdDays);

      const dueDebts = debts.filter(d => {
        const dDate = new Date(d.dueDate);
        dDate.setHours(0,0,0,0);
        return dDate.getTime() === targetDate.getTime();
      });

      // 3. Dispatch Notifications
      for (const debt of dueDebts) {
        const message = `Alert: Your ${debt.name} payment of ₹${debt.emiAmount} is due in ${thresholdDays} day(s). Log in to check your strategy.`;
        
        // Use the action flag to determine what to send
        if (rule.action === 'SMS' && rule.user.phone) {
          await NotificationService.sendSMS(rule.user.phone, message);
        } else if (rule.action === 'EMAIL' && rule.user.email) {
          await NotificationService.sendEmail(rule.user.email, `Upcoming Payment: ${debt.name}`, message);
        } else if (rule.action === 'EMAIL_SMS') {
          if (rule.user.email) await NotificationService.sendEmail(rule.user.email, `Upcoming Payment: ${debt.name}`, message);
          if (rule.user.phone) await NotificationService.sendSMS(rule.user.phone, message);
        }
        
        // Log locally for debugging
        console.log(`[Scheduler] Dispatched alert to ${rule.user.email} for ${debt.name}`);
      }
    }
  } catch (err: any) {
    console.error(`[Scheduler ERROR] ${err.message}`);
  }
});
