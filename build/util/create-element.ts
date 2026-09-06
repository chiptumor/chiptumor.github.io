const entities: Record<string, string> = {
  "&": "amp",
  "<": "lt",
  ">": "gt",
  '"': "quot",
  "'": "apos"
};

const entityRegex = new RegExp(Object.keys(entities).join("|"), "g");

export function createElement(
  tagName: string,
  attributes: Record<any, any>,
  children?: null | string[]
): string {
  let element = "<" + tagName;

  const attributeEntries = Object.entries(attributes);
  if (attributeEntries.length)
    element +=
      " "
      + attributeEntries.map(
        ([ attribute, value ]) => 
          attribute
          + "=\""
          + String(value)
            .replace(entityRegex, (i) => 
              "&"
              + entities[i]
              + ";"
            )
          + "\""
      ).join(" ");
          
  if (!children)
    element += " />";
  else
    element += ">"
      + children.join("\n")
      + `</${tagName}>`;
  
  return element;
}
