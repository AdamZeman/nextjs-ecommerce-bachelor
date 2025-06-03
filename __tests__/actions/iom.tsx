import { POST as POST1 } from '@/app/api/iom/product/AddProduct/route';
import { POST as POST2 } from '@/app/api/iom/product/EditProduct/route';
import { runTestCases } from '@/testUtils/utils';
import * as queries from '@/db/goqueries/query_sql';
import { getDbConnection } from '@/lib/db';

jest.mock('@/db/goqueries/query_sql');
jest.mock('@/lib/db');

const testCases1 = [
    {
        name: 'success - create product with valid data',
        body: {
            name: "Test Product",
            description: "Test Description",
            price: "100",
            option_1Name: "Color",
            option_2Name: "Size",
            special: "1"
        },
        mockSetup: () => {
            (getDbConnection as jest.Mock).mockResolvedValue({ release: jest.fn() });
            (queries.insertProduct as jest.Mock).mockResolvedValue({});
        },
        expectedStatus: 200,
        expectedResponse: {}
    },
    {
        name: 'fail - missing required fields',
        body: {
            name: "",
            description: "",
            price: "100",
            option_1Name: "",
            option_2Name: ""
        },
        mockSetup: () => {},
        expectedStatus: 400,
        expectedResponse: {
            error: 'Invalid input'
        }
    },
    {
        name: 'fail - invalid price',
        body: {
            name: "Test",
            description: "Test",
            price: "-100",
            option_1Name: "Color",
            option_2Name: "Size",
            special: "1"
        },
        mockSetup: () => {},
        expectedStatus: 400,
        expectedResponse: {
            error: 'Invalid input'
        }
    },
    {
        name: 'fail - database error',
        body: {
            name: "Test Product",
            description: "Test Description",
            price: "100",
            option_1Name: "Color",
            option_2Name: "Size",
            special: "1"
        },
        mockSetup: () => {
            (getDbConnection as jest.Mock).mockResolvedValue({ release: jest.fn() });
            (queries.insertProduct as jest.Mock).mockRejectedValue(new Error("DB error"));
        },
        expectedStatus: 500,
        expectedResponse: { error: 'Error adding' }
    }
];


const testCases2 = [
    {
        name: 'success - update product with valid data',
        body: {
            productId: 1,
            name: "Updated Product",
            description: "Updated Description",
            price: "200",
            option_1Name: "Updated Color",
            option_2Name: "Updated Size",
            special: "2"
        },
        mockSetup: () => {
            (getDbConnection as jest.Mock).mockResolvedValue({ release: jest.fn() });
            (queries.updateProduct as jest.Mock).mockResolvedValue({});
        },
        expectedStatus: 200,
        expectedResponse: {}
    },

    {
        name: 'fail - missing required fields',
        body: {
            productId: 1,
            name: "",
            description: "",
            price: "200",
            option_1Name: "",
            option_2Name: "Size"
        },
        mockSetup: () => {},
        expectedStatus: 400,
        expectedResponse: { error: 'Invalid input' }
    },
    {
        name: 'fail - invalid productId (zero)',
        body: {
            productId: 0,
            name: "Product",
            description: "Description",
            price: "200",
            option_1Name: "Color",
            option_2Name: "Size",
            special: "1"
        },
        mockSetup: () => {},
        expectedStatus: 400,
        expectedResponse: { error: 'Invalid input' }
    },
    {
        name: 'fail - negative price',
        body: {
            productId: 1,
            name: "Product",
            description: "Description",
            price: "-100",
            option_1Name: "Color",
            option_2Name: "Size",
            special: "1"
        },
        mockSetup: () => {},
        expectedStatus: 400,
        expectedResponse: { error: 'Invalid input' }
    },

    {
        name: 'fail - database error',
        body: {
            productId: 1,
            name: "Product",
            description: "Description",
            price: "100",
            option_1Name: "Color",
            option_2Name: "Size",
            special: "1"
        },
        mockSetup: () => {
            (getDbConnection as jest.Mock).mockResolvedValue({ release: jest.fn() });
            (queries.updateProduct as jest.Mock).mockRejectedValue(new Error("DB error"));
        },
        expectedStatus: 500,
        expectedResponse: { error: 'Failed to update variant' }
    },
];

describe('Create Product POST handler', () => {
    runTestCases(POST1, testCases1);
});

describe('Create Product POST handler', () => {
    runTestCases(POST2, testCases2);
});