import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import {ReactElement} from "react";
import {useDispatch, useSelector} from "react-redux";
import {LogViewerState} from "../redux/logViewerState.ts";
import * as actions from "../redux/actions.ts";
import * as thunks from "../redux/thunks.ts";
import LogSource, {ILogSource} from "../enums/logSource.ts";

type SettingsModalProps = {
}

const SettingsModal = ({}: SettingsModalProps): ReactElement => {
    let dispatch = useDispatch();
    let show = useSelector((state: LogViewerState) => state.showSettingsModal);

    // Timestamps
    let hideTimestamps = useSelector((state: LogViewerState) => state.hideTimestamps);
    let hideTimestampYear = useSelector((state: LogViewerState) => state.hideTimestampYear);

    // Color Mode
    let colorMode = useSelector((state: LogViewerState) => state.colorMode);
    let hideColorModeDetail = useSelector((state: LogViewerState) => state.hideColorModeDetail);
    let backgroundColor = useSelector((state: LogViewerState) => state.backgroundColor);

    let selectedSources = useSelector((state: LogViewerState) => state.selectedSources);


    let debounceDispatchHandler: string | number | NodeJS.Timeout;
    const debounceDispatch = (value: string) => {
        clearTimeout(debounceDispatchHandler);
        debounceDispatchHandler = setTimeout(() => {
            console.log('Dispatching background color change');
            dispatch(actions.setBackgroundColor(value));
        }, 1000);
    };

    const renderSourceDropdown = () => {
        let sources = Object.values(LogSource.cache).sort((a: ILogSource, b: ILogSource) => a.name.localeCompare(b.name));
        let options = sources.map((source: ILogSource) => {
            return (
                <option key={source.name} value={source.name}>{source.name}</option>
            );
        });

        return (
            <Form.Select
                multiple
                value={selectedSources.map((source) => source.name)}
                onChange={(event) => {
                    let selectedSourceNames = Array.from(event.target.selectedOptions).map((option) => option.value);
                    dispatch(actions.setSelectedSources(selectedSourceNames));
                    dispatch(thunks.updateSelectedSources(selectedSourceNames));
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
                                        value={colorMode.name}
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

    const renderDefaultSourceConfigFormAccordion = () => {
        return null;
    }

    const renderSourceConfigFormAccordions = () => {
        return null;
    }

    const renderAddSourceConfigAccordion = () => {
        return null;
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
                {renderDefaultSourceConfigFormAccordion()}
                {renderSourceConfigFormAccordions()}
                {renderAddSourceConfigAccordion()}
            </Modal.Body>
        </Modal>
    );
}

export default SettingsModal;