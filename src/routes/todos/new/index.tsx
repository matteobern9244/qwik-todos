import { component$ } from "@builder.io/qwik";
import { z, zod$ } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeAction$ } from "@builder.io/qwik-city";
import { TodoEditor } from "~/components/todo-editor/todo-editor";
import { supabaseClient } from "~/lib/supabase";

export const useAddTodo = routeAction$(
  async (data, requestEv) => {
    const supabase = supabaseClient(requestEv);
    const { data: todo } = await supabase.from("todo").insert({
      title: data.title,
      description: data.title,
    });
    return todo;
  },
  zod$({
    title: z.string(),
    description: z.string(),
  })
);

export default component$(() => {
  const action = useAddTodo();
  return (
    <div>
      <h1 class="text-4xl">Create Todo</h1>
      <TodoEditor
        actionName="Create"
        onSubmit$={(title, description) => {
          action.submit({
            title,
            description,
          });
        }}
      />
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
