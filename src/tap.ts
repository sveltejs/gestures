import { add } from "./shared";

function dispatch_tap(node: EventTarget, x: number, y: number) {
	node.dispatchEvent(new CustomEvent('tap', {
		detail: { x, y }
	}));
}

function handle_focus(event: FocusEvent) {
	const remove_keydown_handler = add(event.currentTarget, 'keydown', (event: KeyboardEvent) => {
		if (event.which === 32) dispatch_tap(event.currentTarget, null, null);
	});

	const remove_blur_handler = add(event.currentTarget, 'blur', (event: KeyboardEvent) => {
		remove_keydown_handler();
		remove_blur_handler();
	});
}

function is_button(node: HTMLButtonElement | HTMLInputElement) {
	return node.tagName === 'BUTTON' || node.type === 'button';
}

function tap_pointer(node: EventTarget) {
	function handle_pointerdown(event: PointerEvent) {
		if ((node as HTMLButtonElement).disabled) return;
		const { clientX, clientY } = event;

		const remove_pointerup_handler = add(node, 'pointerup', (event: PointerEvent) => {
			if (Math.abs(event.clientX - clientX) > 5) return;
			if (Math.abs(event.clientY - clientY) > 5) return;

			dispatch_tap(node, event.clientX, event.clientY);
			remove_pointerup_handler();
		});

		setTimeout(remove_pointerup_handler, 300);
	}

	const remove_pointerdown_handler = add(node, 'pointerdown', handle_pointerdown);
	const remove_focus_handler = is_button(node as HTMLButtonElement) && add(node, 'focus', handle_focus);

	return {
		destroy() {
			remove_pointerdown_handler();
			remove_focus_handler && remove_focus_handler();
		}
	};
}

function tap_legacy(node: EventTarget) {
	let mouse_enabled = true;
	let mouse_timeout: NodeJS.Timeout;

	function handle_mousedown(event: MouseEvent) {
		const { clientX, clientY } = event;

		const remove_mouseup_handler = add(node, 'mouseup', (event: MouseEvent) => {
			if (!mouse_enabled) return;
			if (Math.abs(event.clientX - clientX) > 5) return;
			if (Math.abs(event.clientY - clientY) > 5) return;

			dispatch_tap(node, event.clientX, event.clientY);
			remove_mouseup_handler();
		});

		clearTimeout(mouse_timeout);
		setTimeout(remove_mouseup_handler, 300);
	}

	function handle_touchstart(event: TouchEvent) {
		if (event.changedTouches.length !== 1) return;
		if ((node as HTMLButtonElement).disabled) return;

		const touch = event.changedTouches[0];
		const { identifier, clientX, clientY } = touch;

		const remove_touchend_handler = add(node, 'touchend', (event: TouchEvent) => {
			const touch = Array.from(event.changedTouches).find(t => t.identifier === identifier);
			if (!touch) return;

			if (Math.abs(touch.clientX - clientX) > 5) return;
			if (Math.abs(touch.clientY - clientY) > 5) return;

			dispatch_tap(node, touch.clientX, touch.clientY);

			mouse_enabled = false;
			mouse_timeout = setTimeout(() => {
				mouse_enabled = true;
			}, 350);
		});

		setTimeout(remove_touchend_handler, 300);
	}

	const remove_mousedown_handler = add(node, 'mousedown', handle_mousedown);
	const remove_touchstart_handler = add(node, 'touchstart', handle_touchstart);
	const remove_focus_handler = is_button(node as HTMLButtonElement) && add(node, 'focus', handle_focus);

	return {
		destroy() {
			remove_mousedown_handler();
			remove_touchstart_handler();
			remove_focus_handler && remove_focus_handler();
		}
	};
}

export const tap = typeof PointerEvent === 'function'
	? tap_pointer
	: tap_legacy;