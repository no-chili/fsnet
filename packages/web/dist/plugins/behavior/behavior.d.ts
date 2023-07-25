import { Starter } from '../../Starter';
import { Plugin } from '../../types/Plugin';
type BehaviorPluginOption = {
    limit: number;
    data?: any;
    [key: string]: any;
};
export declare class BehaviorPlugin extends Plugin {
    constructor(opt?: BehaviorPluginOption);
    private data;
    private limit;
    private userAction;
    private currentAction;
    private lasttime;
    install(starter: Starter): void;
    reportUserAction(): void;
    collectAction(): () => void;
}
export {};
