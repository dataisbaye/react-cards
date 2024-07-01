import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import {ReactElement} from "react";
import LogSourceConfig, {ILogSourceConfig} from "../models/logSourceConfig.ts";
import DupeModeEnum from "../enums/dupeMode.ts";
import * as actions from "../redux/actions.ts";
import moment from "moment";
import {useAppDispatch} from "../redux/hooks.ts";
import LogLevelEnum from "../enums/logLevel.ts";

type LogSourceConfigProps = {
    logSourceConfig: ILogSourceConfig;
}

const LogSourceConfigAccordion = ({ logSourceConfig }: LogSourceConfigProps ): ReactElement => {
    let dispatch = useAppDispatch();

    const renderDupeModeOptions = () => {
        let dupeModes = Object.values<string>(DupeModeEnum);
        return dupeModes.map((dupeMode) => {
            let dupeSingularPlural = dupeMode === DupeModeEnum.SHOW_ALL ? 'Dupes' : 'Dupe';
            let display = dupeMode.replace(/_/g, ' ').toTitleCase() + ' ' + dupeSingularPlural;
            return (
                <option key={dupeMode} value={dupeMode}>
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
                value={logSourceConfig.dupeMode}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                    let newLogSourceConfig = LogSourceConfig.create(
                        logSourceConfig.name,
                        new Set(logSourceConfig.levels),
                        event.target.value,
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

    const renderLevelOptions = () => {
        let levels = Object.values(LogLevelEnum);
        return levels.map((level) => {
            let dupeSingularPlural = level === DupeModeEnum.SHOW_ALL ? 'Dupes' : 'Dupe';
            let display = level.replace(/_/g, ' ').toTitleCase() + ' ' + dupeSingularPlural;
            return (
                <option key={level} value={level}>
                    {display}
                </option>
            );
        });
    }

    const renderLevelSelect = () => {
        return (
            <Form.Select
                multiple
                value={logSourceConfig.levels}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                    let selectedLevels = Array.from(event.target.selectedOptions).map((option) => option.value);
                    let newLogSourceConfig = LogSourceConfig.create(
                        logSourceConfig.name,
                        new Set(selectedLevels),
                        logSourceConfig.dupeMode,
                        logSourceConfig.startTimestamp,
                        logSourceConfig.endTimestamp,
                    );
                    dispatch(actions.setLogSourceConfig(newLogSourceConfig));
                }}
            >
                {renderLevelOptions()}
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
                {renderLevelSelect()}
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
