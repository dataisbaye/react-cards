/* eslint-disable @typescript-eslint/no-namespace */
import React, { useRef } from "react";
import { ReactCardProps } from "./utilities/createReactCard";
import LogViewer from "./components/LogViewer";
import './css/index.css';
import SettingsModal from "./components/SettingsModal.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import {store} from "./redux/store.ts";
import {Provider} from "react-redux";

declare global {
	namespace JSX {
		interface IntrinsicElements {
			"ha-card": React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement>,
				HTMLElement
			>;
		}
	}
}

function App({ cardName }: ReactCardProps) {
	const renderRef = useRef(0);
	renderRef.current++;

	return (
		<Provider store={store}>
			<ha-card>
				<LogViewer />
				<SettingsModal cardName={cardName} />
			</ha-card>
		</Provider>
	);
}

export default App;
