import {ReactElement, useEffect, useRef, useState} from "react";
import LogLine from "./LogLine.tsx";
import LogLineModule from "../models/logLine.ts";
import {Gear} from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import * as actions from "../redux/actions.ts";
import {useAppDispatch, useAppSelector} from "../redux/hooks.ts";
import {VariableSizeList} from "react-window";
import ColorModeEnum from "../enums/colorMode.ts";

const LogViewer = (): ReactElement => {
    // State
    const listRef = useRef(null);
    const dispatch = useAppDispatch();
    const logLineIds = useAppSelector((state) => state.logLineIds);
    const idToLogLine = useAppSelector((state) => state.idToLogLine);
    const colorMode = useAppSelector((state) => state.colorMode);
    const hideColorModeDetail = useAppSelector((state) => state.hideColorModeDetail);
    const backgroundColor = useAppSelector((state) => state.backgroundColor);
    const reverse = useAppSelector((state) => state.reverse);
    const selectedSources = useAppSelector((state) => state.selectedSources);
    const logSourceConfigs = useAppSelector((state) => state.logSourceConfigs);
    const timestampFormat = useAppSelector((state) => state.timestampFormat);

    const logViewerRef = useRef(null);
    const [logViewerWidth, setLogViewerWidth] = useState(0);
    useEffect(() => {
        if (logViewerRef.current) {
            console.log(document.querySelector('body').getBoundingClientRect().width);
            setLogViewerWidth(logViewerRef.current.offsetWidth);
        }
    }, [logViewerRef?.current?.offsetWidth]);

    let maxSourceLength = selectedSources.reduce((max, source) => Math.max(max, source.length), 0);

    let visibleLogLineIds = logLineIds.filter((id) => {
        let logLine = idToLogLine[id];
        return LogLineModule.isVisible(
            logLine,
            logSourceConfigs,
            Array.from(selectedSources),
            new Set(logSourceConfigs[logLine.source].levels),
        );
    });

    visibleLogLineIds = reverse ? visibleLogLineIds : visibleLogLineIds.reverse();

    useEffect(() => {
        if (listRef.current) {
            listRef.current.resetAfterIndex(0);
        }
    }, [visibleLogLineIds.length]);

    // Rendering
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

    const FixedSizeListLogLine = ({index, style}) => {
        return (
            <LogLine
                logLineId={visibleLogLineIds[index]}
                listItemStyle={style}
                maxSourceLength={maxSourceLength}
            />
        );
    };

    function calculateTextHeight(index: number, width: number, fontFamily: string, fontSize: number) {
        let logLineId = visibleLogLineIds[index];
        let logLine = idToLogLine[logLineId];
        let maxSourcePlaceholder = '-'.repeat(!hideColorModeDetail || colorMode === ColorModeEnum.LEVEL ? maxSourceLength : 0);
        let text = `${timestampFormat} ${maxSourcePlaceholder} + ${logLine.message}`

        // Create a hidden div element
        const element = document.createElement('div');

        // Set the div properties
        element.style.position = 'absolute';
        element.style.left = '0px';
        element.style.top = '0px';
        element.style.width = `${width}px`;
        element.style.fontFamily = fontFamily;
        element.style.fontSize = `${fontSize}px`;
        element.style.whiteSpace = 'pre-wrap';
        element.style.lineHeight = '1.5'; // TODO gross hardcoding

        // Set the text
        element.textContent = text;

        // Add the div to the body
        document.body.appendChild(element);

        // Measure the height
        const height = element.getBoundingClientRect().height;

        // Remove the div
        document.body.removeChild(element);

        // Return the height
        return height;
    }

    const fontFamily = "'Courier New', Courier, monospace";
    const fontSize = 12;
    const style = {
        fontSize: fontSize,
        fontFamily: fontFamily,
        backgroundColor: backgroundColor,
    };

    const itemSize = (index: number) => calculateTextHeight(
        index,
        logViewerWidth,
        fontFamily,
        fontSize,
    );

    return (
        <div className={'log-viewer'} style={style} ref={logViewerRef}>
            <div className={'log-viewer-header'}>
                <div className="settings-opener">
                    <a href="#" data-toggle="modal" data-target="#settings-modal">
                        {renderSettingsButton()}
                    </a>
                </div>
            </div>
            <VariableSizeList
                ref={listRef}
                className="log-lines"
                height={1000}
                itemCount={visibleLogLineIds.length}
                itemSize={itemSize}
                width={"100%"}
            >
                {FixedSizeListLogLine}
            </VariableSizeList>
        </div>
    );
}

export default LogViewer;