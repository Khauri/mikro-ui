const defaultHandlers = {
  heading({depth}) {
    return {tag: 'header', attrs: {as: `h${depth}`}};
  },
  paragraph() {
    return {tag: 'text'};
  },
  emphasis({}) {
    return {tag: 'text', inline: true, attrs: {as: 'i'}}
  },
  strong({}) {
    return {tag: 'text', inline: true, attrs: {as: 'b'}}
  },
  inlineCode({value}) {
    return {tag: 'code', inline: true, attrs: {default: `"${value}"`}}
  },
  code({lang, value}) {
    return {tag: 'codeblock', attrs: {default: `"${value}"`, lang}};
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

function walk(node, handlers, depth = 0, spaces = 2) {
  const {children} = node;
  if(!children?.length) {
    return '';
  }
  return children.reduce((str, child) => {
    const {type} = child;
    if(!handlers[type]) {
      console.warn('No handler for type', type);
    }
    const {tag, attrs = {}, inline = false, raw, value} = handlers[type]?.(child) || handlers.default(child);
    const terminator = inline ? '' : '\n';
    if(value) {
      str = `${str}${value}`;
    } else if(typeof raw !== 'undefined') {
      str = raw ? `${str}$!{${raw}}${terminator}` : str;
    } else {
      const attrString = Object.entries(attrs).map(attr => attr.join('=')).join(' ');
      const attrDecl = attrString ? ` ${attrString}` : ''
      const body = walk(child, defaultHandlers, depth + 1, inline ? 0 : spaces);
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
    return walk(node, defaultHandlers);
  }
}