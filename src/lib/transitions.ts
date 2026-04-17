/**
 * Shared screen transition logic used by both the main planner and the trip enhancer.
 *
 * The "results" transition is instant (no animation delay needed when moving forward).
 * The "input" transition waits 220ms for the outgoing results screen's CSS transition
 * to finish before revealing the input form.
 */
export function showScreen(
  target: "input" | "results",
  screenInput: HTMLElement,
  screenResults: HTMLElement,
): void {
  if (target === "results") {
    screenInput.hidden = true;
    screenInput.classList.remove("screen-active");
    screenResults.hidden = false;
    requestAnimationFrame(() => screenResults.classList.add("screen-active"));
    return;
  }
  screenResults.classList.remove("screen-active");
  setTimeout(() => {
    screenResults.hidden = true;
    screenInput.hidden = false;
    requestAnimationFrame(() => screenInput.classList.add("screen-active"));
  }, 220);
}

export function capitalize(input: string): string {
  return input.charAt(0).toUpperCase() + input.slice(1);
}
