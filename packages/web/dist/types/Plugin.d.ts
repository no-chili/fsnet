import { Starter } from '../Starter';
export type Constructor<T> = new (...args: any[]) => T;
export declare class Plugin {
    starter: Starter;
    install(starter: Starter): void;
    uninstall(): void;
}
export type PluginList = Array<Constructor<Plugin>>;
