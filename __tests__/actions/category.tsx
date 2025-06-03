import { POST } from '@/app/api/products/ShowProducts/route';
import { runTestCases } from '@/testUtils/utils';
import * as queries from '@/db/goqueries/query_sql';
import { getDbConnection } from '@/lib/db';
import { getServerSession } from 'next-auth';

jest.mock('@/db/goqueries/query_sql');
jest.mock('@/lib/db');
jest.mock('next-auth', () => ({ getServerSession: jest.fn() }));

const testCases = [
    {
        name: 'success - filter products with all parameters',
        body: {
            nameFilter: "T-shirt",
            categoryIds: [1, 2],
            specialIds: [3],
            priceFrom: 10,
            priceTo: 100,
            page: 2,
            limit: 20
        },
        mockSetup: () => {
            (getServerSession as jest.Mock).mockResolvedValue({ user: { id: 123 } });
            (getDbConnection as jest.Mock).mockResolvedValue({ release: jest.fn() });
            (queries.getProductsByCategoriesAndName as jest.Mock).mockResolvedValue([{ id: 1, name: "Red T-shirt" }]);
            (queries.getCategories as jest.Mock).mockResolvedValue([{ id: 1, name: "Clothing" }]);
            (queries.getSpecial as jest.Mock).mockResolvedValue([{ id: 3, name: "Sale" }]);
            (queries.getProductCategoriesManyToMany as jest.Mock).mockResolvedValue([{ productId: 1, categoryId: 1 }]);
        },
        expectedStatus: 200,
        expectedResponse: {
            products: [{ id: 1, name: "Red T-shirt" }],
            categories: [{ id: 1, name: "Clothing" }],
            special: [{ id: 3, name: "Sale" }],
            productCategory: [{ productId: 1, categoryId: 1 }]
        }
    },
    {
        name: 'success - filter products with minimal parameters',
        body: {
            nameFilter: "",
            page: 1
        },
        mockSetup: () => {
            (getServerSession as jest.Mock).mockResolvedValue({ user: { id: 123 } });
            (getDbConnection as jest.Mock).mockResolvedValue({ release: jest.fn() });
            (queries.getProductsByCategoriesAndName as jest.Mock).mockResolvedValue([{ id: 2, name: "Blue Jeans" }]);
            (queries.getCategories as jest.Mock).mockResolvedValue([]);
            (queries.getSpecial as jest.Mock).mockResolvedValue([]);
            (queries.getProductCategoriesManyToMany as jest.Mock).mockResolvedValue([]);
        },
        expectedStatus: 200,
        expectedResponse: {
            products: [{ id: 2, name: "Blue Jeans" }],
            categories: [],
            special: [],
            productCategory: []
        }
    },
    {
        name: 'fail - invalid categoryIds (not array of numbers)',
        body: {
            categoryIds: "not-an-array",
            page: 1
        },
        mockSetup: () => {},
        expectedStatus: 400
    },
    {
        name: 'fail - invalid priceFrom (negative number)',
        body: {
            priceFrom: -10,
            page: 1
        },
        mockSetup: () => {},
        expectedStatus: 400
    },
    {
        name: 'fail - database error',
        body: {
            page: 1
        },
        mockSetup: () => {
            (getServerSession as jest.Mock).mockResolvedValue({ user: { id: 123 } });
            (getDbConnection as jest.Mock).mockResolvedValue({ release: jest.fn() });
            (queries.getProductsByCategoriesAndName as jest.Mock).mockRejectedValue(new Error("DB error"));
        },
        expectedStatus: 500,
        expectedResponse: { error: 'Failed to fetch data' }
    },
    {
        name: 'success - unauthenticated user (userId = 0)',
        body: {
            page: 1
        },
        mockSetup: () => {
            (getServerSession as jest.Mock).mockResolvedValue(null);
            (getDbConnection as jest.Mock).mockResolvedValue({ release: jest.fn() });
            (queries.getProductsByCategoriesAndName as jest.Mock).mockResolvedValue([{ id: 3, name: "Generic Product" }]);
        },
        expectedStatus: 200,
        expectedResponse: {
            products: [{ id: 3, name: "Generic Product" }],
            categories: [],
            special: [],
            productCategory: []
        }
    }
];

describe('FilterProducts POST handler', () => {
    runTestCases(POST, testCases);
});