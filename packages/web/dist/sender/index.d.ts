type Sender = 'XHR' | 'Image' | 'Beacon';
export type Option = {
    data: any;
};
export default function send(url: string, option: Option, sender?: Sender): void;
export {};
