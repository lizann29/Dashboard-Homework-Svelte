import type {Tenant} from "$lib/types/+page";

export async function getTenants(): Promise<Tenant[]> {
    const response = await fetch('/api/tenants');

    if (!response.ok) {
        throw new Error(`Failed to fetch tenants: ${response.statusText}`);
    }
    return response.json();
}