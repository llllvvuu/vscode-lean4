/* This file contains all of the types that are common to the extension and the infoview. */

import {  Message, Task } from 'lean-client-js-node';

// import { ServerStatus } from './server';

// [todo] this is probably already defined somewhere
export interface Location {
    file_name: string;
    line: number;
    column: number;
}

export function locationKey(l: Location): string {
    return `${l.file_name}:${l.line}:${l.column}`;
}

export interface ServerStatus {
    stopped: boolean;
    isRunning: boolean;
    numberOfTasks: number;
    tasks: Task[];
}

interface WidgetEventResponseSuccess {
    status: 'success';
    widget: {html: any};
}
interface WidgetEventResponseEdit {
    status: 'edit';
    widget: {html: any};
    /** Some text to insert after the widget's comma. */
    action: string;
}
interface WidgetEventResponseInvalid {
    status: 'invalid_handler';
}
interface WidgetEventResponseError {
    status: 'error';
    message: string;
}
export type WidgetEventResponse = WidgetEventResponseSuccess | WidgetEventResponseInvalid | WidgetEventResponseEdit | WidgetEventResponseError


export interface WidgetEventMessage {
    command: 'widget_event';
    kind: 'onClick' | 'onMouseEnter' | 'onMouseLeave' | 'onChange';
    handler: number;
    route: number[];
    args: { type: 'unit' } | { type: 'string'; value: string };
    loc: Location;
}

export enum DisplayMode {
    OnlyState, // only the state at the current cursor position including the tactic state
    AllMessage, // all messages
}

export interface InfoProps extends Location {
    widget?: string; // [note] vscode crashes if the widget is sent as a deeply nested json object.
    goalState?: string;

    location_name: string; // ${fileName}:${line}:${col}
    base_name: string;     // = basename(fileName)
}

export interface Config {
    filterIndex;
    infoViewTacticStateFilters: any[];
    infoViewAllErrorsOnLine: boolean;
    displayMode: DisplayMode;
}
export const defaultConfig = {
    filterIndex: -1,
    infoViewTacticStateFilters: [],
    infoViewAllErrorsOnLine: false,
    displayMode: DisplayMode.AllMessage,
}

/** The root state of the infoview */
export interface InfoViewState {
    cursorInfo: InfoProps;
    pinnedInfos: InfoProps[];
    // serverStatus: ServerStatus;

    config: Config;

    messages: Message[];
}

export interface InsertTextMessage {
    command: 'insert_text';
    loc: Location;
    text: string;
}
export interface RevealMessage {
    command: 'reveal';
    loc: Location;
}
export interface ServerRequestMessage {
    command: 'server_request';
    payload: string;
}

export type FromInfoviewMessage = ServerRequestMessage | InsertTextMessage | RevealMessage

/** Message from the extension to the infoview */
export type ToInfoviewMessage = {
    command: 'server_event' | 'server_error';
    payload: string; // payloads have to be stringified json because vscode crashes if the depth is too big.
} | {command: 'position'; loc: Location}
// | {command: 'on_all_messages'; messages: Message[]}
// | {command: 'on_server_status_changed'; status: ServerStatus}
| {
    command: 'on_config_change';
    config: Config;
}