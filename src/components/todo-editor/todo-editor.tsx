import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";
import type { Todo } from "~/models/todo";

interface Props {
  todo?: Todo;
  onSubmit$: PropFunction<(title: string, description: string) => void>;
  actionName: string;
}

const inputStyle =
  "mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500";

export const TodoEditor = component$(
  ({ todo, onSubmit$, actionName }: Props) => {
    const title = useSignal<string>("");
    const description = useSignal<string>("");

    useTask$(async () => {
      title.value = todo?.title ?? "";
      description.value = todo?.description ?? "";
    });

    return (
      <form class="flex flex-col gap-2 my-4" preventdefault:submit>
        <label for="title">Title</label>
        <input name="title" class={inputStyle} bind:value={title} />
        <label for="description">Description</label>
        <input name="description" class={inputStyle} bind:value={description} />
        <button
          type="submit"
          class="py-2 px-4 bg-sky-600 rounded-md text-white mt-8"
          onClick$={() => onSubmit$(title.value, description.value)}
        >
          {actionName}
        </button>
      </form>
    );
  }
);
