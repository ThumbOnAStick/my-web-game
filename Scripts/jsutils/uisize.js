export class UISize {
    /**
     * @param {number} width
     * @param {number} height
     */
    constructor(width, height) {
        this.width = width;
        this.height = height;
        Object.freeze(this);
    }

    /**
     * Create a new UISize instance when predefined values are insufficient.
     * @param {number} width
     * @param {number} height
     * @returns {UISize}
     */
    static from(width, height) {
        return new UISize(width, height);
    }
}

UISize.ButtonCommon = new UISize(200, 75);
UISize.Slider = new UISize(500, 50);

Object.freeze(UISize);