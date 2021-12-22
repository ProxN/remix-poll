import type { LinksFunction } from 'remix';
import buttonStyles from './styles.css';

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  type?: 'submit' | 'button' | 'reset';
}

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: buttonStyles }];
};

export const Button: React.FC<ButtonProps> = (props) => {
  const { variant = 'secondary', ...rest } = props;
  return <button className={`btn btn-${variant}`} {...rest} />;
};
