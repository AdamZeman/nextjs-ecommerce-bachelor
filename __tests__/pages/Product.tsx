/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Page from '@/app/products/[productId]/page';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import filterReducer from '@/redux/slices/filterSlice';

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () =>
            Promise.resolve({
                product : [{}],
                isFavourite : true,
                option1Values : [{}],
                option2Values : [{}],
                reviews : [{}],
                relatedProducts : [{}],
                categories: [{}]
            }),
    }),
) as jest.Mock;

jest.mock('next/navigation', () => ({
    ...jest.requireActual('next/navigation'),
    useParams: () => ({ productId: '123' }),
}));

describe('Product', () => {
    it('Renders Product page', async () => {
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

        const element = await screen.findByText('Review this product');
        expect(element).toBeInTheDocument();


    });
});
