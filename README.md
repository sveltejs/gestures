# @sveltejs/gestures

A (work-in-progress) collection of gestures recognisers for Svelte components.

Each recogniser is implemented as an action that emits custom events. Pointer events are used where possible, falling back to mouse and touch events.


## tap

This action fires a `tap` event when the user taps on an element with either a mouse or a finger (or other pointing device). If the pointer is down for more than 300ms, it doesn't count, unlike with `click` events.

Pressing the spacebar on a focused button will also fire a `tap` event. Taps on disabled form elements are disregarded.

The `event.detail` object has `x` and `y` properties corresponding to `clientX` and `clientY`. If the original event was a spacebar keypress, both are `null`.

```html
<script>
	import { tap } from '@sveltejs/gestures';

	function handler(event) {
		console.log(`the button was tapped at ${event.detail.x}, ${event.detail.y}`);
	}
</script>

<button use:tap on:tap={handler}>
	tap the button
</button>
```

TODO: `pan`, `swipe`, `rotate`, `pinch`, `press`


## License

[LIL](LICENSE)