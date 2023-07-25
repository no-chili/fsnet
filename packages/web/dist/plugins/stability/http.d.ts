import { Starter } from '../../Starter';
import { Plugin } from '../../types/Plugin';
type HttpErrorPluginOption = {
    data?: any;
    [key: string]: any;
};
export declare class HttpErrorPlugin extends Plugin {
    private data;
    private originOpen;
    private originSend;
    private originFetch;
    private logCallback;
    install(starter: Starter): void;
    uninstall(): void;
    constructor(opt: HttpErrorPluginOption);
}
export {};
