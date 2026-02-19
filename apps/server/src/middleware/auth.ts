import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../types/errors';

export const authentication = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Public path(s)
    if (req.path === '/health') {
        next();
        return;
    }

    const authHeader = req.headers.authorization;

    // Ensure that the header exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        next(new UnauthorizedError("Authorization header not found."));
        return;
    }

    // Extract request token and compare it with the access code
    const token = authHeader.split(' ')[1];
    const accessCode = process.env.ACCESS_CODE ?? '';
    if (
        token.length !== accessCode.length ||
        !crypto.timingSafeEqual(Buffer.from(token), Buffer.from(accessCode))
    ) {
        next(new UnauthorizedError("Invalid access token."));
        return;
    }

    next();
}