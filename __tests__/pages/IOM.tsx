/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Page from '@/app/iom/page';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import filterReducer from '@/redux/slices/filterSlice';

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () =>
            Promise.resolve({
                products: [{
                    id: 1,
                    name: "",
                    description: "",
                    price: 50,
                    option_1Name: "",
                    option_2Name: ""
                }],
            }),
    }),
) as jest.Mock;

describe('Category', () => {
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

        const cell = await screen.findByText('0.50');
        expect(cell).toBeInTheDocument();
    });
});
