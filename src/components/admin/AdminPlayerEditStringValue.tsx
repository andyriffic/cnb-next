type Props = {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
};

export const AdminPlayerEditBooleanValue = ({
  label,
  id,
  value,
  onChange,
}: Props) => {
  return (
    <fieldset>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="textt"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </fieldset>
  );
};
