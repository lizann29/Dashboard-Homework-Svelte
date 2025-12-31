import type { Tenant, User, Transaction } from '$lib/types/+page';

// Generate tenants
export function generateTenants(count: number = 5): Tenant[] {
    const tenants: Tenant[] = [];
    for (let i = 1; i <= count; i++) {
        tenants.push({
            id: `tenant-${i}`,
            name: `Company ${String.fromCharCode(64 + i)}` // Company A, B, C...
        });
    }
    return tenants;
}

// Generate users for a specific tenant
export function generateUsers(tenantId: string, count: number = 1000): User[] {
    const roles: ('admin' | 'user')[] = ['admin', 'user'];
    const users: User[] = [];

    for (let i = 1; i <= count; i++) {
        users.push({
            id: `${tenantId}-user-${i}`,
            tenantId,
            name: `User ${i}`,
            email: `user${i}@${tenantId}.com`,
            role: roles[Math.floor(Math.random() * roles.length)],
            active: Math.random() > 0.2 // 80% active
        });
    }
    return users;
}

// Generate transactions for a specific tenant
export function generateTransactions(tenantId: string, count: number = 10000): Transaction[] {
    const statuses: ('pending' | 'completed' | 'failed')[] = ['pending', 'completed', 'failed'];
    const transactions: Transaction[] = [];

    // Generate dates from last 6 months
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    for (let i = 1; i <= count; i++) {
        const randomDate = new Date(
            sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime())
        );

        transactions.push({
            id: `${tenantId}-txn-${i}`,
            tenantId,
            amount: Math.floor(Math.random() * 10000) + 10, // $10 - $10,010
            description: `Transaction ${i}`,
            date: randomDate.toISOString(),
            status: statuses[Math.floor(Math.random() * statuses.length)]
        });
    }

    // Sort by date descending (newest first)
    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}