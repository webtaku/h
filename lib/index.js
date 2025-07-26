function h(selector = 'div', ...args) {
    const parts = selector.split(/([#.])/);
    const tag = parts[0] || 'div';
    let id = '';
    const classes = [];
    const attrs = {};
    let style = '';
    for (let i = 1; i < parts.length; i += 2) {
        const type = parts[i];
        const value = parts[i + 1];
        if (!value)
            continue;
        if (type === '#')
            id = value;
        else if (type === '.')
            classes.push(value);
    }
    const innerHTML = [];
    for (const arg of args) {
        if (typeof arg === 'string') {
            innerHTML.push(arg);
        }
        else if (arg) {
            const props = arg;
            for (const [key, value] of Object.entries(props)) {
                if (key === 'style' && typeof value === 'object') {
                    style = Object.entries(value)
                        .filter(([_, v]) => v != null) // null/undefined 제거
                        .map(([k, v]) => {
                        const cssKey = k.startsWith('--')
                            ? k
                            : k.replace(/([A-Z])/g, '-$1').toLowerCase();
                        return `${cssKey}: ${v}`;
                    })
                        .join('; ');
                }
                else if (key === 'dataset' && typeof value === 'object') {
                    for (const [dKey, dVal] of Object.entries(value)) {
                        const kebab = dKey.replace(/([A-Z])/g, '-$1').toLowerCase();
                        attrs[`data-${kebab}`] = dVal;
                    }
                }
                else if (key === 'id') {
                    id = value;
                }
                else if (key === 'class' || key === 'className') {
                    const classNames = value.split(/\s+/);
                    for (const className of classNames) {
                        if (!className)
                            continue;
                        classes.push(className);
                    }
                }
                else if (typeof value === 'function') {
                    console.warn(`Skipping function prop "${key}" — cannot serialize functions in HTML string.`);
                }
                else {
                    attrs[key] = value;
                }
            }
        }
    }
    let attrString = '';
    if (id)
        attrString += ` id="${id}"`;
    if (classes.length)
        attrString += ` class="${classes.join(' ')}"`;
    if (style)
        attrString += ` style="${style}"`;
    for (const [k, v] of Object.entries(attrs)) {
        if (k === 'id' || k === 'class' || k === 'style')
            continue; // 이미 처리
        attrString += ` ${k}="${v}"`;
    }
    return `<${tag}${attrString}>${innerHTML.join('')}</${tag}>`;
}
export { h };
//# sourceMappingURL=index.js.map