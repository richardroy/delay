export default class Element {

  static getById(elementId) {
    const element = document.getElementById(elementId);
    return element;
  }

  static getValue(element) {
    return element.value;
  }

  static getValueFromId(elementId) {
    var element = this.getById(elementId);
    var value = this.getValue(element);
    return value;
  }
}