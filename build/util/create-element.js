const entities = {
  "&": "amp",
  "<": "lt",
  ">": "gt",
  '"': "quot",
  "'": "apos"
};

const entityRegex = new RegExp(Object.keys(entities).join("|"), "g");

/**
 * @param {string} tagName
 * @param {Record<any, any>} attributes
 * @param {null | string[]} [children]
 * @returns {string}
 */
export function createElement(tagName, attributes, children) {
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
