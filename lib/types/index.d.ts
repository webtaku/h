type CustomTag = `${string}-${string}`;
type Tag = '' | keyof HTMLElementTagNameMap | CustomTag;
type Selector = Tag | `${Tag}#${string}` | `${Tag}.${string}` | `${Tag}#${string}.${string}`;
type ElementByTag<T extends Tag | string> = (T extends '' ? HTMLDivElement : (T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : HTMLElement));
type ElementBySelector<S extends Selector> = (S extends '' ? HTMLDivElement : (S extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[S] : (S extends `${infer T}#${string}` ? ElementByTag<T> : (S extends `${infer T}.${string}` ? ElementByTag<T> : HTMLElement))));
type DataAttributes = {
    [K in `data-${string}`]?: string | number | boolean | null | undefined;
};
type AriaAttributes = {
    [K in `aria-${string}`]?: string | number | boolean | null | undefined;
};
type ElementProps<S extends Selector> = Partial<Omit<ElementBySelector<S>, 'style'>> & {
    style?: Partial<CSSStyleDeclaration> | string;
    class?: string;
    dataset?: Record<string, string | number | boolean | null | undefined>;
    role?: string;
} & DataAttributes & AriaAttributes;
declare function h<S extends Selector>(selector?: S, ...args: (string | ElementProps<S> | null | undefined)[]): string;
export { h };
//# sourceMappingURL=index.d.ts.map