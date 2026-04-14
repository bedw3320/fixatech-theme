class ProductTabs extends HTMLElement {
  connectedCallback() {
    this.panels = [...this.querySelectorAll('[ref="panels[]"]')];
    this.tablist = this.querySelector('[ref="tablist"]');
    if (!this.tablist || this.panels.length === 0) return;

    // Filter out empty panels when hide-empty is enabled
    if (this.hasAttribute('data-hide-empty')) {
      this.panels = this.panels.filter((panel) => {
        if (panel.hasAttribute('data-tab-empty') || panel.textContent.trim() === '') {
          panel.remove();
          return false;
        }
        return true;
      });
    }
    if (this.panels.length === 0) return;

    // Build tab buttons from panel data-tab-label attributes
    this.tabs = this.panels.map((panel, i) => {
      const btn = document.createElement('button');
      btn.role = 'tab';
      btn.id = panel.getAttribute('aria-labelledby');
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.setAttribute('aria-controls', panel.id);
      btn.tabIndex = i === 0 ? 0 : -1;
      btn.className = 'fixatech-product-tabs__tab';
      btn.textContent = panel.dataset.tabLabel || `Tab ${i + 1}`;
      this.tablist.appendChild(btn);
      return btn;
    });

    this.selectTab(0);

    this.tablist.addEventListener('click', this.handleClick.bind(this));
    this.tablist.addEventListener('keydown', this.handleKeydown.bind(this));
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
      tab.tabIndex = selected ? 0 : -1;
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
