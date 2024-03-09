import humanizeDuration from "humanize-duration"

export function humanizeRuntime(runtimeMinutes, largest=2) {
  return humanizeDuration(
    // humanize-duration accepts milliseconds
    runtimeMinutes * 60 * 1000,
    { largest: largest, round: true, conjunction: " and ", serialComma: false }
  )
}
