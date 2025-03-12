import { verify } from "./jwtService";

export const authenticate = (req: any, res: any, next: any) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        req.user = verify(token);
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
};

export const authorize = (role: string) => (req: any, res: any, next: any) => {
    if (req.user.role !== role) return res.status(403).json({ error: "Forbidden" });
    next();
};
