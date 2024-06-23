import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import {ReactElement} from "react";
import LogSourceConfig, {ILogSourceConfig} from "../models/logSourceConfig.ts";
import DupeMode from "../enums/dupeMode.ts";
import {useDispatch} from "react-redux";
import * as actions from "../redux/actions.ts";
import moment from "moment";

type LogSourceConfigProps = {
    logSourceConfig: ILogSourceConfig;
}

const LogSourceConfigAccordion = ({ logSourceConfig }: LogSourceConfigProps ): ReactElement => {
    let dispatch = useDispatch();

    const renderDupeModeOptions = () => {
        return Object.values(DupeMode.cache).map((dupeMode) => {
            let dupeSingularPlural = dupeMode.name === DupeMode.SHOW_ALL.name ? 'Dupes' : 'Dupe';
            let display = dupeMode.name.replace(/_/g, ' ').toTitleCase() + ' ' + dupeSingularPlural;
            return (
                <option key={dupeMode.name} value={dupeMode.name}>
                    {display}
                </option>
            );
        });
    }

    const renderDupeModeSelect = () => {
        return (
            <Form.Select
                name={"dupeMode"}
                className={"form-control"}
                value={logSourceConfig.dupeMode.name}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                    let dupeMode = DupeMode.create(event.target.value);
                    let newLogSourceConfig = LogSourceConfig.create(
                        logSourceConfig.name,
                        new Set(logSourceConfig.levels),
                        dupeMode,
                        logSourceConfig.startTimestamp,
                        logSourceConfig.endTimestamp,
                    );
                    dispatch(actions.setLogSourceConfig(newLogSourceConfig));
                }}
            >
                <option value="" disabled>Select Dupe Mode</option>
                {renderDupeModeOptions()}
            </Form.Select>
        );
    }

    const renderStartTimestampInput = () => {
        let sourceTimestampFormat = 'YYYY-MM-DDTHH:mm:ss';
        return (
            <Form.Control
                type={"datetime-local"}
                name={"startTimestamp"}
                value={LogSourceConfig.momentStart(logSourceConfig).format(LogSourceConfig.timestampFormat)}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    let newLogSourceConfig = LogSourceConfig.create(
                        logSourceConfig.name,
                        new Set(logSourceConfig.levels),
                        logSourceConfig.dupeMode,
                        moment(event.target.value, sourceTimestampFormat).format(LogSourceConfig.timestampFormat),
                        logSourceConfig.endTimestamp,
                    );
                    dispatch(actions.setLogSourceConfig(newLogSourceConfig));
                }}
            />
        );
    }

    const renderEndTimestampInput = () => {
        let sourceTimestampFormat = 'YYYY-MM-DDTHH:mm:ss';
        return (
            <Form.Control
                type={"datetime-local"}
                name={"endTimestamp"}
                value={LogSourceConfig.momentEnd(logSourceConfig).format(LogSourceConfig.timestampFormat)}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    let newLogSourceConfig = LogSourceConfig.create(
                        logSourceConfig.name,
                        new Set(logSourceConfig.levels),
                        logSourceConfig.dupeMode,
                        logSourceConfig.startTimestamp,
                        moment(event.target.value, sourceTimestampFormat).format(LogSourceConfig.timestampFormat),
                    );
                    dispatch(actions.setLogSourceConfig(newLogSourceConfig));
                }}
            />
        );
    }

    const renderForm = () => {
        return (
            <div className={"config-source-form"} data-source={logSourceConfig.nameHyphenated}>
                {renderDupeModeSelect()}
                {renderStartTimestampInput()}
                {renderEndTimestampInput()}
            </div>
        );
    }

    return (
        <Accordion key={logSourceConfig.nameHyphenated} defaultActiveKey={"0"}>
            <Accordion.Item eventKey={"0"}>
                <Accordion.Header>{logSourceConfig.nameProper}</Accordion.Header>
                <Accordion.Body>
                    {renderForm()}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}

export default LogSourceConfigAccordion;
