import { Sender } from '../types/Sender';
export declare class XHRSender implements Sender {
    private _cache;
    private url;
    constructor(url: string);
    send: <T>(data: T) => void;
}
