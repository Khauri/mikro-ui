// Extends function to avoid Marko deepfreezing 
export class BrowserRouter extends Function {
  constructor() {
    super();

  }
}
