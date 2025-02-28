import type { LangConfigs, LogArg, Status } from './types';

import { NotificationType, RequestType } from 'vscode-languageserver';

import { ID } from './const';

export const status = new RequestType<Status, void, void>(`${ID}/ready`);
export const configs = new RequestType<LangConfigs, void, void>(`${ID}/configs`);
export const logToPrimaryChannel = new NotificationType<LogArg>(`${ID}/log-primary-channel`);
export const logToDiagnosticsChannel = new NotificationType<LogArg>(`${ID}/log-diagnostics-channel`);
export const errorToPopup = new NotificationType<string>(`${ID}/error-popup`);
export const warningToPopup = new NotificationType<string>(`${ID}/warning-popup`);
export const infoToPopup = new NotificationType<string>(`${ID}/info-popup`);
