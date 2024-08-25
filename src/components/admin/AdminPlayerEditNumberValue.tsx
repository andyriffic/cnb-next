type Props = {
  label: string;
  id: string;
  value: number;
  min?: number;
  onChange: (value: number) => void;
};

export const AdminPlayerEditNumberValue = ({
  label,
  id,
  value,
  onChange,
  min = 0,
}: Props) => {
  return (
    <fieldset>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="number"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.valueAsNumber)}
      />
    </fieldset>
  );
};
