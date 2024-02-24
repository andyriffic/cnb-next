import styled from "styled-components";

const PrefixName = styled.strong`
  background: rgb(0, 100, 0, 0.95);
  opacity: 0.5;
  color: white;
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

type Attribute = {
  name: string;
  value: any;
  children?: Attribute[];
};

function sortByNodeType(a: Attribute, b: Attribute) {
  if (!!a.children && !b.children) {
    return 1;
  }

  if (!a.children && !!b.children) {
    return -1;
  }

  return 0;
}

function buildAttributes(obj: { [key: string]: any }): Attribute[] {
  return Object.keys(obj).map((attributeName) => {
    const value = obj[attributeName];
    return {
      name: attributeName,
      value: typeof value === "object" ? undefined : value,
      children: typeof value === "object" ? buildAttributes(value) : undefined,
    };
  });
}

type Props = {
  obj?: { [key: string]: any };
  prefix?: string;
};

const DisplayAttributes = ({
  prefix,
  attributes,
}: {
  prefix: string;
  attributes: Attribute[];
}) => {
  return (
    <>
      {attributes.map((attribute) => {
        return !attribute.children ? (
          <div key={`${prefix}_${attribute.name}`}>
            {prefix && <PrefixName>{prefix}</PrefixName>}
            <AttributeName>{attribute.name}</AttributeName>
            <AttributeValue>{attribute.value.toString()}</AttributeValue>
          </div>
        ) : (
          <DisplayAttributes
            key={`${prefix}_${attribute.name}`}
            prefix={`${prefix}${prefix ? "/" : ""}${attribute.name}`}
            attributes={attribute.children}
          />
        );
      })}
    </>
  );
};

export const AdminPlayerDetail = ({ prefix = "", obj = {} }: Props) => {
  const attributes = buildAttributes(obj).sort(sortByNodeType);
  return <DisplayAttributes prefix={prefix} attributes={attributes} />;
};
