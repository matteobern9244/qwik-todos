import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { Todo } from "~/models/todo";

export const useTodo = routeLoader$(async ({ params, redirect }) => {
  // This code runs only on the server, after every navigation
  const res = await fetch(`http:/localhost:3000/todos/${params.id}`);
  if (!res.ok) {
    redirect(304, "/");
  }
  const todo: Todo = await res.json();
  return todo;
});

export default component$(() => {
  const todo = useTodo(); // Readonly<Signal<Todo>>
  return (
    <div class="p-4">
      <p class="text-4xl mb-4">Todo #{todo.value.id}</p>
      <p>{todo.value.description}</p>
    </div>
  );
});
