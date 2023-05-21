import { component$ } from "@builder.io/qwik";
import { routeAction$, routeLoader$, z, zod$ } from "@builder.io/qwik-city";
import { TodoEditor } from "~/components/todo-editor/todo-editor";
import { supabaseClient } from "~/lib/supabase";
import type { Todo } from "~/models/todo";

export const useTodo = routeLoader$(async (requestEv) => {
  const { id } = requestEv.params;
  const { redirect } = requestEv;
  const supabase = supabaseClient(requestEv);
  const response = await supabase.from("todo").select().eq("id", id);
  if (response.status === 404) {
    redirect(304, "/");
  }
  return response;
});

export const useEditTodo = routeAction$(
  async (data, requestEv) => {
    const { id } = requestEv.params;
    const supabase = supabaseClient(requestEv);
    const { data: todo } = await supabase
      .from("todo")
      .update({
        title: data.title,
        description: data.description,
      })
      .eq("id", id);
    return todo;
  },
  zod$({
    title: z.string(),
    description: z.string(),
  })
);

export default component$(() => {
  const { value: todo } = useTodo();
  const action = useEditTodo();
  return (
    <div>
      <h1 class="text-4xl">Edit Todo</h1>
      <TodoEditor
        todo={todo.data?.[0] as Todo}
        actionName="Edit"
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
