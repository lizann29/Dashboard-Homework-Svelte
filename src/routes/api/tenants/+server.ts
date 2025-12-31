import {json} from '@sveltejs/kit';
import type {RequestHandler} from './$types';
import {generateTenants} from "$lib/utils/mockData";

export const GET: RequestHandler = async ({setHeaders}) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const tenants = generateTenants(5);

    setHeaders({
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
    });

    return json(tenants);
};