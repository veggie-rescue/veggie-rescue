export const corsOptions = {
    "origin": getOrigins(),
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allowedHeaders": ["Content-Type", "Authorization"],
    "credentials": true,
    "maxAge": 86400
}

// Parse comma-delimited list of origins
function getOrigins(): string[] {
    return process.env.CORS_ALLOWED_ORIGINS?.split(',') || ['http://localhost:3001'];
}