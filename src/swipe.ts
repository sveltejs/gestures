import { add } from "./shared";

function dispatch_swipe(node: EventTarget, direction: string, distance: number) {
	node.dispatchEvent(new CustomEvent('swipe', {
		detail: { direction, distance }
	}));
}

function dispatch_swipe_start(node: EventTarget) {
	node.dispatchEvent(new CustomEvent('swipestart'));
}

function dispatch_swipe_end(node: EventTarget) {
	node.dispatchEvent(new CustomEvent('swipeend'));
}

const TRESHOLD = 0

function swipe_pointer(node: EventTarget) {
	function handle_pointer_down(event: PointerEvent) {
		dispatch_swipe_start(node);
		const remove_pointerup_handler = add(node, 'pointerup', (event: PointerEvent) => {
			dispatch_swipe_end(node);
			remove_pointerup_handler();
		})
		const remove_pointermove_handler = add(node, 'pointermove', (event: PointerEvent) => {
			if (Math.abs(event.movementX) > TRESHOLD) {
				dispatch_swipe(node, event.movementX > 0 ? 'right' : 'left', event.movementX);
			} else if (Math.abs(event.movementY) > TRESHOLD) {
				dispatch_swipe(node, event.movementY > 0 ? 'down' : 'up', event.movementY);
			}
			remove_pointermove_handler();
		})
		setTimeout(remove_pointermove_handler, 300);
	}

	const remove_pointerdown_handler = add(node, 'pointerdown', handle_pointer_down);

	return {
		destroy() {
			remove_pointerdown_handler();
		}
	}
}

function swipe_legacy(node: EventTarget) {
	function handle_mousedown(event: MouseEvent) {
		dispatch_swipe_start(node);
		const remove_mouseup_handler = add(node, 'mouseup', (event: MouseEvent) => {
			dispatch_swipe_end(node);
			remove_mouseup_handler();
		})

		const remove_mousemove_handler = add(node, 'mousemve', (event: MouseEvent) => {
			if (Math.abs(event.movementX) > TRESHOLD) {
				dispatch_swipe(node, event.movementX > 0 ? 'right' : 'left', event.movementX);
			} else if (Math.abs(event.movementY) > TRESHOLD) {
				dispatch_swipe(node, event.movementY > 0 ? 'down' : 'up', event.movementY);
			}
			remove_mousemove_handler();
		})
		setTimeout(remove_mousemove_handler, 300);
	}

	function handle_touchstart(event: TouchEvent) {
		if (event.changedTouches.length !== 1) return

		event.preventDefault();
		dispatch_swipe_start(node);

		const touch = event.changedTouches[0];
		const { identifier, clientX, clientY } = touch;
		
		const remove_touchend_handler = add(node, 'touchend', (event: TouchEvent) => {
			event.preventDefault();
			dispatch_swipe_end(node);
			remove_touchend_handler();
		})

		const remove_touchmove_handler = add(node, 'touchmove', (event: TouchEvent) => {
			const touch = Array.from(event.changedTouches).find(t => t.identifier === identifier);
			if (!touch) return

			if (Math.abs(touch.clientX - clientX) > TRESHOLD) {
				dispatch_swipe(node, touch.clientX - clientX > 0 ? 'right' : 'left', touch.clientX - clientX);
			} else if (Math.abs(touch.clientY - clientY) > TRESHOLD) {
				dispatch_swipe(node, touch.clientY - clientY > 0 ? 'down' : 'up', touch.clientY - clientY);
			}
			event.preventDefault();
			remove_touchmove_handler();
		})
		setTimeout(remove_touchmove_handler, 300);
	}

	const remove_mousedown_handler = add(node, 'mousedown', handle_mousedown);
	const remove_touchstart_handler = add(node, 'touchstart', handle_touchstart);
	
	return {
		destroy() {
			remove_mousedown_handler();
			remove_touchstart_handler();
		}
	}
}

export const swipe = typeof PointerEvent === 'function'
  ? swipe_pointer
  : swipe_legacy