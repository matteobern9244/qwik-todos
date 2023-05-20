import { $, component$, useSignal } from "@builder.io/qwik";
import { Link, routeAction$, routeLoader$ } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { TodoCard } from "~/components/todo-card/todo-card";
import type { Todo } from "~/models/todo";

export const useTodos = routeLoader$(async ({ fail, env }) => {
  const data = await fetch(`${env.get("API_URL")}/notes`);
  if (!data) {
    // Return a failed value to indicate that product was not found
    return fail(404, {
      todos: [] as Todo[],
    });
  }
  const todos = (await data.json()) as Todo[];
  return {
    todos,
  };
});

export const useDeleteTodo = routeAction$(async ({ id }, { env }) => {
  const deleted = await fetch(`${env.get("API_URL")}/notes/${id}`, {
    method: "DELETE",
  });
  return deleted.json();
});

export const useToggleDone = routeAction$(async ({ id, done }, { env }) => {
  const updated = await fetch(`${env.get("API_URL")}/notes/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      done: done,
    }),
    headers: {
      "Content-type": "application/json",
    },
  });
  return updated.json();
});

export default component$(() => {
  const todosAction = useTodos();
  const todos = useSignal(todosAction.value);
  const deleteAction = useDeleteTodo();
  const toggleDoneAction = useToggleDone();

  const onDelete$ = $(async (id: string) => {
    const deleted = await deleteAction.submit({ id });
    if (deleted.status === 200) {
      todos.value.todos = todos.value.todos.filter((todo) => todo._id !== id);
    }
  });

  const onUpdate$ = $(async (todo: Todo) => {
    const response = await toggleDoneAction.submit({
      id: todo._id,
      done: todo.done,
    });
    if (response.status === 200) {
      const updated = response.value as Todo;
      todos.value.todos = todos.value.todos.map((todo) =>
        todo._id === updated._id ? updated : todo
      );
    }
  });

  return (
    <div class="grid gap-8">
      <div class="flex flex-row justify-between items-center">
        <h1 class="text-4xl">Todo List</h1>
        <Link
          href={`/todos/new`}
          class={`px-3 py-2 rounded-md text-white text-sm bg-sky-600`}
        >
          Add Todo
        </Link>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {todos.value.todos.map((todo) => (
          <TodoCard
            todo={todo}
            key={todo._id}
            onDelete$={(id: string) => onDelete$(id)}
            onUpdate$={(todo: Todo) => onUpdate$(todo)}
          />
        ))}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Qwik Todos",
  meta: [
    {
      name: "description",
      content: "A simple, qwik todo app.",
    },
  ],
};
