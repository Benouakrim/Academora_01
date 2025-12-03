import { PrismaClient, UserRole } from '@prisma/client';
import { clerkClient } from '@clerk/express';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

export class SyncService {

  /**
   * Syncs key Neon user data (role, names) back to Clerk's public metadata.
   * This ensures client-side authentication and gating is instant and accurate.
   */
  static async syncNeonToClerk(neonUserId: string) {
    const user = await prisma.user.findUnique({
      where: { id: neonUserId },
      select: { clerkId: true, role: true, firstName: true, lastName: true },
    });

    if (!user) {
      throw new AppError(404, 'User not found in Neon DB');
    }
    
    // Push the Neon user data to Clerk metadata
    await clerkClient.users.updateUserMetadata(user.clerkId, {
      publicMetadata: { 
        role: user.role.toLowerCase(),
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

    return { success: true, clerkId: user.clerkId };
  }


  /**
   * Reconciliation: Fetches all Clerk users and creates/updates missing records in Neon.
   */
  static async reconcileClerkToNeon() {
    console.log('[SyncService] Starting full Clerk-to-Neon reconciliation...');
    let clerkUsers = await clerkClient.users.getUserList();
    let createdCount = 0;
    let updatedCount = 0;

    for (const clerkUser of clerkUsers.data) {
      const email = clerkUser.emailAddresses.find(e => e.id === clerkUser.primaryEmailAddressId)?.emailAddress;
      
      if (!email) {
        console.warn(`Skipping Clerk user ${clerkUser.id}: No primary email found.`);
        continue;
      }

      const neonUser = await prisma.user.findUnique({ where: { clerkId: clerkUser.id } });
      const userRole = (clerkUser.publicMetadata.role as string)?.toUpperCase() as UserRole || UserRole.USER;

      if (!neonUser) {
        // Create missing Neon user
        await prisma.user.create({
          data: {
            clerkId: clerkUser.id,
            email: email,
            firstName: clerkUser.firstName || undefined,
            lastName: clerkUser.lastName || undefined,
            avatarUrl: clerkUser.imageUrl || undefined,
            role: userRole,
          },
        });
        createdCount++;
      } else {
        // Update existing Neon user (e.g., if name/email changed in Clerk)
        await prisma.user.update({
            where: { id: neonUser.id },
            data: {
                email: email,
                firstName: clerkUser.firstName,
                lastName: clerkUser.lastName,
                avatarUrl: clerkUser.imageUrl,
                // Do NOT overwrite Neon role unless necessary, Neon is SOT for role
            }
        });
        updatedCount++;
      }
      
      // Ensure Neon's role is correctly pushed back to Clerk
      if (neonUser?.id) {
          await SyncService.syncNeonToClerk(neonUser.id).catch(err => console.error('Failed to sync role during reconcile:', err));
      }
    }
    
    console.log(`[SyncService] Reconciliation complete. Created: ${createdCount}, Updated: ${updatedCount}`);
    return { created: createdCount, updated: updatedCount };
  }
  
  /**
   * Health Check: Verifies data consistency between Neon and Clerk for a sample of users.
   */
  static async verifySyncStatus() {
    // Check last 10 updated users for consistency
    const neonUsers = await prisma.user.findMany({
      take: 10,
      orderBy: { updatedAt: 'desc' },
      select: { id: true, clerkId: true, email: true, role: true },
    });

    const inconsistencies: { user: string, reason: string }[] = [];

    for (const neonUser of neonUsers) {
      try {
        const clerkUser = await clerkClient.users.getUser(neonUser.clerkId);
        const clerkRole = (clerkUser.publicMetadata.role as string)?.toUpperCase();
        
        if (clerkRole !== neonUser.role) {
          inconsistencies.push({
            user: neonUser.email,
            reason: `Role mismatch: Neon=${neonUser.role}, Clerk=${clerkRole}`,
          });
        }
      } catch (err) {
        inconsistencies.push({
          user: neonUser.email,
          reason: 'Clerk user not found or unreachable',
        });
      }
    }
    
    return inconsistencies.length > 0 
      ? { status: 'INCONSISTENT', inconsistencies }
      : { status: 'SYNCED', inconsistencies: [] };
  }
}
