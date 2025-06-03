

/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Page from '@/app/category/page';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import filterReducer from '@/redux/slices/filterSlice';
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () =>
            Promise.resolve({
                products: [],
                categories: ['a', 'b', 'c'],
                special: [],
            }),
    }),
) as jest.Mock;
class IntersectionObserverMock implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin = '';
    readonly thresholds: ReadonlyArray<number> = [];
    constructor(
        public callback: IntersectionObserverCallback,
        public options?: IntersectionObserverInit,
    ) {}
    observe = jest.fn();unobserve = jest.fn();disconnect = jest.fn();takeRecords = jest.fn(() => []);
}
Object.defineProperty(global, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserverMock,
});

describe('Category', () => {
    it('Renders Category page', async () => {
        const mockSession = {
            user: {
                id: 1, name: 'Test User', email: 'test@example.com', image: null,
                role: 0, isSigned: true, avatarUrl: '',
            }, expires: '2099-01-01T00:00:00.000Z',
        };
        const store = configureStore({
            reducer: { filter: filterReducer },
        });
        render(
            <SessionProvider session={mockSession as any}>
                <Provider store={store}>
                    <Page />
                </Provider>
            </SessionProvider>,
        );
        const headings = await screen.findAllByRole('heading', { level: 3 });
        expect(headings).toHaveLength(3);
    });
});


