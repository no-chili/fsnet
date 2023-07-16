import { Plugin } from '../../types/Plugin';
type PvOption = {};
export declare class PvPlugin implements Plugin {
    private constructor();
    static instance: any;
    static getinstance(): PvPlugin;
    static hasrewrite: boolean;
    private controller;
    private status;
    private captureEventList;
    private init;
    install(option?: PvOption): void;
    uninstall(): void;
    run(): void;
    stop(): void;
}
export {};
