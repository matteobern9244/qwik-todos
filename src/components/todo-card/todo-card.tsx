import { $, component$ } from "@builder.io/qwik";
import "./todo-card.css";
import type { Todo } from "~/models/todo";

interface Props {
  todo: Todo;
}

export const TodoCard = component$(({ todo }: Props) => {
  const deleteNote = $((id: number) => {
    console.log(`Todo with id ${id} deleted.`);
  });
  const toggleNoteStatus = $((status: boolean) => {
    console.log(`Changed todo status to ${status ? "Done" : "Todo"}.`);
  });

  return (
    <div class="todo-card">
      <span class={`description ${todo.done ? "done" : "todo"}`}>
        {todo.description}
      </span>
      <div class="spacer"></div>
      <div class="actions">
        <button onClick$={() => toggleNoteStatus(!todo.done)}>
          {todo.done ? "Mark as Todo" : "Mark as Done"}
        </button>
        <button onClick$={() => deleteNote(todo.id)}>Delete</button>
      </div>
    </div>
  );
});
