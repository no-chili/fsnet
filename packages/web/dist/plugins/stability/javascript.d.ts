import { Starter } from '../../Starter';
import { Plugin } from '../../types/Plugin';
type JSErrorPluginOption = {
    data?: any;
    [key: string]: any;
};
export declare class JSErrorPlugin extends Plugin {
    private abort;
    constructor(opt: JSErrorPluginOption);
    private data;
    install(starter: Starter): void;
    uninstall(): void;
}
export {};
