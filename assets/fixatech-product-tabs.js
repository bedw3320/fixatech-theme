class ProductTabs extends HTMLElement {
  connectedCallback() {
    this.tabs = [...this.querySelectorAll('[ref="tabs[]"]')];
    this.panels = [...this.querySelectorAll('[ref="panels[]"]')];

    // Set initial state: first tab active, rest hidden
    this.selectTab(0);

    this.tablist = this.querySelector('[role="tablist"]');
    if (this.tablist) {
      this.tablist.addEventListener('click', this.handleClick.bind(this));
      this.tablist.addEventListener('keydown', this.handleKeydown.bind(this));
    }
  }

  handleClick(event) {
    const tab = event.target.closest('[role="tab"]');
    if (!tab) return;

    const index = this.tabs.indexOf(tab);
    if (index !== -1) this.selectTab(index);
  }

  handleKeydown(event) {
    const current = this.tabs.indexOf(document.activeElement);
    if (current === -1) return;

    let next;
    if (event.key === 'ArrowRight') {
      next = (current + 1) % this.tabs.length;
    } else if (event.key === 'ArrowLeft') {
      next = (current - 1 + this.tabs.length) % this.tabs.length;
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = this.tabs.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    this.selectTab(next);
    this.tabs[next].focus();
  }

  selectTab(index) {
    this.tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute('aria-selected', selected);
      tab.setAttribute('tabindex', selected ? '0' : '-1');
    });

    this.panels.forEach((panel, i) => {
      if (i === index) {
        panel.removeAttribute('inert');
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('inert', '');
        panel.setAttribute('hidden', '');
      }
    });
  }
}

customElements.define('product-tabs', ProductTabs);
