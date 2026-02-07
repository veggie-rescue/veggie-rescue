import type { Request, Response, NextFunction } from "express";
import { RateLimitError } from "../types/errors";

// Stores IP Address: string : {retryAfter: number, requestCount: number}
    // retryAfter is in millseconds
const ipStore = new Map();

export const rateLimit = (
    req: Request, 
    res: Response, 
    next: NextFunction
): void => {
    // Public paths
    if (req.path === '/health') {
        next();
        return;
    }

    // Check the request IP against the stored IPs
        // If it's been seen, ensure that it hasn't passed the request limit
        // IF it hasn't, log the IP and track its count
    const ip = req.ip;
    const ipData = ipStore.get(ip);
    if (ipData) {
        // If the reset hasn't been automatically triggered by cleanup,
            // perform it manually
        if (Date.now() > ipData.retryAfter) {
            ipStore.delete(ip);
            next();
            return;
        }
        
        // Ensure that the limit hasn't been reached
        if (ipData.count > getRateLimit()) {
            const millisecondsTillReset = ((new Date(ipData.retryAfter)).getMilliseconds() - Date.now());
            res.setHeader("Retry-After", millisecondsTillReset);

            next(new RateLimitError(millisecondsTillReset));
            return;
        }

        // Increment the count if no guards have been tripped
        ipData.count++;
    }
    else {
        // Initialize the IP in the store
        ipStore.set(ip, { retryAfter: Date.now() + getWindow(), requestCount: 1 })
    }

    // Set informative headers
    res.setHeader("X-RateLimit-Limit", getRateLimit());
    res.setHeader("X-RateLimit-Remaining", getRateLimit() - ipData.requestCount);
    res.setHeader("X-RateLimit-Reset", (new Date(ipData.retryAfter)).toString());

    next();
}

function getWindow(): number {
    if (process.env.RATE_LIMIT_WINDOW_MS) {
        return parseInt(process.env.RATE_LIMIT_WINDOW_MS)
    }
    
    // 15 minute default
    return 90000;
}

function getRateLimit(): number {
    if (process.env.RATE_LIMIT_MAX_REQUESTS) {
        return parseInt(process.env.RATE_LIMIT_MAX_REQUESTS);
    }

    // 100 request default
    return 100;
}