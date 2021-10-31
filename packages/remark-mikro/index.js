const defaultHandlers = {
  heading({depth, children}, meta) {
    let i = depth;
    let entry = meta;
    while(--i) {
      // Get last entry level iteratively or stick with current entry
      entry = entry?.table[entry.table.length - 1] || entry;
    }
    const {value} = defaultHandlers.text(children[0]);
    entry.table.push({value, table: []});
    return {tag: 'header', attrs: {as: `"h${depth}"`}};
  },
  paragraph() {
    return {tag: 'text'};
  },
  emphasis({}) {
    return {tag: 'text', inline: true, attrs: {as: '"i"'}}
  },
  strong({}) {
    return {tag: 'text', inline: true, attrs: {as: '"b"'}}
  },
  inlineCode({value}) {
    return {tag: 'code', inline: true, attrs: {default: `\`${value}\``}}
  },
  code({lang, value}) {
    return {tag: 'codeblock', attrs: {default: `\`${value}\``, lang: `"${lang}"`}};
  },
  blockquote() {
    return {tag: 'quote'};
  },
  html({value}) {
    value = value.replace(/<!---.*-->/g, '').trim();
    return {raw: value};
  },
  text({value}) {
    return {value};
  },
  default() {
    return {tag: 'text'};
  }
}

function walk(node, handlers, depth = 0, spaces = 2, metadata) {
  const {children} = node;
  if(!children?.length) {
    return '';
  }
  return children.reduce((str, child) => {
    const {type} = child;

    if(!handlers[type]) {
      console.warn('No handler for type', type);
    }

    const {tag, attrs = {}, inline = false, raw, value} = 
      handlers[type]?.(child, metadata) || handlers.default(child, metadata);

    const terminator = inline ? '' : '\n';

    if(value) {
      str = `${str}${value}`;
    } else if(typeof raw !== 'undefined') {
      str = raw ? `${str}$!{${raw}}${terminator}` : str;
    } else {
      const attrString = Object.entries(attrs).map(attr => attr.join('=')).join(' ');
      const attrDecl = attrString ? ` ${attrString}` : ''
      const body = walk(child, defaultHandlers, depth + 1, inline ? 0 : spaces, metadata);
      if(!body.trim()) {
        str = `${str}<${tag}${attrDecl} />${terminator}`
      } else {
        str = `${str}<${tag}${attrDecl}>${terminator}${body}${terminator}</${tag}>${terminator}`;
      }
    }
    return str;
  }, '').replace(/^/gm, ' '.repeat(depth * spaces));
}

module.exports = function RemarkMikro(settings = {}) {
  const options = {...settings}

  Object.assign(this, {Compiler: compiler})

  /**
   * @type {import('unified').CompilerFunction<Root, string>}
   */
  function compiler(node, file) {
    file.path = file.cwd;
    file.basename = 'result';
    file.extname = '.marko'
    const {component = 'layout'} = options;
    const metadata = {table: []};
    const result = walk(node, defaultHandlers, options.depth, options.spaces, metadata);
    return `<${component} tableOfContents=${JSON.stringify(metadata.table)}>${result}</${component}>`
  }
}