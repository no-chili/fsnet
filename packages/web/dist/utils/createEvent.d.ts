export declare function createEvent(type: string): (this: any) => void;
export declare function createHistoryEvent<T extends keyof History>(type: T): (this: any) => any;
