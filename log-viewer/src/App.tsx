/* eslint-disable @typescript-eslint/no-namespace */
import React, { useRef } from "react";
import { ReactCardProps } from "./utilities/createReactCard";
import LogViewer from "./components/LogViewer";
import './css/index.css';
import SettingsModal from "./components/SettingsModal.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';

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

function App({ }: ReactCardProps) {
	const renderRef = useRef(0);
	renderRef.current++;

	return (
		<ha-card>
			<LogViewer />
			<SettingsModal />
		</ha-card>
	);
}

export default App;
