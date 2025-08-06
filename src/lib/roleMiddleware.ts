import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./auth";

export function requireRole(allowedRoles: string[]) {
    return async (req: NextRequest) => {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const payload = verifyToken(token);
        if (!payload || !allowedRoles.includes(payload.role)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        return NextResponse.next();
    }
}