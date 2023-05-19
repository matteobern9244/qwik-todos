import { $, component$, useSignal } from "@builder.io/qwik";
import { Link, routeAction$, routeLoader$ } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { TodoCard } from "~/components/todo-card/todo-card";
import type { Todo } from "~/models/todo";

export const useTodos = routeLoader$(async () => {
  const data = await fetch("http://localhost:3000/todos");
  const todos = await data.json();
  return todos as Todo[];
});

export const useDeleteTodo = routeAction$(async ({ id }) => {
  const deleted = await fetch(`http://localhost:3000/todos/${id}`, {
    method: "DELETE",
  });
  return deleted.json();
});

export const useToggleDone = routeAction$(async ({ id, done }) => {
  const updated = await fetch(`http://localhost:3000/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      done,
    }),
  });
  return updated.json();
});

export default component$(() => {
  const todosAction = useTodos();
  const todos = useSignal<Todo[]>(todosAction.value ?? []);
  const deleteAction = useDeleteTodo();
  const toggleDoneAction = useToggleDone();

  const onDelete$ = $(async (id: number) => {
    const deleted = await deleteAction.submit({ id });
    if (deleted.status === 200) {
      todos.value = todos.value.filter((todo) => todo.id !== id);
    }
  });

  const onUpdate$ = $(async (todo: Todo) => {
    const response = await toggleDoneAction.submit({
      id: todo.id,
      done: todo.done,
    });
    if (response.status === 200) {
      const updated = response.value as Todo;
      todos.value = todos.value.map((todo) =>
        todo.id === updated.id ? updated : todo
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
        {todos.value.map((todo) => (
          <TodoCard
            todo={todo}
            key={todo.id}
            onDelete$={(id: number) => onDelete$(id)}
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
