import "server-only";

export class ValidationError extends Error {
    constructor(message: string, public readonly issues: Record<string, string[] | undefined>) {
        super(message);
        this.name = "ValidationError";
    }
}
