import { LinksFunction, ActionFunction, redirect } from 'remix';
import { useActionData } from 'remix';
import { Input, TextArea } from '../../components/Input';
import { Button } from '~/components/Button';
import { Checkbox, links as checkboxLinks } from '~/components/Checkbox';
import { supebase } from '~/utils/supabase.server';
import pollStyles from '~/styles/poll.css';

type PollData = {
  id?: string;
  question?: string;
  created_at?: string;
  updated_at?: string;
};

type OptionData = {
  id?: string;
  poll_id?: string;
  value?: string;
  created_at?: string;
  updated_at?: string;
};

export const links: LinksFunction = () => {
  return [...checkboxLinks(), { rel: 'stylesheet', href: pollStyles }];
};

const validateQuestion = (question: string) => {
  if (!question || question.length < 10) {
    return 'Question must be at least 10 characters';
  }
};

const validateOptions = (options: string[]) => {
  const hasValue = options.reduce((prev, curr) => {
    if (curr.length > 0) return prev + 1;
    return prev;
  }, 0);

  if (hasValue < 2) {
    return 'At least 2 options are required.';
  }
};

type ActionData = {
  fieldsErrors?: {
    question?: string;
    option?: string;
  };
  fields: {
    question: string;
    options: string[];
  };
  formError?: string;
};

export let action: ActionFunction = async ({
  request,
}): Promise<Response | ActionData> => {
  const form = await request.formData();
  const fields = {
    question: form.get('question') as string,
    options: form.getAll('option') as string[],
  };

  const fieldsErrors = {
    question: validateQuestion(fields.question),
    option: validateOptions(fields.options),
  };

  if (Object.values(fieldsErrors).some(Boolean)) {
    return { fieldsErrors, fields };
  }

  const poll = await supebase.from<PollData>('poll').insert({
    question: fields.question,
  });

  if (poll.status !== 201 || !poll.data) {
    return { formError: 'Something went worng!', fields };
  }

  const optionsList = fields.options.reduce<OptionData[]>((prev, curr) => {
    if (curr) {
      return [...prev, { value: curr, poll_id: poll.data[0].id }];
    }
    return prev;
  }, []);

  await supebase.from<OptionData>('option').insert(optionsList);

  return redirect(`/poll/${poll.data[0].id}`);
};

const NewPollRoute = () => {
  const actionData = useActionData<ActionData>();

  return (
    <section className="section">
      <div className="container">
        <h1 className="heading">
          Remix <span>Poll</span>
        </h1>
        <div className="content">
          <form method="post" className="form">
            {actionData?.formError && (
              <label className="form-error">{actionData?.formError}</label>
            )}
            <TextArea
              rows={4}
              name="question"
              defaultValue={actionData?.fields?.question}
              placeholder="Type your question here"
            />
            {actionData?.fieldsErrors?.question && (
              <label className="form-error">
                {actionData?.fieldsErrors?.question}
              </label>
            )}
            {[...Array.from(Array(3))].map((_, i) => (
              <Input
                key={`option-${i}`}
                placeholder="Poll option"
                name="option"
                defaultValue={actionData?.fields.options[i]}
              />
            ))}
            {actionData?.fieldsErrors?.option && (
              <label className="form-error">
                {actionData?.fieldsErrors?.option}
              </label>
            )}
            <div className="form-flex">
              <Checkbox name="checking" id="checking">
                Duplication checking
              </Checkbox>
              <Button variant="primary">Add option</Button>
            </div>
            <div className="form-footer">
              <Button type="submit" variant="primary">
                Create Poll
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewPollRoute;
