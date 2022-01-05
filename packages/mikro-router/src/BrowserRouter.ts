// Extends function to avoid Marko deepfreezing 
export class BrowserRouter extends Function {
  constructor() {
    super();
    this.navigate = this.navigate.bind(this);
  }

  events() {
    window.addEventListener('popstate', () => {
      // TODO: navigate to the new url
    });
  }

  navigate(url, data = {}) {
    // TODO: set state internally then navigate to the new url
    window.history.pushState(data, '', url);
  }
}
