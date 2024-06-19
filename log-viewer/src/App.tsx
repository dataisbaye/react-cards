/* eslint-disable @typescript-eslint/no-namespace */
import React, { useRef } from "react";
import { ReactCardProps } from "./utilities/createReactCard";
import LogViewer from "./components/LogViewer";

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
			<LogViewer></LogViewer>
		</ha-card>
	);
}

export default App;
