import { Starter } from './../../Starter';
import { Plugin } from '../../types/Plugin';
type PvPluginOption = {
    data?: any;
    [key: string]: any;
};
export declare class PvPlugin extends Plugin {
    constructor(opt: PvPluginOption);
    private data;
    private controller;
    private captureEventList;
    private init;
    install(starter: Starter): void;
    uninstall(): void;
    reportPv(): void;
}
export {};
