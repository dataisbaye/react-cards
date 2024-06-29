import {ReactElement} from "react";
import LogLine from "./LogLine.tsx";
import {Gear} from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import * as actions from "../redux/actions.ts";
import {useAppDispatch, useAppSelector} from "../redux/hooks.ts";

const LogViewer = (): ReactElement => {
    // State
    const dispatch = useAppDispatch();
    const logLineIds = useAppSelector((state) => state.logLineIds);
    const backgroundColor = useAppSelector((state) => state.backgroundColor);

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