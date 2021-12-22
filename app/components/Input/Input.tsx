import type { LinksFunction } from 'remix';
import inputStyles from './styles.css';

interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
  name?: string;
}
interface TextAreaProps extends React.HTMLAttributes<HTMLTextAreaElement> {
  rows?: number;
  name?: string;
}

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: inputStyles }];
};

export const Input: React.FC<InputProps> = (props) => {
  return <input className="input" {...props} />;
};

export const TextArea: React.FC<TextAreaProps> = (props) => {
  return <textarea className="input textarea" {...props} />;
};
