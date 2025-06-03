'use client';

import {persistor, store} from "@/redux/store";
import { Provider } from "react-redux";
import React from "react";
import {persistStore} from "redux-persist"
import { PersistGate } from "redux-persist/integration/react";
import {SessionProvider} from "next-auth/react";


persistStore(store)
function ProviderWrapper({ children }: { children: React.ReactNode }){
    return(
        <SessionProvider>
            <Provider store={store}>
                    <PersistGate
                        loading={<div></div>}
                        persistor={persistor}
                    >
                        {children}
                    </PersistGate>
            </Provider>
        </SessionProvider>
    )
}

export default ProviderWrapper
