type CustomTag = `${string}-${string}`;

type Tag = '' | keyof HTMLElementTagNameMap | CustomTag;

type Selector =
  | Tag
  | `${Tag}#${string}`
  | `${Tag}.${string}`
  | `${Tag}#${string}.${string}`;

type ElementByTag<T extends Tag | string> = (
  T extends '' ? HTMLDivElement
  : (
    T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T]
    : HTMLElement
  )
);

type ElementBySelector<S extends Selector> = (
  S extends '' ? HTMLDivElement
  : (
    S extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[S]
    : (
      S extends `${infer T}#${string}` ? ElementByTag<T>
      : (
        S extends `${infer T}.${string}` ? ElementByTag<T>
        : HTMLElement
      )
    )
  )
);

type ElementProps<S extends Selector> =
  & Partial<Omit<ElementBySelector<S>, 'style'>>
  & { style?: Partial<CSSStyleDeclaration>, class?: string };

function h<S extends Selector>(
  selector: S = '' as S,
  ...args: (string | ElementProps<S> | undefined)[]
): string {
  const parts = selector.split(/([#.])/);
  const tag = parts[0] || 'div';

  let id = '';
  const classes: string[] = [];
  const attrs: Record<string, string> = {};
  let style = '';

  for (let i = 1; i < parts.length; i += 2) {
    const type = parts[i] as '#' | '.';
    const value = parts[i + 1];
    if (!value) continue;
    if (type === '#') id = value;
    else if (type === '.') classes.push(value);
  }

  const innerHTML: string[] = [];

  for (const arg of args) {
    if (typeof arg === 'string') {
      innerHTML.push(arg);
    } else if (arg) {
      const props = arg as ElementProps<S>;
      for (const [key, value] of Object.entries(props)) {
        if (key === 'style' && typeof value === 'object') {
          style = Object.entries(value as CSSStyleDeclaration)
            .filter(([_, v]) => v != null) // null/undefined 제거
            .map(([k, v]) => {
              const cssKey = k.startsWith('--')
                ? k
                : k.replace(/([A-Z])/g, '-$1').toLowerCase();
              return `${cssKey}: ${v}`;
            })
            .join('; ');
        } else if (key === 'dataset' && typeof value === 'object') {
          for (const [dKey, dVal] of Object.entries(value as Record<string, string>)) {
            const kebab = dKey.replace(/([A-Z])/g, '-$1').toLowerCase();
            attrs[`data-${kebab}`] = dVal;
          }
        } else if (key === 'id') {
          id = value as string;
        } else if (key === 'class' || key === 'className') {
          const classNames = (value as string).split(/\s+/);
          for (const className of classNames) {
            if (!className) continue;
            classes.push(className);
          }
        } else if (typeof value === 'function') {
          console.warn(`Skipping function prop "${key}" — cannot serialize functions in HTML string.`);
        } else {
          attrs[key] = value as string;
        }
      }
    }
  }

  let attrString = '';
  if (id) attrString += ` id="${id}"`;
  if (classes.length) attrString += ` class="${classes.join(' ')}"`;
  if (style) attrString += ` style="${style}"`;
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'id' || k === 'class' || k === 'style') continue; // 이미 처리
    attrString += ` ${k}="${v}"`;
  }

  return `<${tag}${attrString}>${innerHTML.join('')}</${tag}>`;
}

export { h };
