
/**
 * Defines the weight range of a weight setting
 */
export default class WeightRange {

  constructor(weight) {
    this.weight = weight;
  }

  /**
   * Minimum weight
   */
  minWeight() {

    return Math.floor(this.weight / 2);

  }

  /**
   * Minimum weight
   */
  maxWeight() {

    return Math.ceil(this.weight * 1.3);

  }
}
