// @ts-nocheck
import "cally";
import { createSignal, Setter } from "solid-js";

interface props {
  date: string;
  setDate: Setter<string>;
}

const CalendarPicker = (props: props) => {
  function handleChange(e) {
    props.setDate(this.value);
  }

  return (
    <div>
      <label class="input input-neutral w-full">
        <svg
          class="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24">
          <g
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2.5"
            fill="none"
            stroke="currentColor">
            <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
            <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
          </g>
        </svg>
        <input
          type="button"
          popovertarget="cally-popover1"
          class="input"
          id="cally1"
          style="anchor-name:--cally1"
          placeholder="Select due date"
          required
          value={props.date()}
        />
      </label>
      <div
        popover
        id="cally-popover1"
        class="dropdown bg-base-100 rounded-box shadow-lg"
        style="position-anchor:--cally1">
        <calendar-date class="cally" onchange={handleChange}>
          <svg
            aria-label="Previous"
            class="fill-current size-4"
            slot="previous"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path d="M15.75 19.5 8.25 12l7.5-7.5"></path>
          </svg>
          <svg
            aria-label="Next"
            class="fill-current size-4"
            slot="next"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
          </svg>
          <calendar-month></calendar-month>
        </calendar-date>
      </div>
    </div>
  );
};

export default CalendarPicker;
