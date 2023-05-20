import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import prismaClient from "~/lib/prismaClient";

export const useTodo = routeLoader$(async ({ params, redirect }) => {
  const todo = prismaClient.todo.findFirst({
    where: {
      id: params.id,
    },
  });
  if (!todo) {
    redirect(304, "/");
  }
  return todo;
});

export default component$(() => {
  const todo = useTodo();
  return (
    <div class="p-4">
      <p class="text-4xl mb-4">{todo.value?.title}</p>
      <p>{todo.value?.description}</p>
    </div>
  );
});
