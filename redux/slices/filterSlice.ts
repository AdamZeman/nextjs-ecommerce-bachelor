import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
    categories: number[];
    price: {
        from: number | null;
        to: number | null;
    };
    special: number[];
    name: string
}

const initialState: FilterState = {
    categories: [],
    price: {
        from: null,
        to: null,
    },
    special: [],
    name: ""
};

export const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        toggleCategory(state, action: PayloadAction<number>) {
            const id = action.payload;
            if (state.categories.includes(id)) {
                state.categories = state.categories.filter(cat => cat !== id);
            } else {
                state.categories.push(id);
            }
        },
        toggleSpecial(state, action: PayloadAction<number>) {
            const id = action.payload;
            if (state.special.includes(id)) {
                state.special = state.special.filter(spec => spec !== id);
            } else {
                state.special.push(id);
            }
        },
        setPriceFrom(state, action: PayloadAction<number | null>) {
            state.price.from = action.payload;
        },
        setPriceTo(state, action: PayloadAction<number | null>) {
            state.price.to = action.payload;
        },
        setNameTo(state, action: PayloadAction<string>) {
            state.name = action.payload;
        },
    },
});

export const filterState = (state: { filter: FilterState }) => state.filter

export default filterSlice.reducer;


export const {
    toggleCategory,
    toggleSpecial,
    setPriceFrom,
    setPriceTo,
    setNameTo
} = filterSlice.actions;