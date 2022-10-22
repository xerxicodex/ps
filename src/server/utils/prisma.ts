import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
}

let connection: any = null;

async function connectDB() {
    try {
        if (!connection) {
            connection = await prisma.$connect();
            console.log("? Database connected successfully");   
        }
    } catch (error) {
        console.log(error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.$disconnect();
        }
        connection = null;
    }
}

export default connectDB;
