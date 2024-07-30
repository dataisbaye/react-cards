import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import {ReactElement} from "react";
import * as actions from "../redux/actions.ts";
import LogLevelEnum from "../enums/logLevel.ts";
import DupeModeEnum from "../enums/dupeMode.ts";
import moment from "moment";
import LogSourceConfig, {ILogSourceConfig} from "../models/logSourceConfig.ts";
import LogSourceConfigAccordion from "./LogSourceConfigAccordion.tsx";
import LogSourceEnum from "../enums/logSource.ts";
import {LogSourceType} from "../models/types.ts";
import {useAppDispatch, useAppSelector} from "../redux/hooks.ts";
import {updateBackgroundColor, updateColorMode, updateLogs} from "../redux/thunks.ts";
import {useComputed} from "@preact/signals-react";
import cardStates from "../cardStates.ts";

type SettingsModalProps = {
    cardName: string;
    modalRef: any;
}

const SettingsModal = ({cardName, modalRef}: SettingsModalProps): ReactElement => {
    console.log('SettingsModal');
    let dispatch = useAppDispatch();
    let show = useAppSelector((state) => state.showSettingsModal);

    let selectedSources = useAppSelector((state) => state.selectedSources);

    // Time Range
    let startTimestamp = useAppSelector((state) => state.startTimestamp);
    let endTimestamp = useAppSelector((state) => state.endTimestamp);

    // Timestamps
    let timestampFormat = useAppSelector((state) => state.timestampFormat);
    let reverse = useAppSelector((state) => state.reverse);

    // Color Mode
    let colorMode = useAppSelector((state) => state.colorMode);
    let hideColorModeDetail = useAppSelector((state) => state.hideColorModeDetail);
    let backgroundColor = useAppSelector((state) => state.backgroundColor);

    // Source Configs
    let logSourceConfigs = useAppSelector((state) => state.logSourceConfigs);

    const fallback = {
        hass: {
            value: {
                states: {
                    apiUrl: {
                        state: 'https://example.com'
                    },
                    apiToken: {
                        state:'example-token'
                    },
                }
            },
        }
    };

    const apiUrl = useComputed(() => {
        const { hass } = cardStates.value[cardName] || fallback;
        return (hass.value as any).states['input_text.api_url']?.state;
    });

    const apiToken = useComputed(() => {
        const { hass } = cardStates.value[cardName] || fallback;
        return (hass.value as any).states['input_text.api_token']?.state;
    });

    let debounceDispatchHandler: string | number | NodeJS.Timeout;
    const debounceDispatch = (value: string) => {
        clearTimeout(debounceDispatchHandler);
        debounceDispatchHandler = setTimeout(() => {
            console.log('Dispatching background color change');
            dispatch(updateBackgroundColor(value));
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
            <select
                multiple
                className={"form-control"}
                value={selectedSources.map((source) => source)}
                onChange={(event) => {
                    console.log('Selected sources changed');
                    let selectedSourceNames = Array.from(event.target.selectedOptions).map((option) => option.value);
                    for (const source of selectedSourceNames) {
                        if (!logSourceConfigs[source]) {
                            let levels = new Set(Object.values(LogLevelEnum));
                            let dupeMode = DupeModeEnum.SHOW_FIRST;
                            let logSourceConfig = LogSourceConfig.create(
                                source,
                                levels,
                                dupeMode,
                                startTimestamp,
                                endTimestamp,
                            );

                            dispatch(updateLogs(source, apiUrl.value, apiToken.value, logSourceConfig));
                        }
                    }
                }}
            >
                {options}
            </select>
        );
    }

    const renderStartTimestampInput = () => {
        return (
            <Form.Control
                type={"datetime-local"}
                name={"startTimestamp"}
                value={startTimestamp}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    dispatch(actions.setStartTimestamp(event.target.value));
                }}
            />
        );
    }

    const renderEndTimestampInput = () => {
        return (
            <Form.Control
                type={"datetime-local"}
                name={"endTimestamp"}
                value={endTimestamp}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    dispatch(actions.setEndTimestamp(event.target.value));
                }}
            />
        );
    }

    const renderGlobalSettingsFormAccordion = () => {
        let now = moment();
        let timestampFormats = [
            'YYYY-MM-DD HH:mm:ss.SSS',
            'YYYY-MM-DD HH:mm:ss',
            'MM-DD HH:mm:ss.SSS',
            'MM-DD HH:mm:ss',
            'HH:mm:ss.SSS',
            'HH:mm:ss',
        ];
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
                            <h6>Default Time Range</h6>
                            <div className={"row"}>
                                <div className={"col col-12"}>
                                    {renderStartTimestampInput()}
                                </div>
                            </div>
                            <div className={"row"}>
                                <div className={"col col-12"}>
                                    {renderEndTimestampInput()}
                                </div>
                            </div>
                        </div>
                        <div className={"modal-section"}>
                            <h6>Timestamps</h6>
                            <div className={"row"}>
                                <div className={"col col-6"}>
                                    <Form.Select
                                        value={timestampFormat}
                                        onChange={(event) => {
                                            dispatch(actions.setTimestampFormat(event.target.value));
                                        }}
                                    >
                                        {timestampFormats.map((format) => {
                                            return (
                                                <option key={format} value={format}>{now.format(format)}</option>
                                            );
                                        })}
                                        <option key="" value="">None</option>
                                    </Form.Select>
                                </div>
                                <div className={"col col-6"}>
                                    <Form.Check
                                        id={"reverse"}
                                        className={"btn-check"}
                                        checked={reverse}
                                        onChange={(event) => {
                                            dispatch(actions.setReverse(event.target.checked));
                                        }}
                                    />
                                    <Form.Label
                                        className={`btn ${reverse ? 'btn-primary' : 'btn-outline-primary'}`}
                                        htmlFor={"reverse"}
                                    >
                                        Latest Logs First
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
                                            dispatch(updateColorMode(event.target.value));
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
                <LogSourceConfigAccordion
                    key={logSourceConfig.nameHyphenated}
                    logSourceConfig={logSourceConfig}
                    cardName={cardName} />
            );
        });
    }

    console.log('About to render the modal');
    console.log(`modalRef.current: ${modalRef.current}`);

    return (
        <Modal
            container={modalRef}
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