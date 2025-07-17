import { h } from '../src';

// These unit tests verify that the `html` helper correctly parses the selector
// and constructs the expected HTML string.

describe('h()', () => {
  it('creates a div element by default', () => {
    const result = h();
    expect(result).toContain('<div');
  });

  it('creates the specified tag', () => {
    const result = h('span');
    expect(result.startsWith('<span')).toBe(true);
  });

  it('assigns an id when # is present', () => {
    const result = h('div#foo');
    expect(result).toContain('id="foo"');
  });

  it('assigns multiple classes when .class is present', () => {
    const result = h('div.bar.baz');
    expect(result).toContain('class="bar baz"');
  });

  it('appends children to the created element', () => {
    const result = h('div', h('p', 'child'));
    expect(result).toContain('<p>child</p>');
  });

  it('creates a div by default with empty selector', () => {
    const result = h('');
    expect(result.startsWith('<div')).toBe(true);
  });

  it('creates specified tag', () => {
    const result = h('span');
    expect(result.startsWith('<span')).toBe(true);
  });

  it('adds id correctly', () => {
    const result = h('#myid');
    expect(result).toContain('id="myid"');
  });

  it('adds classes correctly', () => {
    const result = h('.foo.bar');
    expect(result).toContain('class="foo bar"');
  });

  it('combines tag, id and classes', () => {
    const result = h('section#myid.foo.bar');
    expect(result.startsWith('<section')).toBe(true);
    expect(result).toContain('id="myid"');
    expect(result).toContain('class="foo bar"');
  });

  it('appends multiple children', () => {
    const result = h('div',
      h('p', 'child1'),
      h('span', 'child2')
    );
    expect(result).toContain('<p>child1</p>');
    expect(result).toContain('<span>child2</span>');
  });
});
