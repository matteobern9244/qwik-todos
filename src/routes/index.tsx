import { component$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { TodoCard } from "~/components/todo-card/todo-card";
import type { Todo } from "~/models/todo";
import "./home.css";
import { data } from "~/mock/data";

export default component$(() => {
  const todos = useSignal<Todo[]>(data);
  return (
    <>
      <h1>Todo List</h1>
      <div class="todo-list">
        {todos.value.map((todo) => (
          <TodoCard todo={todo} key={todo.id} />
        ))}
      </div>
    </>
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
