import { component$, Slot } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";

export default component$(() => {
  const loc = useLocation();
  return (
    <>
      {loc.isNavigating && (
        <div class="progress-bar">
          <div class="progress-bar-value"></div>
        </div>
      )}
      <div class="bg-base-300 flex flex-row gap-2 align-middle p-4 shadow-md">
        <Link
          class="bg-base-100 hover:bg-base-200 py-2 px-4 rounded-md"
          href="/"
        >
          Home
        </Link>
        <Link
          class="bg-base-100 hover:bg-base-200 py-2 px-4 rounded-md"
          href="/todos"
        >
          Todos
        </Link>
      </div>
      <div class="p-8">
        <Slot />
      </div>
    </>
  );
});
