
import { POST as POST } from '@/app/api/basket/AddToBasket/route';
import { runTestCases } from '@/testUtils/utils';
import * as queries from '@/db/goqueries/query_sql';

jest.mock('@/db/goqueries/query_sql');
jest.mock('@/lib/db');
jest.mock('next-auth', () => ({ getServerSession: jest.fn() }));

const testCases1 = [
    {
        name: 'success add to basket',
        body: {variant:{id:10}, amount: 10},
        mockSetup: () => {
            (queries.getVariantByOptions as jest.Mock) = jest.fn().mockResolvedValue({ ID: 10, Price: 1000 });
            (queries.insertBasketItem as jest.Mock)= jest.fn().mockResolvedValue({ ID: 10 });
            (queries.getBasketItemsByUserId as jest.Mock)= jest.fn().mockResolvedValue([
                { ID: 1, UserID: 3, Quantity: 10, Price: 1000 },
            ]);
        },
        expectedStatus: 200,
    },
    {
        name: 'fail insufficient params',
        body: {variant:{id:10}},
        mockSetup: () => {
        },
        expectedStatus: 400,
    },
    {
        name: 'fail wrong type params',
        body: {variant:{id:10}, amount: "hello"},
        mockSetup: () => {
        },
        expectedStatus: 400,
    },
];

describe('AddToBasket POST handler', () => {
    runTestCases(POST, testCases1, { userId: 3 });
});


import { POST as POST2 } from '@/app/api/basket/RemoveFromBasket/route';


const testCases2 = [
    {
        name: 'success remove from basket',
        body: {basketItemId: 10},
        mockSetup: () => {
            (queries.removeFromBasket as jest.Mock) = jest.fn().mockResolvedValue({ id: 10 });
        },
        expectedStatus: 200,
    },
    {
        name: 'fail insufficient params',
        body: {},
        mockSetup: () => {
        },
        expectedStatus: 400,
    },

];


describe('RemoveFromBasket POST handler', () => {
    runTestCases(POST2, testCases2, { userId: 3 });
});
