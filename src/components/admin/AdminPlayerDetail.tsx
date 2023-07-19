import styled from "styled-components";

const PrefixName = styled.strong`
  background: darkgray;
  color: black;
  display: inline-block;
  padding: 0.3rem;
  margin: 0.1rem;
`;

const AttributeName = styled.strong`
  background: darkgreen;
  color: white;
  display: inline-block;
  padding: 0.3rem;
  margin: 0.1rem;
`;

const AttributeValue = styled.strong`
  /* background: darkgreen;
  color: white; */
  display: inline-block;
  padding: 0.3rem;
  margin: 0.1rem;
  font-weight: bold;
`;

type Props = {
  obj?: { [key: string]: any };
  prefix?: string;
};

export const AdminPlayerDetail = ({ prefix = "details", obj = {} }: Props) => {
  return (
    <div>
      {Object.keys(obj).map((keyName) => {
        const value = obj[keyName];
        if (typeof value === "object") {
          return (
            <AdminPlayerDetail
              key={prefix + keyName}
              obj={value}
              prefix={keyName}
            />
          );
        }

        const displayValue = value.toString();
        return (
          <div key={prefix + keyName}>
            <PrefixName>{prefix}</PrefixName>
            <AttributeName>{keyName}</AttributeName>
            <AttributeValue>{displayValue}</AttributeValue>
          </div>
        );
      })}
    </div>
  );
};
