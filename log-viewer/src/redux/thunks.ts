/*
import { createAsyncThunk } from "@reduxjs/toolkit";
import {addLogLines, addLogSourceConfig, setSelectedSources} from "./actions";
import { LogViewerState } from "./logViewerState.ts";
import LogGenerator from "../models/logGenerator.ts";
import LogSourceConfig from "../models/logSourceConfig.ts";
import LogLevel from "../enums/logLevel.ts";
import moment from "moment";
import DupeMode from "../enums/dupeMode.ts";

export const updateSelectedSources = createAsyncThunk(
    'updateSelectedSources',
    async (selectedSources: string[], thunkAPI) => {
        let state: LogViewerState = thunkAPI.getState() as LogViewerState;

        for (const source of selectedSources) {
            if (!state.logSourceConfigs[source]) {
                // TODO get logs from generator instead of API for now
                let logGenerator = new LogGenerator();
                let levels = new Set(Object.values(LogLevel.cache));
                let dupeMode = DupeMode.SHOW_FIRST;
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
                thunkAPI.dispatch(addLogLines(logs));
                thunkAPI.dispatch(addLogSourceConfig(logSourceConfig));
            }
        }

        thunkAPI.dispatch(setSelectedSources(selectedSources));
    }
);
 */