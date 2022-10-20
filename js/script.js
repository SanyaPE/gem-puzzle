const gamePuzzle = {
  elements: {},
  properties: {
    fieldTarget: [],
    fieldCurr: null,
    fieldSize: 4,
    null: null,
    available: [],
    classes: ["container", "main", "field", "field__item", "empty"],
  },

  //Запуск кода
  //создаем рабочий 2мерный массив _createFieldTarget и настройки Null
  init() {
    console.log("start init");
    this._createFieldTarget();
  },

  //Создаем базовый массив согласно fieldSize
  //вносим в properties массив для сравнения результвта
  _createFieldTarget() {
    let fieldSize = this.properties.fieldSize;
    for (let i = 0; i < Math.pow(fieldSize, 2); i++) {
      //   console.log(i);
      this.properties.fieldTarget[i] =
        i < Math.pow(fieldSize, 2) - 1 ? i + 1 : null;
    }
    // console.log(this.properties.fieldTarget);
    this._createFieldCurrent();
  },

  // Перемешиваем базовый массив (_shuffleArray)
  // создаем рабочий 2мерный массив,
  // проверка решаемости _isSolved, false - запуск заново
  // true - Null add to properties (_setNulltoProp)
  _createFieldCurrent() {
    let array = [...this.properties.fieldTarget];
    let fieldCurr = [];
    // console.log(array);
    array = this._shuffleArray(array);
    // console.log(array);
    for (let i = 0; i < array.length; ) {
      // console.log(i);
      fieldCurr.push(array.slice(i, i + this.properties.fieldSize));
      i += 4;
    }
    // console.log(fieldCurr);
    let isSolved = this._isSolved(fieldCurr);
    // console.log(isSolved);
    if (isSolved) this.properties.fieldCurr = fieldCurr;
    else this._createFieldCurrent();
    this._setNulltoProp();
  },

  //Перемешиваем базовый массив
  _shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  setLocalStorage(setGame) {
    storageGame.push(setGame);
    storageGame.sort((a, b) => a.move - b.move);
    if (storageGame.length > 10) storageGame.pop();
    localStorage.setItem("previousGame", JSON.stringify(storageGame));
    return storageGame;
  },

  // проверка fieldCurr с готовым решением fieldTarget
  isMatchTarget() {
    let target = this.properties.fieldTarget.flat();
    let current = this.properties.fieldCurr.flat();
    return target.every((el, i) => el == current[i]);
  },

  //Проверка на решаемость раздачи
  _isSolved(FieldCurrent) {
    let temp = FieldCurrent;
    // console.log(temp);
    let count = 0;
    for (let i = 0; i < temp.length; i++) {
      for (let j = 0; j < temp[i].length - 1; j++) {
        // console.log(temp[i][j]);
        if (temp[i][j]) {
          //   console.log(temp[i][j], temp[i].slice(j + 1));
          temp[i]
            .slice(j + 1)
            .forEach((elem) => (elem < temp[i][j] && elem ? count++ : null));
        }
        if (!temp[i][j]) count += j + 1;
      }
    }
    // console.log(count);
    return count % 2 ? false : true;
  },

  //Настройки Null в properties
  _setNulltoProp() {
    this.properties.null = this._searchElement(null);
    // координаты доступных для перестановки элементов
    let propNull = this.properties.null;
    let propAval = this.properties.available;
    let propSize = this.properties.fieldSize;
    propAval[0] = propNull[0] > 0 ? [propNull[0] - 1, propNull[1]] : null;
    propAval[1] = propNull[1] > 0 ? [propNull[0], propNull[1] - 1] : null;
    propAval[2] =
      propNull[1] < propSize - 1 ? [propNull[0], propNull[1] + 1] : null;
    propAval[3] =
      propNull[0] < propSize - 1 ? [propNull[0] + 1, propNull[1]] : null;
  },

  toMove() {
    if (event.target.closest(".field__item")) {
      console.log(event.target);
      let elemClick = gamePuzzle._searchElement(event.target.innerHTML);
      console.log("elemClick =>", elemClick);
    }
  },

  _searchElement(element) {
    for (i in this.properties.fieldCurr) {
      for (j in this.properties.fieldCurr[i]) {
        if (this.properties.fieldCurr[i][j] == element) element = [+i, +j];
      }
    }
    return element;
  },

  createElements() {},
};

gamePuzzle.init();
// console.log(gamePuzzle.properties.fieldTarget);
console.log(gamePuzzle.properties.fieldCurr);
console.log(gamePuzzle.properties.null);
console.log(gamePuzzle.properties.available);
// console.log(gamePuzzle.properties.available[0]);
// let a = tik.style.transform = 'translateY(105%)'

//element.style.transform: 'translateY(-n%)'
const field = document.querySelector(".field");
field.addEventListener("click", gamePuzzle.toMove);
