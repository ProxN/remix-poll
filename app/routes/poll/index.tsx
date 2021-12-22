import { LoaderFunction } from 'remix';
import { redirect } from 'remix';

export const loader: LoaderFunction = () => {
  return redirect('/poll/new');
};
