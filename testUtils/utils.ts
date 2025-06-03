import { getServerSession } from 'next-auth';
import { getDbConnection } from '@/lib/db';

const mockClient = {
    release: jest.fn(),
};
jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}));
jest.mock('@/lib/db', () => ({
    getDbConnection: jest.fn(),
}));
type TestCase = {
    name: string;
    body: object;
    mockSetup: () => void;
    expectedStatus: number;
    expectedResponse?: any;
};
type HandlerFunction = (req: any) => Promise<Response>;
export function runTestCases(
    handler: HandlerFunction,
    testCases: TestCase[],
    options?: { userId?: number }
) {
    beforeEach(() => {
        jest.clearAllMocks();
        (getServerSession as jest.Mock).mockResolvedValue({
            user: { id: options?.userId ?? 123 },
        });
        (getDbConnection as jest.Mock).mockResolvedValue(mockClient);
    });

    for (const testCase of testCases) {
        it(testCase.name, async () => {
            testCase.mockSetup();

            const req = {
                json: async () => testCase.body,
            } as any;

            const res = await handler(req);

            expect(res.status).toBe(testCase.expectedStatus);

            if (testCase.expectedResponse) {
                const data = await res.json();
                expect(data).toEqual(testCase.expectedResponse);
            }
        });
    }
}
