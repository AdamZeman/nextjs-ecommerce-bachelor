/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Page from '@/app/messenger/[convId]/page';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import filterReducer from '@/redux/slices/filterSlice';

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () =>
            Promise.resolve({
                messages: [{
                    email: "test@example.com",
                    content: "hello"
                }],
            }),
    }),
) as jest.Mock;

jest.mock('next/navigation', () => ({
    ...jest.requireActual('next/navigation'),
    useParams: () => ({ convId: '123' }),
}));

describe('Messenger', () => {
    it('Renders Category page', async () => {
        const mockSession = {
            user: {
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
                image: null,
                role: 0,
                isSigned: true,
                avatarUrl: '',
            },
            expires: '2099-01-01T00:00:00.000Z',
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

        const element = await screen.findByText('hello');
        expect(element).toBeInTheDocument();
    });
});
