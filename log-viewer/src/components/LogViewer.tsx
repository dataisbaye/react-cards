import {ReactElement} from "react";
import {useDispatch, useSelector} from "react-redux";
import LogLine from "./LogLine.tsx";
import {Gear} from "react-bootstrap-icons";
import {LogViewerState} from "../redux/logViewerState.ts";
import Button from "react-bootstrap/Button";
import * as actions from "../redux/actions.ts";

const LogViewer = (): ReactElement => {
    // State
    const dispatch = useDispatch();
    const logLineIds = useSelector((state: LogViewerState) => state.logLineIds);
    const backgroundColor = useSelector((state: LogViewerState) => state.backgroundColor);

    // Effects



    // Rendering
    const style = {
        backgroundColor: backgroundColor,
    };

    const renderSettingsButton = () => {
        return (
            <Button
                variant="primary"
                onClick={() => dispatch(actions.openSettings())}
            >
                <Gear />
            </Button>
        );
    }

    const renderLogLines = () => {
        return logLineIds.map((id: string) => {
            return (
                <LogLine
                    key={id}
                    logLineId={id}
                />
            );
        });
    }

    return (
        <div className={'log-viewer'} style={style}>
            <div className={'log-viewer-header'}>
                <div className="settings-opener">
                    <a href="#" data-toggle="modal" data-target="#settings-modal">
                        {renderSettingsButton()}
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