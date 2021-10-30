import {remark} from 'remark';
import remarkMikro from 'remark-mikro';

remark()
  .use(remarkMikro)
  .process(
`
# Hello world!
Hello _witches_ and **bitches** and \`code\`

## Item 2
\`\`\`sh
npm install
\`\`\`

> sucks to suck

<!-- render this comment --> <!--- not this one -->

<!-- not this one either -->


`)
  .then((file) => {
    // console.log(file)
    console.log(String(file));
  });