import { $, component$ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { Todo } from "~/models/todo";

interface Props {
  todo: Todo;
  onDelete$: PropFunction<(id: number) => void>;
  onUpdate$: PropFunction<(todo: Todo) => void>;
}

export const TodoCard = component$(({ todo, onDelete$, onUpdate$ }: Props) => {
  const toggleNoteStatus = $(async (update: Todo) => {
    const toUpdate: Todo = {
      ...update,
      done: !update.done,
    };
    onUpdate$(toUpdate);
  });

  return (
    <div
      class={`card bg-base-300 p-4 grid rounded-md ${
        todo.done
          ? "shadow-none border-dashed border-slate-400 border-2"
          : "shadow-xl"
      }`}
    >
      <span class={`pb-4 text-2xl ${todo.done && "line-through"}`}>
        {todo.title}
      </span>
      <span class={`py-4 ${todo.done && "line-through"}`}>
        {todo.description}
      </span>
      <div class="pt-4 flex flex-row justify-end gap-4 border-t border-slate-200">
        {!todo.done && (
          <Link
            href={`/todos/${todo.id}`}
            class={`px-3 py-2 rounded-md text-black text-sm bg-yellow-400`}
          >
            Edit
          </Link>
        )}
        <button
          class={`px-3 py-2 rounded-md text-white text-sm ${
            todo.done ? "bg-indigo-600" : "bg-emerald-600"
          }`}
          onClick$={() => toggleNoteStatus(todo)}
        >
          {todo.done ? "Restore" : "Done"}
        </button>
        <button
          class="px-3 py-2 rounded-md text-white text-sm bg-rose-600"
          onClick$={() => onDelete$(todo.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
});
