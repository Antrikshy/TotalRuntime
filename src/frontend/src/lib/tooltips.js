import { createTippy } from 'svelte-tippy'
import 'tippy.js/animations/shift-toward.css';

export const tippy = createTippy({
  animation: "shift-toward",
  duration: [75, 60],
  delay: [0, 250],
  theme: "totalruntime",
  maxWidth: "12rem",
  offset: 0,
  appendTo: () => document.querySelector("main")
})
