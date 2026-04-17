import cron from 'node-cron';
import prisma from './db/prisma';
import { NotificationService } from './services/notifications';

// Run every day at 09:00 AM
cron.schedule('0 9 * * *', async () => {
  console.log('[Scheduler] Running daily due date check...');
  
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    // Find all active debts
    const debts = await prisma.debt.findMany({
      where: { isActive: true },
      include: { user: true }
    });

    for (const debt of debts) {
      if (!debt.user) continue;

      const dDate = new Date(debt.dueDate);
      dDate.setHours(0,0,0,0);
      
      const diffTime = dDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Trigger strictly at 7, 3, and 1 day out
      if (diffDays === 7 || diffDays === 3 || diffDays === 1) {
        const message = `Alert: Your ${debt.name} payment of ₹${debt.emiAmount?.toLocaleString() || debt.outstanding.toLocaleString()} is due in ${diffDays} day(s). Log in to mark it as paid!`;
        
        // Dispatch notifications
        if (debt.user.email) {
          await NotificationService.sendEmail(debt.user.email, `Upcoming Payment: ${debt.name}`, message);
        }
        if (debt.user.phone) {
          await NotificationService.sendSMS(debt.user.phone, message);
        }
        
        console.log(`[Scheduler] Dispatched ${diffDays}-day alert to ${debt.user.email} for ${debt.name}`);
      }
    }
  } catch (err: any) {
    console.error(`[Scheduler ERROR] ${err.message}`);
  }
});
