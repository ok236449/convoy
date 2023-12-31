import http, { getPaginationSet, PaginatedResult } from '@/api/http'
import { rawDataToAdminServer, AdminServer } from '@/api/admin/servers/getServer'

export type ServerIncludes = 'user' | 'node'

export interface QueryParams {
    nodeId?: number
    userId?: number
    query?: string
    page?: number
    perPage?: number
    includes?: Array<ServerIncludes>
}

export type ServerResponse = PaginatedResult<AdminServer>

const getServers = async ({
    nodeId,
    userId,
    query,
    perPage = 50,
    includes,
    ...params
}: QueryParams): Promise<ServerResponse> => {
    const { data } = await http.get('/api/admin/servers', {
        params: {
            'filter[node_id]': nodeId,
            'filter[user_id]': userId,
            'filter[*]': query,
            'includes': includes?.join(','),
            'per_page': perPage,
            ...params,
        },
    })

    return {
        items: data.data.map(rawDataToAdminServer),
        pagination: getPaginationSet(data.meta.pagination),
    }
}

export default getServers
