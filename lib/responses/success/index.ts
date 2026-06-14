export function success<T>(data: T, message = 'Success', statusCode = 200) {
    return {
        success: true as const,
        statusCode,
        message,
        data,
    }
}

export function created<T>(data: T, message = 'Created') {
    return success(data, message, 201)
}

export function paginated<T>(
    data: T[],
    pagination: { page: number; limit: number; total: number },
    message = 'Success'
) {
    return {
        success: true as const,
        statusCode: 200,
        message,
        data,
        pagination: {
            ...pagination,
            totalPages: Math.ceil(pagination.total / pagination.limit),
        },
    }
}