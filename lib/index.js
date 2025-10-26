const toKebab = (s) => s.replace(/([A-Z])/g, '-$1').toLowerCase();
const toAttrVal = (v) => v === true ? 'true' : v === false ? 'false' : v == null ? '' : String(v);
const normalizeCssText = (css) => css.replace(/^\s*;+/g, '').replace(/;+\s*$/g, '').trim(); // trim leading/trailing semicolons
function h(selector = '', ...args) {
    const parts = selector.split(/([#.])/);
    const tag = parts[0] || 'div';
    let id = '';
    const classes = [];
    const attrs = {};
    // We'll collect styles from both object and string inputs and then join.
    const styleObjectParts = []; // from style object
    const styleStringParts = []; // from style string
    // parse #id and .class from selector
    for (let i = 1; i < parts.length; i += 2) {
        const type = parts[i];
        const value = parts[i + 1];
        if (!value)
            continue;
        if (type === '#')
            id = value;
        else if (type === '.') {
            classes.push(...value.split(/\s+/).filter(Boolean));
        }
    }
    const innerHTML = [];
    for (const arg of args) {
        if (typeof arg === 'string') {
            // NOTE: treated as raw HTML by design
            innerHTML.push(arg);
            continue;
        }
        if (!arg)
            continue;
        const props = arg;
        for (const [key, value] of Object.entries(props)) {
            if (value == null)
                continue;
            if (key === 'style') {
                if (typeof value === 'string') {
                    const css = normalizeCssText(value);
                    if (css)
                        styleStringParts.push(css);
                }
                else if (typeof value === 'object') {
                    for (const [k, v] of Object.entries(value)) {
                        if (v == null)
                            continue;
                        const cssKey = k.startsWith('--') ? k : toKebab(k);
                        styleObjectParts.push(`${cssKey}: ${v}`);
                    }
                }
                continue;
            }
            if (key === 'dataset' && typeof value === 'object') {
                for (const [dKey, dVal] of Object.entries(value)) {
                    if (dVal == null)
                        continue;
                    const kebab = toKebab(dKey);
                    attrs[`data-${kebab}`] = toAttrVal(dVal);
                }
                continue;
            }
            if (key === 'id') {
                id = String(value);
                continue;
            }
            if (key === 'class' || key === 'className') {
                const classNames = String(value).split(/\s+/);
                for (const className of classNames) {
                    if (className)
                        classes.push(className);
                }
                continue;
            }
            if (key.startsWith('data-')) {
                attrs[key] = toAttrVal(value);
                continue;
            }
            if (key.startsWith('aria-')) {
                attrs[key] = toAttrVal(value);
                continue;
            }
            if (typeof value === 'function') {
                console.warn(`Skipping function prop "${key}" — cannot serialize functions in HTML string.`);
                continue;
            }
            // generic attribute
            attrs[key] = toAttrVal(value);
        }
    }
    let attrString = '';
    if (id)
        attrString += ` id="${id}"`;
    if (classes.length)
        attrString += ` class="${classes.join(' ')}"`;
    // Merge style object + style strings
    if (styleObjectParts.length || styleStringParts.length) {
        const styleCombined = [...styleObjectParts, ...styleStringParts].join('; ');
        if (styleCombined)
            attrString += ` style="${styleCombined}"`;
    }
    for (const [k, v] of Object.entries(attrs)) {
        if (k === 'id' || k === 'class' || k === 'style')
            continue; // already handled
        attrString += ` ${k}="${v}"`;
    }
    return `<${tag}${attrString}>${innerHTML.join('')}</${tag}>`;
}
export { h };
//# sourceMappingURL=index.js.map