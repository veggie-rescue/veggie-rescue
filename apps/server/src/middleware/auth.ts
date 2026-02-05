export const authentication = (
    _req: Request
): number => {
    const authHeader = _req.headers.get('authorization');

    // Ensure that the header exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return 401;
    }

    // Extract request auth token and compare it with the access code
    const token = authHeader.split(' ')[1];
    if (token !== process.env.ACCESS_CODE) {
        return 401;
    }

    return 200;
}