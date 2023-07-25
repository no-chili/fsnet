import { Sender } from './types/Sender';
import { Plugin, PluginList } from './types/Plugin';
import { SenderOption } from './types/Sender';
export * from './plugins';
export declare class Starter {
    constructor(plugins: PluginList, opt: SenderOption);
    static instance: Starter;
    sender: Sender;
    plugins: Plugin[];
    regist(plugin: Plugin): void | this;
    uninstallPlugin(plugins: PluginList): void;
    destroy(): void;
}
