/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import Page from '@/app/orders/page';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import filterReducer from '@/redux/slices/filterSlice';

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () =>
            Promise.resolve({
                ordersFilled : [
                    {
                        order: { id: 1, status: 'pending' },
                        orderItems: [
                            {}
                        ]
                    },
                    {
                        order: { id: 2, status: 'completed' },
                        orderItems: [
                            {}
                        ]
                    },
                ]
            }),
    }),
) as jest.Mock;

describe('Category', () => {
    it('Renders Orders page', async () => {
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

        const text = await screen.findByText('#2');
        expect(text).toBeInTheDocument();

    });
});
