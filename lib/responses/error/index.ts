export class AppError extends Error {
    public readonly statusCode: number
    public readonly isOperational: boolean

    constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = true
        Object.setPrototypeOf(this, new.target.prototype)
        Error.captureStackTrace(this, this.constructor)
    }
}

export class BadRequestError extends AppError {
    constructor(message = 'Bad request') { super(message, 400) }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') { super(message, 401) }
}

export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') { super(message, 403) }
}

export class NotFoundError extends AppError {
    constructor(resource = 'Resource') { super(`${resource} not found`, 404) }
}

export class ConflictError extends AppError {
    constructor(message = 'Conflict') { super(message, 409) }
}

export class RequestTimeoutError extends AppError {
    constructor(message = 'Request timeout') { super(message, 408) }
}

export class PayloadTooLargeError extends AppError {
    constructor(message = 'Payload too large') { super(message, 413) }
}

export class UnsupportedMediaTypeError extends AppError {
    constructor(message = 'Unsupported media type') { super(message, 415) }
}

export class UnprocessableEntityError extends AppError {
    constructor(message = 'Unprocessable entity') { super(message, 422) }
}

export class ValidationError extends AppError {
    constructor(message = 'Validation failed', public errors: Record<string, string[]>) {
        super(message, 422)
    }
}

export class TooManyRequestsError extends AppError {
    constructor(message = 'Too many requests', public retryAfter?: number) {
        super(message, 429)
    }
}

export class InternalServerError extends AppError {
    constructor(message = 'Internal server error') { super(message, 500) }
}

export class DatabaseError extends AppError {
    constructor(message = 'Database operation failed', public originalError?: unknown) {
        super(message, 500)
    }
}

export class ServiceUnavailableError extends AppError {
    constructor(message = 'Service unavailable') { super(message, 503) }
}


export function errorResponse(err: AppError | Error) {
    if (err instanceof ValidationError) {
        return {
            success: false as const,
            statusCode: err.statusCode,
            message: err.message,
            errors: err.errors,
        }
    }

    if (err instanceof AppError) {
        return {
            success: false as const,
            statusCode: err.statusCode,
            message: err.message,
        }
    }

    // Unknown/unexpected error — never leak internals
    return {
        success: false as const,
        statusCode: 500,
        message: 'Internal server error',
    }
}