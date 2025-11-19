export class Tutorial {
    constructor() {
        this.isCompleted = false;
        this.onComplete = null;
        this.subtitle = "";
    }

    start() {
        this.isCompleted = false;
        this.bindEvents();
    }

    complete() {
        if (this.isCompleted) return;
        this.isCompleted = true;
        this.unbindEvents();
        if (this.onComplete) {
            this.onComplete();
        }
    }

    bindEvents() {
        // Override in subclass
    }

    unbindEvents() {
        // Override in subclass
    }
}
