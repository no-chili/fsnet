import { Starter } from '../../Starter';
import { Plugin } from '../../types/Plugin';
type PerformancePluginOption = {
    startTime: number;
    data?: any;
    [key: string]: any;
};
export declare class PerformancePlugin extends Plugin {
    private startTime;
    constructor(opt: PerformancePluginOption);
    private performanceData;
    private data;
    private navigationPerformance;
    private firstPerformance;
    private firstContentfulPerformance;
    install(starter: Starter): void;
}
export {};
