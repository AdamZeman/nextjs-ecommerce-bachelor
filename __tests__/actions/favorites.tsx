import { POST } from '@/app/api/favourites/AddToFavourites/route';
import { runTestCases } from '@/testUtils/utils';
import * as queries from '@/db/goqueries/query_sql';
import { getDbConnection } from '@/lib/db';
import { getServerSession } from 'next-auth';

jest.mock('@/db/goqueries/query_sql');
jest.mock('@/lib/db');
jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}));

const testCases = [
    {
        name: 'success - add to favourites',
        body: { productId: "1" },
        mockSetup: () => {
            (getServerSession as jest.Mock).mockResolvedValue({ user: { id: 123 } });
            (getDbConnection as jest.Mock).mockResolvedValue({ release: jest.fn() });
            (queries.getFavouriteByProductId as jest.Mock).mockResolvedValue([]);
            (queries.insertItemToFavourites as jest.Mock).mockResolvedValue({});
        },
        expectedStatus: 200,
        expectedResponse: {}
    },
    {
        name: 'success - remove from favourites',
        body: { productId: 2 },
        mockSetup: () => {
            (getServerSession as jest.Mock).mockResolvedValue({ user: { id: 123 } });
            (getDbConnection as jest.Mock).mockResolvedValue({ release: jest.fn() });
            (queries.getFavouriteByProductId as jest.Mock).mockResolvedValue([{ id: 1 }]);
            (queries.removeItemFromFavourites as jest.Mock).mockResolvedValue({});
        },
        expectedStatus: 200,
        expectedResponse: {}
    },

    {
        name: 'fail - invalid productId (string)',
        body: { productId: "invalid" },
        mockSetup: () => {},
        expectedStatus: 400,
        expectedResponse: {
            error: 'Invalid input'
        }
    },
    {
        name: 'fail - missing productId',
        body: {},
        mockSetup: () => {},
        expectedStatus: 400,
        expectedResponse: {
            error: 'Invalid input'
        }
    },
    {
        name: 'fail - unauthorized',
        body: { productId: 1 },
        mockSetup: () => {
            (getServerSession as jest.Mock).mockResolvedValue(null);
        },
        expectedStatus: 401,
        expectedResponse: { error: "Unauthorized" }
    },
    {
        name: 'fail - database error on get',
        body: { productId: 1 },
        mockSetup: () => {
            (getServerSession as jest.Mock).mockResolvedValue({ user: { id: 123 } });
            (getDbConnection as jest.Mock).mockResolvedValue({ release: jest.fn() });
            (queries.getFavouriteByProductId as jest.Mock).mockRejectedValue(new Error("DB error"));
        },
        expectedStatus: 500,
        expectedResponse: { error: 'Failed to fetch data' }
    }
];

describe('Favourites POST handler', () => {
    runTestCases(POST, testCases);
});