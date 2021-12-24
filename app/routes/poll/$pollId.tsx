import {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
  redirect,
  useCatch,
  useLoaderData,
} from 'remix';
import { Button } from '~/components/Button';
import { Checkbox, links as checkboxLinks } from '~/components/Checkbox';
import { PageLayout } from '~/components/PageLayout';
import { OptionData, PollData, VoteData } from '~/types';
import { supebase } from '~/utils/supabase.server';
import pollIdStyles from '~/styles/pollId.css';

export let links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: pollIdStyles }, ...checkboxLinks()];
};

const getClientIp = async (): Promise<string> => {
  const response = await fetch('https://api.db-ip.com/v2/free/self');
  const data = await response.json();
  return data.ipAddress;
};

type LoaderResponse = {
  poll?: PollData;
  options?: OptionData[];
};

export let loader: LoaderFunction = async ({
  params,
}): Promise<LoaderResponse> => {
  const pollResponse = await supebase
    .from<PollData>('poll')
    .select()
    .eq('id', params.pollId);

  if (pollResponse.status !== 200 || !pollResponse.data) {
    throw new Response('Poll not found.', { status: 404 });
  }

  const optionsResponse = await supebase
    .from<OptionData>('option')
    .select()
    .eq('poll_id', pollResponse.data[0].id);

  if (optionsResponse.status !== 200 || !optionsResponse.data) {
    throw new Response('Poll not found.', { status: 404 });
  }

  return { poll: pollResponse.data[0], options: optionsResponse.data };
};

export let action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  const optionId = form.get('option') as string;

  const vote = await supebase
    .from<VoteData>('vote')
    .select()
    .eq('option_id', optionId)
    .eq('poll_id', params.pollId);

  if (vote.data && vote.data.length > 0) {
    return {};
  }

  const ip = await getClientIp();

  await supebase.from<VoteData>('vote').insert({
    option_id: +optionId,
    poll_id: params.pollId,
    ip,
  });

  return redirect(`/poll/${params.pollId}/result`);
};

export const PollId = () => {
  const { poll, options } = useLoaderData<LoaderResponse>();
  return (
    <PageLayout>
      <div className="content">
        <p className="question">{poll?.question}</p>
        <form method="post">
          <div className="poll-options">
            {options?.map((el) => (
              <Checkbox key={el.id} value={el.id} name="option" type="radio">
                {el.value}
              </Checkbox>
            ))}
          </div>
          <div className="actions">
            <Button type="submit" variant="primary">
              Vote
            </Button>
            <Button>Results</Button>
          </div>
        </form>
      </div>
    </PageLayout>
  );
};

export function CatchBoundary() {
  const caught = useCatch();
  if (caught.status === 404) {
    return (
      <PageLayout>
        <div className="content">
          <div>Poll not found</div>
        </div>
      </PageLayout>
    );
  }
  throw new Error(`Unhandled error: ${caught.status}`);
}

export default PollId;
