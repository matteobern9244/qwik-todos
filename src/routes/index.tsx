import { $, component$, useSignal, useTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { TodoCard } from "~/components/todo-card/todo-card";
import type { Todo } from "~/models/todo";

export default component$(() => {
  const todos = useSignal<Todo[]>([]);

  useTask$(async () => {
    const data = await fetch("http://localhost:3000/todos");
    todos.value = await data.json();
  });

  const onDelete$ = $((id: number) => {
    todos.value = todos.value.filter((todo) => todo.id !== id);
  });

  const onUpdate$ = $((updated: Todo) => {
    todos.value = todos.value.map((todo) =>
      todo.id === updated.id ? updated : todo
    );
  });

  return (
    <div class="grid gap-8 p-8">
      <h1 class="text-4xl">Todo List</h1>
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
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
