import {dirname} from 'path';
import {fileURLToPath} from 'url';

export default (url) => dirname(fileURLToPath(url));
