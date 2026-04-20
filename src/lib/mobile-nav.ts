/**
 * Mobile drawer navigation.
 *
 * Self-initializing module — import for side effects only.
 * Manages: open/close toggle, keyboard trap, Escape key,
 * backdrop click-to-close, focus management, body scroll lock.
 */

const TOGGLE_ID = "menuToggle";
const DRAWER_ID = "mobileDrawer";
const BACKDROP_ID = "drawerBackdrop";
const CLOSE_ID = "drawerClose";

function setupMobileNav(): void {
  const toggle = document.getElementById(TOGGLE_ID);
  const drawer = document.getElementById(DRAWER_ID);
  const backdrop = document.getElementById(BACKDROP_ID);
  const closeBtn = document.getElementById(CLOSE_ID);

  if (
    !(toggle instanceof HTMLButtonElement) ||
    !(drawer instanceof HTMLElement) ||
    !(backdrop instanceof HTMLElement) ||
    !(closeBtn instanceof HTMLButtonElement)
  ) {
    return;
  }

  const toggleButton = toggle;
  const drawerPanel = drawer;
  const drawerBackdrop = backdrop;
  const closeButton = closeBtn;

  const focusableSelector =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const pageRoots = Array.from(document.body.children).filter(
    (node) => node !== drawerPanel && node !== drawerBackdrop && node.tagName !== "SCRIPT",
  );

  function getFocusableElements(): HTMLElement[] {
    return Array.from(drawerPanel.querySelectorAll<HTMLElement>(focusableSelector));
  }

  function setBackgroundInert(isInert: boolean): void {
    pageRoots.forEach((node) => {
      if (isInert) {
        node.setAttribute("inert", "");
      } else {
        node.removeAttribute("inert");
      }
    });
  }

  function applyClosedA11yState(): void {
    drawerPanel.setAttribute("aria-hidden", "true");
    drawerPanel.removeAttribute("aria-modal");
    drawerBackdrop.setAttribute("aria-hidden", "true");
    setBackgroundInert(false);
  }

  function applyOpenA11yState(): void {
    drawerPanel.setAttribute("aria-hidden", "false");
    drawerPanel.setAttribute("aria-modal", "true");
    drawerBackdrop.setAttribute("aria-hidden", "false");
    setBackgroundInert(true);
  }

  function open(): void {
    drawerPanel.setAttribute("data-open", "true");
    drawerBackdrop.setAttribute("data-visible", "true");
    toggleButton.setAttribute("aria-expanded", "true");
    applyOpenA11yState();
    document.body.classList.add("menu-is-open", "drawer-open");

    requestAnimationFrame(() => {
      const first = getFocusableElements()[0];
      if (first) first.focus();
    });
  }

  function close(returnFocus = true): void {
    drawerPanel.setAttribute("data-open", "false");
    drawerBackdrop.setAttribute("data-visible", "false");
    toggleButton.setAttribute("aria-expanded", "false");
    applyClosedA11yState();
    document.body.classList.remove("menu-is-open", "drawer-open");

    if (returnFocus) {
      toggleButton.focus();
    }
  }

  function isOpen(): boolean {
    return drawerPanel.getAttribute("data-open") === "true";
  }

  toggleButton.addEventListener("click", () => {
    if (isOpen()) close();
    else open();
  });

  closeButton.addEventListener("click", () => close());

  drawerBackdrop.addEventListener("click", () => close());

  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape" && isOpen()) {
      close();
    }
  });

  drawerPanel.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;

    const focusable = getFocusableElements();
    if (focusable.length === 0) return;

    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  drawerPanel.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", () => close(false));
  });

  close(false);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupMobileNav);
} else {
  setupMobileNav();
}
