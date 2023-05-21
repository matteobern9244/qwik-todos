import { $, component$, useSignal } from "@builder.io/qwik";
import {
  Link,
  routeAction$,
  routeLoader$,
  z,
  zod$,
} from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";
import { TodoCard } from "~/components/todo-card/todo-card";
import { supabaseClient } from "~/lib/supabase";
import type { Todo } from "~/models/todo";

export const useTodos = routeLoader$(async (requestEv) => {
  const supabase = supabaseClient(requestEv);
  const { data: todos } = await supabase.from("todo").select("*");
  return todos;
});

export const useDeleteTodo = routeAction$(
  async ({ id }, requestEv) => {
    const supabase = supabaseClient(requestEv);
    const response = await supabase.from("todo").delete().eq("id", id);
    return response;
  },
  zod$({
    id: z.number(),
  })
);

export const useToggleDone = routeAction$(
  async ({ id, done }, requestEv) => {
    const supabase = supabaseClient(requestEv);
    const response = await supabase
      .from("todo")
      .update({
        done,
      })
      .eq("id", id)
      .select();
    return response;
  },
  zod$({
    id: z.number(),
    done: z.boolean(),
  })
);

export default component$(() => {
  const todosAction = useTodos();
  const deleteTodoAction = useDeleteTodo();
  const todos = useSignal<Todo[]>(todosAction.value as Todo[]);
  const toggleDoneAction = useToggleDone();

  const onDelete$ = $(async (id: number) => {
    const { value: response } = await deleteTodoAction.submit({ id });
    if (response.status === 204) {
      todos.value = todos.value.filter((todo) => todo.id !== id);
    }
  });

  const onUpdate$ = $(async (todo: Todo) => {
    const { value: response } = await toggleDoneAction.submit({
      id: todo.id,
      done: todo.done,
    });
    if (response.status === 200) {
      const updated = response?.data?.[0] as Todo;
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
            onDelete$={(id) => onDelete$(id)}
            onUpdate$={(todo) => onUpdate$(todo)}
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
