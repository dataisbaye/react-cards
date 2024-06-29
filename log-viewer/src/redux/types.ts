import {ExpandIconType} from "../models/types.ts";

export interface ToggleExpandCollapsePayload {
    id: string;
    expandIcon: ExpandIconType;
}

export interface SetLogSourceColorPayload {
    source: string;
    color: string;
}
