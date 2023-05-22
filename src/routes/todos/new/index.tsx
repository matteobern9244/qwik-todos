import { component$ } from "@builder.io/qwik";
import { routeLoader$, z, zod$ } from "@builder.io/qwik-city";
import { routeAction$ } from "@builder.io/qwik-city";
import { TodoEditor } from "~/components/todo-editor/todo-editor";
import { supabaseClient } from "~/lib/supabase";
import type { DocumentHead } from "@builder.io/qwik-city";
import type { TodoForm } from "~/components/todo-editor/todo-editor";
import type { InitialValues } from "@modular-forms/qwik";

export const useFormLoader = routeLoader$<InitialValues<TodoForm>>(() => ({
  title: "",
  description: "",
}));

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
  const todo = useFormLoader();
  const action = useAddTodo();
  return (
    <div>
      <h1 class="text-4xl">Create Todo</h1>
      <TodoEditor
        todo={todo}
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
