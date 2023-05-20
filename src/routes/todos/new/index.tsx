import { component$ } from "@builder.io/qwik";
import { Form, z, zod$ } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeAction$ } from "@builder.io/qwik-city";
import prismaClient from "~/lib/prismaClient";

export const useAddTodo = routeAction$(
  async (data) => {
    const todo = await prismaClient.todo.create({
      data: {
        title: data.title,
        description: data.title,
      },
    });
    return todo;
  },
  zod$({
    title: z.string(),
    description: z.string(),
  })
);

const inputStyle =
  "mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500";

export default component$(() => {
  const action = useAddTodo();
  return (
    <div>
      <h1 class="text-4xl">New Todo</h1>
      <>
        <Form action={action} class="flex flex-col gap-2 my-4">
          <label for="title">Title</label>
          <input name="title" class={inputStyle} />
          <label for="description">Description</label>
          <input name="description" class={inputStyle} />
          <button
            type="submit"
            class="py-2 px-4 bg-sky-600 rounded-md text-white mt-8"
          >
            Add Todo
          </button>
        </Form>
      </>
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
