import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import {ReactElement} from "react";
import {ILogSourceConfig} from "../models/logSourceConfig.ts";
import LogSource from "../enums/logSource.ts";
import DupeMode from "../enums/dupeMode.ts";

type LogSourceConfigProps = {
    logSourceConfig: ILogSourceConfig;
}

const LogSourceConfigAccordion = ({ logSourceConfig }: LogSourceConfigProps ): ReactElement => {
    const renderSourceOptions = () => {
        let anySelected = false;
        let logSourceStrings = Object.keys(LogSource).filter((source: string) => isNaN(Number(source)));
        return logSourceStrings.sort().map((source: string) => {
            let selected = source === logSourceConfig.name;
            anySelected ||= selected;
            return (
                <option value={source} selected={selected}>
                    {source.replace(/_/g, ' ').toTitleCase()}
                </option>
            );
        });
    }

    const renderSourceDropdown = () => {
        if (logSourceConfig.name === 'defaults') {
            return null;
        }

        return (
            <Form.Select name={"source"} className={"form-control"}>
                <option value="" disabled>Select Source</option>
                {renderSourceOptions()}
            </Form.Select>
        );
    }

    const renderDupeModeOptions = () => {
        let dupeModeStrings = Object.keys(DupeMode).filter((mode: string) => isNaN(Number(mode)));
        let options = dupeModeStrings.map((dupeModeStr: string) => {
            let dupeSingularPlural = dupeModeStr === DupeMode.SHOW_ALL.toString() ? 'Dupes' : 'Dupe';
            let display = dupeModeStr.replace(/_/g, ' ').toTitleCase() + ' ' + dupeSingularPlural;
            return (
                <option value={dupeModeStr} selected={logSourceConfig.dupeMode.toString() === dupeModeStr}>
                    {display}
                </option>
            );
        });

        return options;
    }

    const renderDupeModeSelect = () => {
        return (
            <Form.Select name={"dupeMode"} className={"form-control"}>
                <option value="" disabled>Select Dupe Mode</option>
                {renderDupeModeOptions()}
            </Form.Select>
        );
    }

    const renderStartTimestampInput = () => {
        let sourceTimestampFormat = 'YYYY-MM-DD HH:mm:ss';
        return (
            <Form.Control
                type={"datetime-local"}
                name={"startTimestamp"}
                value={logSourceConfig.startTimestamp.format('YYYY-MM-DDTHH:mm:ss')}
            />
        );
    }

    const renderEndTimestampInput = () => {
        return (
            <Form.Control
                type={"datetime-local"}
                name={"endTimestamp"}
                value={logSourceConfig.endTimestamp.format('YYYY-MM-DDTHH:mm:ss')}
            />
        );
    }

    const renderForm = () => {
        return (
            <div className={"config-source-form"} data-source={logSourceConfig.nameHyphenated}>
                ${renderSourceDropdown()}
                ${renderDupeModeSelect()}
                ${renderStartTimestampInput()}
                ${renderEndTimestampInput()}
            </div>
        );
    }

    return (
        <Accordion defaultActiveKey={"0"}>
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
