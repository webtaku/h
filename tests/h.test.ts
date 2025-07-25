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

  describe('custom tag', () => {
    it('creates a custom tag element', () => {
      const html = h('my-component');
      expect(html.startsWith('<my-component')).toBe(true);
      expect(html).toContain('</my-component>');
    });

    it('creates a custom tag with id and class', () => {
      const html = h('my-widget#custom-id.foo.bar');
      expect(html.startsWith('<my-widget')).toBe(true);
      expect(html).toContain('id="custom-id"');
      expect(html).toContain('class="foo bar"');
      expect(html).toContain('</my-widget>');
    });
  });

  describe('dataset', () => {
    it('assigns dataset properties correctly', () => {
      const html = h('div', {
        dataset: {
          foo: 'bar',
          answer: '42',
          isReady: 'true'
        }
      });

      expect(html).toContain('data-foo="bar"');
      expect(html).toContain('data-answer="42"');
      expect(html).toContain('data-is-ready="true"');
    });

    it('assigns dataset with other attributes', () => {
      const html = h('span#myid.foo', {
        className: 'bar',
        dataset: { helloWorld: 'hi' },
        title: 'my title'
      });

      expect(html).toContain('id="myid"');
      expect(html).toContain('class="foo bar"');
      expect(html).toContain('data-hello-world="hi"');
      expect(html).toContain('title="my title"');
    });
  });

  describe('style', () => {
    it('applies simple style properties', () => {
      const html = h('div', {
        style: {
          fontFamily: 'Arial',
          backgroundColor: 'red'
        }
      });
      expect(html).toContain('style="font-family: Arial; background-color: red"');
    });

    it('ignores null and undefined style properties', () => {
      const html = h('div', {
        style: {
          color: 'blue',
          fontSize: undefined,
          lineHeight: null
        } as any
      });
      expect(html).toContain('style="color: blue');
      expect(html).not.toContain('font-size');
      expect(html).not.toContain('line-height');
    });

    it('preserves CSS custom properties (variables)', () => {
      const html = h('div', {
        style: {
          '--my-color': 'green',
          backgroundColor: 'yellow'
        } as any
      });
      expect(html).toContain('--my-color: green');
      expect(html).toContain('background-color: yellow');
    });
  });

  describe('className', () => {
    it('appends className to selector classes', () => {
      const html = h('div.foo', {
        className: 'bar baz'
      });
      expect(html).toContain('class="foo bar baz"');
    });

    it('ignores empty class names', () => {
      const html = h('div', {
        className: ''
      });
      expect(html).not.toContain('class=""');
    });
  });

  describe('attributes', () => {
    it('sets arbitrary attributes', () => {
      const html = h('button', {
        type: 'button',
        disabled: true,
        title: 'Click me'
      });
      expect(html).toContain('type="button"');
      expect(html).toContain('disabled="true"');
      expect(html).toContain('title="Click me"');
    });
  });
});
