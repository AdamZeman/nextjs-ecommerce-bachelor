import NextAuth from "next-auth";
import {GetOrderItemsByUserIdRow, GetOrdersByUserIdRow} from "@/db/goqueries/query_sql";

declare module "next-auth" {
    interface Session {
        user: {
            id: number;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            role: number;
            isSigned: boolean;
            avatarUrl:string
        };
    }
}

interface OrderFilled {
    order: GetOrdersByUserIdRow,
    orderItems: GetOrderItemsByUserIdRow[];
}
