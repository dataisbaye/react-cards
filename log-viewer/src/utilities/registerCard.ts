import { signal } from "@preact/signals-react";
import cardStates from "../cardStates";
import createReactCard, { ReactCardProps } from "./createReactCard";
import {EnhancedStore, StoreEnhancer, ThunkDispatch, Tuple, UnknownAction} from "@reduxjs/toolkit";
import {LogViewerState} from "../redux/logViewerState.ts";
import {ActionTypes} from "../redux/actions.ts";

export default function registerCard(
	cardName: string,
	component: React.ElementType,
	store:  EnhancedStore<LogViewerState, ActionTypes, Tuple<[StoreEnhancer<{dispatch: ThunkDispatch<LogViewerState, undefined, UnknownAction>}>, StoreEnhancer]>>,
) {
	if (!cardStates.value[cardName]) {
		const signals = {
			hass: signal({}),
			config: signal({}),
			cardSize: signal(1),
			cardName,
		} as const satisfies ReactCardProps;
		cardStates.value = { ...cardStates.value, [cardName]: signals } as const;
	}

	const ReactNode = createReactCard(component, cardStates.value[cardName], store);
	customElements.define(cardName, ReactNode);
	console.info("Registered:", cardName);
}
