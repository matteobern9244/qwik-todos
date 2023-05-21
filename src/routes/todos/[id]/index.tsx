import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { supabaseClient } from "~/lib/supabase";

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

export default component$(() => {
  const { value: todo } = useTodo();
  return (
    <div class="p-4">
      <p class="text-4xl mb-4">{todo.data?.[0].title}</p>
      <p>{todo.data?.[0].description}</p>
    </div>
  );
});
