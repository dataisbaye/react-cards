import {ReactElement} from "react";
import {useSelector} from "react-redux";
import LogLineModel from "../models/logLine.ts";
import LogLine from "./LogLine.tsx";
import {Gear} from "react-bootstrap-icons";
import {LogViewerState} from "../redux/logViewerState.ts";

const LogViewer = (): ReactElement => {
    // Use calls
    const logLines = useSelector((state: LogViewerState) => state.logLines);
    const backgroundColor = useSelector((state: LogViewerState) => state.backgroundColor);

    // Rendering
    const style = {
        backgroundColor: backgroundColor,
    };

    const renderLogLines = () => {
        return logLines.map((logLine: LogLineModel) => {
            return (
                <LogLine key={logLine.id} logLine={logLine} />
            );
        });
    }

    return (
        <div style={style}>
            <div className={'log-viewer-header'}>
                <div className="settings-opener">
                    <a href="#" data-toggle="modal" data-target="#settings-modal">
                        <Gear />
                    </a>
                </div>
            </div>
            <div className="log-lines">
                {renderLogLines()}
            </div>
        </div>
    );
}

export default LogViewer;