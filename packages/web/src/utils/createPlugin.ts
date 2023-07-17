export type Constructor<T> = new (...args: any[]) => T

export function createPluginInstance<T>(plugin: Constructor<T>): T {
	return new plugin()
}
