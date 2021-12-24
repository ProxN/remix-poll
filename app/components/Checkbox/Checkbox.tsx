import type { LinksFunction } from 'remix';
import checkboxStyles from './styles.css';

type HTMLInputProps = Omit<
  React.HTMLAttributes<HTMLInputElement>,
  'onChange' | 'type' | 'onBlur' | 'name'
>;

interface CheckboxProps extends HTMLInputProps {
  isChecked?: boolean;
  name?: string;
  isDisabled?: boolean;
  defaultChecked?: boolean;
  value?: string | number;
  type?: 'checkbox' | 'radio';
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: checkboxStyles }];
};

export const Checkbox: React.FC<CheckboxProps> = ({
  children,
  isChecked = false,
  isDisabled = false,
  type = 'checkbox',
  id,
  ...rest
}) => {
  return (
    <label className="checkbox-wrapper" htmlFor={id}>
      <input
        className="checkbox-input"
        type={type}
        disabled={isDisabled}
        checked={isChecked}
        onChange={() => {}}
        id={id}
        {...rest}
      />
      <span className="checkbox-custom">
        <img src="/check.svg" className="checkbox-icon" />
      </span>
      <span className="checkbox-label">{children}</span>
    </label>
  );
};
