type Props = {
  label: string;
  id: string;
  value: number;
  onChange: (value: number) => void;
};

export const AdminPlayerEditNumberValue = ({
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
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.valueAsNumber)}
      />
    </fieldset>
  );
};
