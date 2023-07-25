import { Starter } from '../../Starter';
import { Plugin } from '../../types/Plugin';
type WhiteScreenPluginOption = {
    grain?: number;
    offset?: number;
    data?: any;
    [key: string]: any;
};
export declare class WhiteScreenPlugin extends Plugin {
    private grain;
    private offset;
    private data;
    constructor(opt: WhiteScreenPluginOption);
    install(starter: Starter): void;
}
export {};
