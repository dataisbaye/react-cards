/* eslint-disable @typescript-eslint/no-namespace */
import React, { useRef } from "react";
import { ReactCardProps } from "./utilities/createReactCard";
import LogViewer from "./components/LogViewer";
import indexCSS from './css/index.css?inline';
import SettingsModal from "./components/SettingsModal.tsx";
import bootstrapCSS from 'bootstrap/dist/css/bootstrap.min.css?inline';
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
	const modalRef = useRef(null);

	return (
		<div className={"shadow-dom-body"}>
			<style>{bootstrapCSS}</style>
			<style>{indexCSS}</style>
			<div data-bs-theme={"light"}>
				<Provider store={store}>
					<ha-card>
						<LogViewer />
						<div id={"log-viewer-modal-container"} ref={modalRef}></div>
						<SettingsModal cardName={cardName} modalRef={modalRef} />
					</ha-card>
				</Provider>
			</div>
		</div>
	);
}

export default App;
