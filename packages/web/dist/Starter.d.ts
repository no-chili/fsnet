import { PluginName, Plugins } from './types/Plugin';
export * from './plugins';
type Option = {
    plugins?: Plugins;
};
export declare class Starter {
    constructor(opt?: Option);
    private plugins;
    private state;
    regist(plugin: PluginName | Plugins): void;
    start(): void;
    stop(): void;
    destroy(): void;
}
