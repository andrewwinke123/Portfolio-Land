class InvisibleObject extends GameObject {
  constructor(config) {
    super(config);
    this.isVisible = false; // We don't want this object to be visible.
  }

  update() {
    // This object never moves, so its update function is empty.
  }

  // Override the draw function to prevent this object from being drawn.
  draw() {}
}
