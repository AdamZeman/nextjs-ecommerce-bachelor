/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Page from '@/app/shipping/page';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import filterReducer from '@/redux/slices/filterSlice';
import basketReducer from '@/redux/slices/basketSlice';

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () =>
            Promise.resolve({

            }),
    }),
) as jest.Mock;

describe('Shipping', () => {
    it('Renders Shipping page', async () => {
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
            reducer: {
                filter: filterReducer,
                basket: basketReducer
            },
        });

        render(
            <SessionProvider session={mockSession as any}>
                <Provider store={store}>
                    <Page />
                </Provider>
            </SessionProvider>,
        );

        const element = await screen.findByText('Extra Notes');
        expect(element).toBeInTheDocument();
    });
});
