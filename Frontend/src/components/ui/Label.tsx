import { LabelProps } from '../../types';

const Label = ({ children, htmlFor }: LabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium mb-1 text-gray-700"
    >
      {children}
    </label>
  );
};

export default Label;