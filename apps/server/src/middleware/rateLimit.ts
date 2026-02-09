import type { Request, Response, NextFunction } from "express";
import { RateLimitError } from "../types/errors";

// Stores IP Address: string : {retryAfter: number, requestCount: number}
    // retryAfter is in millseconds
    // Periodically check the storage for expired times every 15 minutes
let lastIpStoreCheck = Date.now();
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
    if (ipStore.has(ip)) {
        const ipData = ipStore.get(ip);

        // If the reset hasn't been automatically triggered by cleanup,
            // perform it manually and then reset the IP's data
        if (Date.now() > ipData.retryAfter) {
            ipStore.set(ip, {retryAfter: Date.now() + getWindow(), requestCount: 1});
            next();
            return;
        }
        
        // Ensure that the limit hasn't been reached
        if (ipData.requestCount >= getRateLimit()) {
            const secondsTillReset = (ipData.retryAfter - Date.now()) / 1000;
            res.setHeader("Retry-After", secondsTillReset);

            res.setHeader("X-RateLimit-Limit", getRateLimit());
            res.setHeader("X-RateLimit-Remaining", getRateLimit() - ipData.requestCount);
            res.setHeader("X-RateLimit-Reset", (new Date(ipData.retryAfter)).toString());
            
            next(new RateLimitError(secondsTillReset));
            return;
        }

        // Increment the count if no guards have been tripped
        ipData.requestCount++;
    }
    else {
        // Initialize the IP in the store
        ipStore.set(ip, { retryAfter: Date.now() + getWindow(), requestCount: 1 })
    }

    // Set informative headers
    const ipData = ipStore.get(ip);
    
    res.setHeader("X-RateLimit-Limit", getRateLimit());
    res.setHeader("X-RateLimit-Remaining", getRateLimit() - ipData.requestCount);
    res.setHeader("X-RateLimit-Reset", (new Date(ipData.retryAfter)).toString());

    attemptCleanup();

    next();
}

function attemptCleanup(): void {
    // Attempt ipStore cleanup every 15 minutes
    const NUM_MINUTES_BETWEEN_CLEANUPS = 15;

    // Ensure 15 minutes have passed
        // Measured in ms
    if (Date.now() - lastIpStoreCheck < NUM_MINUTES_BETWEEN_CLEANUPS * 60 * 1000) {
        return;
    }

    // Delete entries older 
    ipStore.forEach((data, ip) => {
        if (Date.now() - data.retryAfter > getWindow()) {
            ipStore.delete(ip);
        }
    });

    lastIpStoreCheck = Date.now();
}

// Returns window size in ms
function getWindow(): number {
    if (process.env.RATE_LIMIT_WINDOW_MS) {
        return parseInt(process.env.RATE_LIMIT_WINDOW_MS);
    }
    
    // 15 minute default in case env cannot be found
    const DEFAULT_MINS = 15;
    return DEFAULT_MINS * 1000 * 60;
}

function getRateLimit(): number {
    if (process.env.RATE_LIMIT_MAX_REQUESTS) {
        return parseInt(process.env.RATE_LIMIT_MAX_REQUESTS);
    }

    // 100 request default in case env cannot be found
    return 100;
}