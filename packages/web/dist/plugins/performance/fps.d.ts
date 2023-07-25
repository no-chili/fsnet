import { Starter } from '../../Starter';
import { Plugin } from '../../types/Plugin';
type FPSPluginOption = {
    limit: number;
    data?: any;
    [key: string]: any;
};
export declare class FPSPlugin extends Plugin {
    private limit;
    constructor(opt: FPSPluginOption);
    private data;
    install(starter: Starter): void;
    private init;
}
export {};
