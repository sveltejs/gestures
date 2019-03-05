export function add(node: EventTarget, event: string, handler: EventListener) {
	node.addEventListener(event, handler);
	return () => node.removeEventListener(event, handler);
}