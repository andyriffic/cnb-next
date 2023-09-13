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
      value: obj[attributeName],
      children: typeof value === "object" ? buildAttributes(value) : undefined,
    };
  });
}

type Props = {
  obj?: { [key: string]: any };
  prefix?: string;
};

const DisplayAttributeValue = ({
  prefix,
  attribute,
}: {
  prefix: string;
  attribute: Attribute;
}) => {
  return !attribute.children ? (
    <div>
      {prefix && <PrefixName>{prefix}</PrefixName>}
      <AttributeName>{attribute.name}</AttributeName>
      <AttributeValue>{attribute.value}</AttributeValue>
    </div>
  ) : (
    <div>
      {attribute.children.map((childAttribute) => (
        <DisplayAttributeValue
          key={`${prefix}_${childAttribute.name}}`}
          prefix={attribute.name}
          attribute={childAttribute}
        />
      ))}
    </div>
  );
};

export const AdminPlayerDetail = ({ prefix = "", obj = {} }: Props) => {
  const attributes = buildAttributes(obj).sort(sortByNodeType);
  console.log("AdminPlayerDetail", attributes);
  return (
    <div>
      {attributes.map((attribute) => (
        <DisplayAttributeValue
          key={attribute.name}
          prefix={prefix}
          attribute={attribute}
        />
      ))}
    </div>
  );
  // return (
  //   <div>
  //     {Object.keys(obj)
  //       .sort()
  //       .map((keyName) => {
  //         const value = obj[keyName];
  //         if (typeof value === "object") {
  //           return (
  //             <AdminPlayerDetail
  //               key={prefix + keyName}
  //               obj={value}
  //               prefix={keyName}
  //             />
  //           );
  //         }

  //         const displayValue = value.toString();
  //         return (
  //           <div key={prefix + keyName}>
  //             {prefix && <PrefixName>{prefix}</PrefixName>}
  //             <AttributeName>{keyName}</AttributeName>
  //             <AttributeValue>{displayValue}</AttributeValue>
  //           </div>
  //         );
  //       })}
  //   </div>
  // );
};
