import { Sender } from '../types/Sender';
export declare class BeaconSender implements Sender {
    private url;
    constructor(url: string);
    send(data: any): void;
}
