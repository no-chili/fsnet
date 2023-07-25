export type EventTypeName = keyof WindowEventMap;
export declare function createCanAbortListener<K extends EventTypeName>(event: K | K[], callback: (e: WindowEventMap[K]) => any, option?: boolean | AddEventListenerOptions): (reason?: any) => void;
