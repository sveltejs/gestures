# @sveltejs/gestures

A (work-in-progress) collection of gesture recognisers for Svelte components.

Each recogniser is implemented as an action that emits custom events. Pointer events are used where possible, falling back to mouse and touch events.


## tap ([demo](https://v3.svelte.technology/repl?version=3.0.0-beta.10&gist=ffbdb659f2c52c8510bec42af3ffb0d1))

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

## swipe

This action include three events `swipe`, `swipestart` and `swipeend`. The `swipestart` event
will fire when the pointer is down and the `swipeend` event is fired when the pointer is up, if after 300ms the pointermove event is not fired, the `swipe` and `swipeend` events are canceled.

The `swipe` event will be fired if a minimal `TRESHOLD` distance is accomplished. This event will include in `event.detail` a `direction` string, which can be one of `left`, `right`, `up` and `down`, and a `distance` number.

```html
<script>
  import { swipe } from '@sveltejs/gestures';

  let active

  function handler(event) {
    console.log(`Swiped to the ${event.detail.direction}`)
  }
</script>

<style>
  .active {
    background-color: #333;
  }
</style>

<div
  use:swipe
  class:active
  on:swipestart={e => active = true}
  on:swipeend={e => active = false}
  on:swipe={handler}
></div>
```

TODO: `pan`, `rotate`, `pinch`, `press`

## License

[LIL](LICENSE)