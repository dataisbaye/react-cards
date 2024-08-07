import {ReactElement} from "react";
import ColorModeEnum from "../enums/colorMode.ts";
import DupeModeEnum from "../enums/dupeMode.ts";
import moment from "moment";
import {LogLevelColorEnum} from "../enums/logLevel.ts";
import {toggleExpandCollapse} from "../redux/actions.ts";
import {ToggleExpandCollapsePayload} from "../redux/types.ts";
import LogLineModule from "../models/logLine.ts";
import {useAppDispatch, useAppSelector} from "../redux/hooks.ts";

type LogLineProps = {
    logLineId: string;
    listItemStyle: any;
    maxSourceLength: number;
}

const LogLine = ({ logLineId, listItemStyle, maxSourceLength }: LogLineProps ): ReactElement => {
    let dispatch = useAppDispatch();
    let logLine = useAppSelector((state) => state.idToLogLine[logLineId]);
    let selectedSources = useAppSelector((state) => new Set(state.selectedSources));
    let backgroundColor = useAppSelector((state) => state.backgroundColor);
    let colorMode = useAppSelector((state) => state.colorMode);
    let hideColorModeDetail = useAppSelector((state) => state.hideColorModeDetail);
    let timestampFormat = useAppSelector((state) => state.timestampFormat);
    let logSourceConfigs = useAppSelector((state) => state.logSourceConfigs);
    let logSourceColors = useAppSelector((state) => state.logSourceColors);

    let hasLogSourceConfig = logSourceConfigs[logLine.source] !== undefined;
    let dupeMode = hasLogSourceConfig ? logSourceConfigs[logLine.source].dupeMode : DupeModeEnum.SHOW_FIRST;
    let levels = new Set(hasLogSourceConfig ? logSourceConfigs[logLine.source].levels : []);

    let isFirst = logLine.dupeIdBefore === null;
    let isLast =  logLine.dupeIdAfter === null;

    let hiddenColorModeTooltipText = () => {
        if (hideColorModeDetail) {
            if (colorMode === ColorModeEnum.LEVEL) {
                return logLine.level;
            } else if (colorMode === ColorModeEnum.SOURCE) {
                return logLine.source;
            }
        }
        return '';
    }

    let color = () => {
        if (colorMode === ColorModeEnum.LEVEL) {
            return LogLevelColorEnum[logLine.level];
        } else {
            return logSourceColors[logLine.source] ?? backgroundColor;
        }
    }

    let renderTimestamp = () => {
        if (timestampFormat === '') {
            return null;
        }

        let sourceTimestampFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
        return (
            <span title={hiddenColorModeTooltipText()}>
                {moment(logLine.timestamp, sourceTimestampFormat).format(timestampFormat)}
                {' '}
            </span>
        );
    }

    let renderExpandCollapseIcon = () => {
        return (
            <span>
                <span
                    onClick={() => {
                        dispatch(toggleExpandCollapse({
                            id: logLine.id,
                            expandIcon: LogLineModule.toggleExpandIcon(logLine, dupeMode),
                        } as ToggleExpandCollapsePayload));
                    }}
                >
                    {LogLineModule.expandIcon(logLine, dupeMode)}
                </span>
                <span>
                    {'\u00a0'}
                </span>
            </span>
        );
    }

    let renderSource = () => {
        if (hideColorModeDetail && colorMode === ColorModeEnum.SOURCE) {
            return null;
        }

        return (
            <span>
                {logLine.source.padEnd(maxSourceLength+1, ' ').replace(/ /g, '\u00a0')}
            </span>
        );
    }

    let renderLevel = () => {
        if (hideColorModeDetail && colorMode === ColorModeEnum.LEVEL) {
            return null;
        }

        return (
            <span>
                {logLine.level.padEnd(8, ' ').replace(/ /g, '\u00a0')}
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

    if (!hasLogSourceConfig
        || !selectedSources.has(logLine.source)
        || !levels.has(logLine.level)
        || moment(logLine.timestamp) < moment(logSourceConfigs[logLine.source].startTimestamp)
        || moment(logLine.timestamp) > moment(logSourceConfigs[logLine.source].endTimestamp)
        || (
            logLine.explicitExpandIcon === '+'
            && (
                (dupeMode === DupeModeEnum.SHOW_ALL && !isFirst && !isLast)
                || (dupeMode === DupeModeEnum.SHOW_FIRST && !isFirst)
                || (dupeMode === DupeModeEnum.SHOW_LAST && !isLast)
            )
        )
        || (
            logLine.explicitExpandIcon === ' '
            && (
                (dupeMode === DupeModeEnum.SHOW_FIRST && !isFirst)
                || (dupeMode === DupeModeEnum.SHOW_LAST && !isLast)
            )
        )
    ) {
        return null;
    }

    const style = {
        color: color(),
    };

    return (
        <div style={listItemStyle}>
            <div style={style}>
                {renderTimestamp()}
                {renderSource()}
                {renderLevel()}
                {renderExpandCollapseIcon()}
                {renderMessage()}
            </div>
        </div>
    );
}

export default LogLine;
