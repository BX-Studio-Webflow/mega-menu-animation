"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/utils/navbar-animation.ts
  var NavbarAnimationController = class {
    state = {
      current: null,
      previous: null
    };
    dropdownOrder = ["products", "solutions", "resources", "company"];
    /**
     * Initialize the navbar animation controller
     */
    init() {
      const toggles = [
        { element: document.querySelector('[dev-target="products-toggle"]'), name: "products" },
        { element: document.querySelector('[dev-target="solutions-toggle"]'), name: "solutions" },
        { element: document.querySelector('[dev-target="resources-toggle"]'), name: "resources" },
        { element: document.querySelector('[dev-target="company-toggle"]'), name: "company" }
      ];
      toggles.forEach(({ element: toggle, name: dropdownName }) => {
        if (!toggle) {
          console.error(`Toggle not found for ${dropdownName}`);
          return;
        }
        const dropdown = toggle.closest(".nav_menu-dropdown");
        if (!dropdown) {
          console.error(`Dropdown container not found for ${dropdownName}`);
          return;
        }
        const content = dropdown.querySelector(".nav_dropdown-content, .navbar_dropdown-content");
        if (!content) {
          console.error(`Dropdown content not found for ${dropdownName}`);
          return;
        }
        toggle.addEventListener("mouseenter", () => {
          this.handleDropdownEnter(dropdownName, content);
        });
        dropdown.addEventListener("mouseleave", () => {
          this.handleDropdownLeave(dropdownName);
        });
      });
    }
    /**
     * Handle dropdown enter event
     */
    handleDropdownEnter(dropdownName, contentElement) {
      const direction = this.getAnimationDirection(dropdownName);
      contentElement.classList.remove(
        "slide-from-left",
        "slide-from-right",
        "slide-out-left",
        "slide-out-right"
      );
      if (direction === "left") {
        contentElement.classList.add("slide-from-left");
      } else if (direction === "right") {
        contentElement.classList.add("slide-from-right");
      }
      this.state.previous = this.state.current;
      this.state.current = dropdownName;
    }
    /**
     * Handle dropdown leave event
     */
    handleDropdownLeave(dropdownName) {
      if (this.state.current === dropdownName) {
        this.state.previous = this.state.current;
        this.state.current = null;
      }
    }
    /**
     * Determine animation direction based on dropdown order
     */
    getAnimationDirection(currentDropdown) {
      if (!this.state.previous) return "none";
      const currentIndex = this.dropdownOrder.indexOf(currentDropdown);
      const previousIndex = this.dropdownOrder.indexOf(this.state.previous);
      if (currentIndex > previousIndex) {
        return "right";
      }
      if (currentIndex < previousIndex) {
        return "left";
      }
      return "none";
    }
    /**
     * Reset the animation state
     */
    reset() {
      this.state = {
        current: null,
        previous: null
      };
    }
  };

  // src/index.ts
  window.Webflow ||= [];
  window.Webflow.push(() => {
    const navbarController = new NavbarAnimationController();
    navbarController.init();
  });
})();
//# sourceMappingURL=index.js.map
