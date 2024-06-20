import {ReactElement} from "react";
import {ILogLine} from "../models/logLine";
import {LogViewerState} from "../redux/logViewerState.ts";
import {useSelector} from "react-redux";
import ColorMode from "../enums/colorMode.ts";
import DupeMode from "../enums/dupeMode.ts";
import moment from "moment";

type LogLineProps = {
    logLine: ILogLine;
}

const LogLine = ({ logLine }: LogLineProps ): ReactElement => {
    let selectedSources = useSelector((state: LogViewerState) => state.selectedSources);
    let colorMode = useSelector((state: LogViewerState) => state.colorMode);
    let hideColorModeDetail = useSelector((state: LogViewerState) => state.hideColorModeDetail);
    let hideTimestamps = useSelector((state: LogViewerState) => state.hideTimestamps);
    let hideTimestampYear = useSelector((state: LogViewerState) => state.hideTimestampYear);
    let logSourceConfigs = useSelector((state: LogViewerState) => state.logSourceConfigs);

    let hasLogSourceConfig = logSourceConfigs[logLine.source.name] !== undefined;
    let dupeMode = hasLogSourceConfig ? logSourceConfigs[logLine.source.name].dupeMode : DupeMode.SHOW_FIRST;

    let hiddenColorModeTooltipText = () => {
        if (hideColorModeDetail) {
            if (colorMode === ColorMode.LEVEL) {
                return logLine.level.name;
            } else if (colorMode === ColorMode.SOURCE) {
                return logLine.source.name;
            }
        }
        return '';
    }

    let renderTimestamp = () => {
        if (hideTimestamps) {
            return null;
        }

        let sourceTimestampFormat = 'YYYY-MM-DD HH:mm:ss';
        let targetTimestampFormat = hideTimestampYear ? 'MM-DD HH:mm:ss' : 'YYYY-MM-DD HH:mm:ss';
        return (
            <span title={hiddenColorModeTooltipText()}>
                {moment(logLine.timestamp, sourceTimestampFormat).format(targetTimestampFormat)}
                {' '}
            </span>
        );
    }

    let renderExpandCollapseIcon = () => {
        // TODO make these individually adjustable outside of overall state
        let hasDupe = logLine.dupeIdAfter !== null || logLine.dupeIdBefore !== null;

        let icon = ' ';
        if (hasDupe) {
            if (dupeMode === DupeMode.SHOW_ALL) {
                icon = '-';
            } else {
                icon = '+';
            }
        }

        return (
            <span>
                <span>
                    {icon}
                </span>
                <span>
                    {'\u00a0'}
                </span>
            </span>
        );
    }

    let renderSource = () => {
        if (hideColorModeDetail && colorMode === ColorMode.SOURCE) {
            return null;
        }

        let maxSourceLength = selectedSources.reduce((max, source) => Math.max(max, source.name.length), 0);

        return (
            <span>
                {logLine.source.name.padEnd(maxSourceLength+1, ' ').replace(/ /g, '\u00a0')}
            </span>
        );
    }

    let renderLevel = () => {
        if (hideColorModeDetail && colorMode === ColorMode.LEVEL) {
            return null;
        }

        return (
            <span>
                {logLine.level.name.padEnd(8, ' ').replace(/ /g, '\u00a0')}
            </span>
        );
    }

    let renderMessage = () => {
        return (
            <span>
                {logLine.message}
            </span>
        );
    }

    if (!hasLogSourceConfig) {
        return null;
    }

    return (
        <div>
            {renderTimestamp()}
            {renderSource()}
            {renderLevel()}
            {renderExpandCollapseIcon()}
            {renderMessage()}
        </div>
    );
}

export default LogLine;
