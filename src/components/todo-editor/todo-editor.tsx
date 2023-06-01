import { $, component$ } from "@builder.io/qwik";
import { z } from "@builder.io/qwik-city";
import { zodForm$ } from "@modular-forms/qwik";
import { useForm } from "@modular-forms/qwik";
import type { Signal } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";
import type { Maybe, SubmitHandler } from "@modular-forms/qwik";
import { LuPencil, LuPlus } from "@qwikest/icons/lucide";

interface Props {
  todo: Readonly<
    Signal<{
      title: Maybe<string>;
      description: Maybe<string>;
    }>
  >;
  onSubmit$: PropFunction<(title: string, description: string) => void>;
  actionName: "Create" | "Edit";
}

const todoSchema = z.object({
  title: z.string().min(1, "Please enter a title."),
  description: z.string().min(1, "Please enter a description."),
});

export type TodoForm = z.infer<typeof todoSchema>;

const inputStyle = "input input-bordered w-full";

export const TodoEditor = component$(
  ({ todo, onSubmit$, actionName }: Props) => {
    const [, { Form, Field }] = useForm<TodoForm>({
      loader: todo,
      validate: zodForm$(todoSchema),
    });

    const handleSubmit: SubmitHandler<TodoForm> = $((values) => {
      onSubmit$(values.title, values.description);
    });

    return (
      // I need this, but i dunno why
      // eslint-disable-next-line qwik/valid-lexical-scope
      <Form onSubmit$={handleSubmit} class="flex flex-col gap-4 mt-8">
        <Field name="title">
          {(field, props) => (
            <div>
              <label class="label">
                <span class="label-text">Title</span>
              </label>
              <input
                {...props}
                type="text"
                value={field.value}
                class={`${inputStyle} ${
                  field.error ? "input-error" : "input-info"
                }`}
              />
              {field.error && (
                <div class="alert alert-error shadow-sm mt-2">
                  <span>{field.error}</span>
                </div>
              )}
            </div>
          )}
        </Field>
        <Field name="description">
          {(field, props) => (
            <div>
              <label class="label">
                <span class="label-text">Description</span>
              </label>
              <input
                {...props}
                type="text"
                value={field.value}
                class={`${inputStyle} ${
                  field.error ? "input-error" : "input-info"
                }`}
              />
              {field.error && (
                <div class="alert alert-error shadow-sm mt-2">
                  <span>{field.error}</span>
                </div>
              )}
            </div>
          )}
        </Field>
        <button
          type="submit"
          class="flex items-center justify-center gap-3 py-2 px-4 bg-sky-600 rounded-md text-white mt-8"
        >
          {actionName === "Create" ? <LuPlus /> : <LuPencil />}
          {actionName}
        </button>
      </Form>
    );
  }
);
