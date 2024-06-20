import React from 'react'
import ReactDOM from 'react-dom/client'
import App from "./App.tsx";
import registerCard from "./utilities/registerCard.ts";
import {ReactCardProps} from "./utilities/createReactCard.tsx";
import {signal} from "@preact/signals-react";
import {Provider} from "react-redux";
import store from "./redux/store.ts";

let cardName = 'log-viewer-card';

if (process.env.NODE_ENV !== 'development') {
    registerCard(cardName, App, store);
    //registerCard(`${cardName}-editor`, () => <div>Editor</div>, store);
} else {
    const signals = {
        hass: signal({}),
        config: signal({}),
        cardSize: signal(1),
        cardName,
    } as const satisfies ReactCardProps;

    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <Provider store={store}>
                <App
                    cardName={signals.cardName}
                    hass={signals.hass}
                    config={signals.config}
                    cardSize={signals.cardSize}
                />
            </Provider>
        </React.StrictMode>,
    )
}
