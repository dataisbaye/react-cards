import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import {ReactElement} from "react";
import {useDispatch, useSelector} from "react-redux";
import {LogViewerState} from "../redux/logViewerState.ts";
import * as actions from "../redux/actions.ts";
import LogGenerator from "../models/logGenerator.ts";
import LogLevelEnum from "../enums/logLevel.ts";
import DupeModeEnum from "../enums/dupeMode.ts";
import moment from "moment";
import LogSourceConfig, {ILogSourceConfig} from "../models/logSourceConfig.ts";
import {addLogLines, addLogSourceConfig, setSelectedSources} from "../redux/actions.ts";
import LogSourceConfigAccordion from "./LogSourceConfigAccordion.tsx";
import LogSourceEnum from "../enums/logSource.ts";
import {LogSourceType} from "../models/types.ts";

type SettingsModalProps = {
}

const SettingsModal = ({}: SettingsModalProps): ReactElement => {
    let dispatch = useDispatch();
    let show = useSelector((state: LogViewerState) => state.showSettingsModal);

    let selectedSources = useSelector((state: LogViewerState) => state.selectedSources);

    // Timestamps
    let hideTimestamps = useSelector((state: LogViewerState) => state.hideTimestamps);
    let hideTimestampYear = useSelector((state: LogViewerState) => state.hideTimestampYear);

    // Color Mode
    let colorMode = useSelector((state: LogViewerState) => state.colorMode);
    let hideColorModeDetail = useSelector((state: LogViewerState) => state.hideColorModeDetail);
    let backgroundColor = useSelector((state: LogViewerState) => state.backgroundColor);

    // Source Configs
    let logSourceConfigs = useSelector((state: LogViewerState) => state.logSourceConfigs);



    let debounceDispatchHandler: string | number | NodeJS.Timeout;
    const debounceDispatch = (value: string) => {
        clearTimeout(debounceDispatchHandler);
        debounceDispatchHandler = setTimeout(() => {
            console.log('Dispatching background color change');
            dispatch(actions.setBackgroundColor(value));
        }, 1000);
    };

    const renderSourceDropdown = () => {
        let sources = Object.values(LogSourceEnum);
        sources = sources.sort((a: LogSourceType, b: LogSourceType) => a.localeCompare(b));
        let options = sources.map((source: LogSourceType) => {
            return (
                <option key={source} value={source}>{source}</option>
            );
        });

        return (
            <Form.Select
                multiple
                value={selectedSources.map((source) => source)}
                onChange={(event) => {
                    // TODO probably should be a thunk?
                    let selectedSourceNames = Array.from(event.target.selectedOptions).map((option) => option.value);
                    for (const source of selectedSourceNames) {
                        if (!logSourceConfigs[source]) {
                            // TODO get logs from generator instead of API for now
                            let logGenerator = new LogGenerator();
                            let levels = new Set(Object.values(LogLevelEnum));
                            let dupeMode = DupeModeEnum.SHOW_FIRST;
                            let startTimestamp = moment().subtract(1, 'days');
                            let endTimestamp = moment();
                            let logSourceConfig = LogSourceConfig.create(
                                source,
                                levels,
                                dupeMode,
                                startTimestamp.format(LogSourceConfig.timestampFormat),
                                endTimestamp.format(LogSourceConfig.timestampFormat),
                            );

                            let logs = logGenerator.generate(logSourceConfig, 100);
                            dispatch(addLogLines(logs));
                            dispatch(addLogSourceConfig(logSourceConfig));
                        }
                    }

                    dispatch(setSelectedSources(selectedSourceNames));
                }}
            >
                {options}
            </Form.Select>
        );
    }

    const renderGlobalSettingsFormAccordion = () => {
        return (
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Global Settings</Accordion.Header>
                    <Accordion.Body>
                        <div className={"modal-section"}>
                            <h6>Sources</h6>
                            <div className={"row"}>
                                <div className={"col col-12"}>
                                    {renderSourceDropdown()}
                                </div>
                            </div>
                        </div>
                        <div className={"modal-section"}>
                            <h6>Timestamps</h6>
                            <div className={"row"}>
                                <div className={"col col-6"}>
                                    <Form.Check
                                        id={"hide-timestamps"}
                                        className={"btn-check"}
                                        checked={hideTimestamps}
                                        onChange={(event) => {
                                            dispatch(actions.setHideTimestamps(event.target.checked));
                                        }}
                                    />
                                    <Form.Label
                                        className={`btn ${hideTimestamps ? 'btn-primary' : 'btn-outline-primary'}`}
                                        htmlFor={"hide-timestamps"}
                                    >
                                        Hide Timestamps
                                    </Form.Label>
                                </div>
                                <div className={"col col-6"}>
                                    <Form.Check
                                        id={"hide-timestamp-year"}
                                        className={"btn-check"}
                                        checked={hideTimestampYear}
                                        onChange={(event) => {
                                            dispatch(actions.setHideTimestampYear(event.target.checked));
                                        }}
                                    />
                                    <Form.Label
                                        className={`btn ${hideTimestampYear ? 'btn-primary' : 'btn-outline-primary'}`}
                                        htmlFor={"hide-timestamp-year"}
                                    >
                                        Hide Year
                                    </Form.Label>
                                </div>
                            </div>
                        </div>
                        <div className={"modal-section"}>
                            <h6>Color Mode</h6>
                            <div className={"row"}>
                                <div className={"col col-6"}>
                                    <Form.Select
                                        value={colorMode}
                                        onChange={(event) => {
                                            dispatch(actions.setColorMode(event.target.value));
                                        }}
                                    >
                                        <option value="level">Level</option>
                                        <option value="source">Source</option>
                                    </Form.Select>
                                </div>
                                <div className={"col col-6"}>
                                    <Form.Check
                                        id={"hide-color-mode-detail"}
                                        className={"btn-check"}
                                        checked={hideColorModeDetail}
                                        onChange={(event) => {
                                            dispatch(actions.setHideColorModeDetail(event.target.checked));
                                        }}
                                    />
                                    <Form.Label
                                        className={`btn ${hideColorModeDetail ? 'btn-primary' : 'btn-outline-primary'}`}
                                        htmlFor={"hide-color-mode-detail"}
                                    >
                                        Hide Detail
                                    </Form.Label>
                                </div>
                            </div>
                        </div>
                        <div className={"modal-section"}>
                            <h6>Background Color</h6>
                            <div className={"row"}>
                                <div className={"col col-12"}>
                                    <Form.Control
                                        type={"color"}
                                        value={backgroundColor}
                                        style={{width: '100%'}}
                                        onChange={(event) => {
                                            debounceDispatch(event.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        );
    }

    const renderSourceConfigFormAccordions = () => {
        return Object.values(logSourceConfigs).map((logSourceConfig: ILogSourceConfig) => {
            return (
                <LogSourceConfigAccordion key={logSourceConfig.nameHyphenated} logSourceConfig={logSourceConfig} />
            );
        });
    }

    return (
        <Modal
            show={show}
            onHide={() => dispatch(actions.closeSettings())}
        >
            <Modal.Header closeButton>
                <Modal.Title>Settings</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {renderGlobalSettingsFormAccordion()}
                {renderSourceConfigFormAccordions()}
            </Modal.Body>
        </Modal>
    );
}

export default SettingsModal;