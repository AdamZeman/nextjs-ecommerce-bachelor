import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {GetBasketItemsByUserIdRow} from "@/db/goqueries/query_sql";

interface BasketState {
    basketItems: GetBasketItemsByUserIdRow[];
}

const initialState: BasketState = {
    basketItems: []
};

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        addToBasket: (state: BasketState, action: PayloadAction<GetBasketItemsByUserIdRow>) => {
            state.basketItems.push(action.payload);
        },
        removeFromBasket: (state: BasketState, action: PayloadAction<number>) => {
            const index = action.payload
            if (index >= 0) {
                state.basketItems.splice(index, 1);
            } else {
                console.warn("Can't remove");
            }
        },
        setBasketItems: (state, action: PayloadAction<GetBasketItemsByUserIdRow[]>) => {
            state.basketItems = action.payload;
        }
    },
});

export const {
    addToBasket,
    removeFromBasket,
    setBasketItems
} = basketSlice.actions;

export const basketState = (state: { basket: BasketState }) => state.basket.basketItems

export const selectTotal = (state: { basket: BasketState }) => {
    return state.basket.basketItems.reduce((acc:number, item) => acc + item.price * item.quantity , 0)
}

export default basketSlice.reducer;
