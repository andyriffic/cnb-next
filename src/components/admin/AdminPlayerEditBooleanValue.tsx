import styled from "styled-components";

type Props = {
  label: string;
  id: string;
  value: boolean;
  onChange: (value: boolean) => void;
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
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
    </fieldset>
  );
};
