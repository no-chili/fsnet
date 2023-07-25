import { Starter } from '../../Starter';
import { Plugin } from '../../types/Plugin';
type SourceErrorPluginOption = {
    data?: any;
    [key: string]: any;
};
export declare class SourceErrorPlugin extends Plugin {
    constructor(opt: SourceErrorPluginOption);
    private data;
    private abort;
    install(starter: Starter): void;
    uninstall(): void;
}
export {};
