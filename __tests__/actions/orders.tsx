import { GET } from '@/app/api/orders/ShowOrders/route';
import { getDbConnection } from '@/lib/db';
import * as queries from '@/db/goqueries/query_sql';
import { getServerSession } from 'next-auth';

export const mockOrder = {
    id: 1,
    userId: 123,
    status: 'completed',
    total: 1000
};

export const mockOrderItem = {
    id: 1,
    orderId: 1,
    productId: 101,
    quantity: 2,
    price: 500
};

jest.mock('@/db/goqueries/query_sql');
jest.mock('@/lib/db');
jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}));

describe('GET /api/orders/history', () => {
    const mockClient = {
        release: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (getDbConnection as jest.Mock).mockResolvedValue(mockClient);
    });

    it('should return orders with items for authenticated user', async () => {
        (getServerSession as jest.Mock).mockResolvedValue({ user: { id: 123 } });
        (queries.getOrdersByUserId as jest.Mock).mockResolvedValue([mockOrder]);
        (queries.getOrderItemsByUserId as jest.Mock).mockResolvedValue([mockOrderItem]);

        const response = await GET();

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            ordersFilled: [{
                order: mockOrder,
                orderItems: [mockOrderItem]
            }]
        });
        expect(queries.getOrdersByUserId).toHaveBeenCalledWith(mockClient, {
            userId: 123
        });
        expect(queries.getOrderItemsByUserId).toHaveBeenCalledWith(mockClient, {
            userId: 123
        });
        expect(mockClient.release).toHaveBeenCalled();
    });

    it('should return 401 for unauthenticated user', async () => {
        (getServerSession as jest.Mock).mockResolvedValue(null);

        const response = await GET();

        expect(response.status).toBe(401);
        expect(await response.json()).toEqual({ error: "Unauthorized" });
    });

    it('should handle empty order history', async () => {
        (getServerSession as jest.Mock).mockResolvedValue({ user: { id: 123 } });
        (queries.getOrdersByUserId as jest.Mock).mockResolvedValue([]);
        (queries.getOrderItemsByUserId as jest.Mock).mockResolvedValue([]);

        const response = await GET();

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            ordersFilled: []
        });
    });

    it('should return 500 on database error', async () => {
        (getServerSession as jest.Mock).mockResolvedValue({ user: { id: 123 } });
        (queries.getOrdersByUserId as jest.Mock).mockRejectedValue(new Error('DB error'));

        const response = await GET();

        expect(response.status).toBe(500);
        expect(await response.json()).toEqual({ error: 'Failed to fetch data' });
        expect(mockClient.release).toHaveBeenCalled();
    });

    it('should correctly associate items with orders', async () => {
        const orders = [
            { ...mockOrder, id: 1 },
            { ...mockOrder, id: 2 }
        ];
        const items = [
            { ...mockOrderItem, orderId: 1 },
            { ...mockOrderItem, orderId: 1 },
            { ...mockOrderItem, orderId: 2 }
        ];

        (getServerSession as jest.Mock).mockResolvedValue({ user: { id: 123 } });
        (queries.getOrdersByUserId as jest.Mock).mockResolvedValue(orders);
        (queries.getOrderItemsByUserId as jest.Mock).mockResolvedValue(items);

        const response = await GET();
        const data = await response.json();

        expect(data.ordersFilled).toHaveLength(2);
        expect(data.ordersFilled[0].orderItems).toHaveLength(2);
        expect(data.ordersFilled[1].orderItems).toHaveLength(1);
    });
});