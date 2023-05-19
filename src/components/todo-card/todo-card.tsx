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
  const deleteNote = $(async (id: number) => {
    const deleted = await fetch(`http://localhost:3000/todos/${id}`, {
      method: "DELETE",
    });
    if (deleted) {
      onDelete$(id);
    }
  });
  const toggleNoteStatus = $(async (update: Todo) => {
    const toUpdate: Todo = {
      ...update,
      done: !update.done,
    };
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toUpdate),
    };
    const updated = await fetch(
      `http://localhost:3000/todos/${update.id}`,
      requestOptions
    );
    const newTodo = await updated.json();
    onUpdate$(newTodo);
  });

  return (
    <div
      class={`bg-white shadow-xl p-4 grid rounded-md divide-y divide-dashed divide-slate-400 ${
        todo.done && "shadow-none border-dashed border-slate-400 border-2"
      }`}
    >
      <span class={`pb-4 text-lg ${todo.done && "line-through"}`}>
        Todo #{todo.id}
      </span>
      <span class={`py-8 ${todo.done && "line-through"}`}>
        {todo.description}
      </span>
      <div class="pt-4 flex flex-row justify-end gap-4">
        {!todo.done && (
          <Link
            href={`/todos/${todo.id}`}
            class={`px-3 py-2 rounded-md text-white text-sm bg-purple-600`}
          >
            Edit
          </Link>
        )}
        <button
          class={`px-3 py-2 rounded-md text-white text-sm ${
            todo.done ? "bg-cyan-600" : "bg-emerald-600"
          }`}
          onClick$={() => toggleNoteStatus(todo)}
        >
          {todo.done ? "Restore" : "Done"}
        </button>
        <button
          class="px-3 py-2 rounded-md text-white text-sm bg-rose-600"
          onClick$={() => deleteNote(todo.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
});
