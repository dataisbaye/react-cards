import {ReactElement} from "react";
import LogLineModel from "../models/logLine";

type LogLineProps = {
    logLine: LogLineModel;
}

const LogLine = ({ logLine }: LogLineProps ): ReactElement => {
    let renderExpandCollapseIcon = () => {
        // TODO include - icon and no icon based on state/props
        return (
            <>
                <span> + </span>
                <span> - </span>
                <span> &nbsp; </span>
            </>
        );
    }

    return (
        <div>
            <span title={"TODO"}>
                {logLine.timestamp.format(logLine.timestampFormat)}
            </span>
            <span>
                {renderExpandCollapseIcon()}
            </span>
        </div>
    );
}

export default LogLine;
