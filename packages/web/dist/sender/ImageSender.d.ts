import { Sender } from '../types/Sender';
export declare class ImageSender implements Sender {
    endpoint: string;
    constructor(endpoint: string);
    send(data: Report): void;
}
