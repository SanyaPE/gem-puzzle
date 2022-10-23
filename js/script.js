// import { elements } from "./elements.js";
const gamePuzzle = {
  elements: {
    header: null,
    main: null,
    footer: null,
    controlsSize: null,
    time: null,
    moves: null,
    field: null,
    // items: null,
  },
  properties: {
    fieldTarget: [],
    fieldCurr: [],
    fieldSize: 4,
    itemSize: null,
    null: null,
    available: [],
    timer: "00:00",
    moves: 0,
  },

  //Запуск кода
  //создаем рабочий 2мерный массив _createFieldTarget и настройки Null
  init() {
    console.log("start init");
    this.createFieldTarget();
    this.createFieldCurrent();
    this.createElements();
    this.setProperties();
    this.fillFieldItem();
  },
  setProperties() {
    let fieldSize = this.properties.fieldSize;
    let controlsSize = this.elements.controlsSize.value;
    if (event) {
      this.properties.fieldSize = controlsSize;
      this.elements.field.innerHTML = "";
      this.properties.fieldTarget = null;
      this.properties.fieldCurr = null;
      this.properties.moves = 0;
      this.properties.timer = "00:00";
      this.createFieldTarget();
      this.createFieldCurrent();
      this.elements.field.appendChild(this._createFieldItem());
      this.fillFieldItem();
    }
    let items = this.elements.field.querySelectorAll(".field__item");
    this.properties.itemSize = `${100 / this.properties.fieldSize - 1}%`
    items.forEach((elem) => {
      elem.style.width = this.properties.itemSize;
      elem.style.height = this.properties.itemSize;
    });
  },

  //Создаем базовый массив согласно fieldSize
  //вносим в properties массив для сравнения результвта
  createFieldTarget() {
    let fieldSize = this.properties.fieldSize;
    this.properties.fieldTarget = [];
    for (let i = 0; i < Math.pow(fieldSize, 2); i++) {
      this.properties.fieldTarget[i] =
        i < Math.pow(fieldSize, 2) - 1 ? i + 1 : null;
    }
  },

  // Перемешиваем базовый массив (_shuffleArray)
  // создаем рабочий 2мерный массив,
  // проверка решаемости _isSolved, false - запуск заново
  // true - Null add to properties (_setNullToProp)
  createFieldCurrent() {
    let fieldTarget = [...this.properties.fieldTarget];
    let fieldSize = +this.properties.fieldSize;
    fieldTarget = this._shuffleArray(fieldTarget);
    let fieldCurr = [];
    for (let i = 0; i < fieldSize; i++) {
      fieldCurr.push(
        fieldTarget.slice(i * fieldSize, i * fieldSize + fieldSize)
      );
    }
    let isSolved = this._isSolved(fieldCurr);
    if (isSolved) this.properties.fieldCurr = fieldCurr;
    else {
      this.properties.fieldCurr = null;
      this.createFieldCurrent();
    }
    this._setNullToProp();
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
  popUp(){
    let popup = document.querySelector(".popup")
    popup.classList.toggle('open')
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
  _setNullToProp() {
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
    console.log("toMove");
    let n = 105;
    let elemClick = event.target;
    let elemClickPos = this._searchElement(elemClick.innerHTML);
    let elemNull = this.elements.field.querySelector(".empty");
    let elemNullPos = this.properties.null;
    let toLeft = (element) => (element.style.transform = `translateX(-${n}%)`);
    let toRight = (element) => (element.style.transform = `translateX(${n}%)`);
    let toUp = (element) => (element.style.transform = `translateY(-${n}%)`);
    let toDown = (element) => (element.style.transform = `translateY(${n}%)`);
    this.properties.available.forEach((pos) => {
      if (pos) pos = pos.join("");
      if (pos == elemClickPos.join("")) {
        this.moveCount();
        if (elemClickPos[0] == elemNullPos[0]) {
          if (elemClickPos[1] < elemNullPos[1]) {
            toRight(elemClick);
            toLeft(elemNull);
          }
          if (elemClickPos[1] > elemNullPos[1]) {
            toLeft(elemClick);
            toRight(elemNull);
          }
        } else if (elemClickPos[0] < elemNullPos[0]) {
          toDown(elemClick);
          toUp(elemNull);
        } else if (elemClickPos[0] > elemNullPos[0]) {
          toUp(elemClick);
          toDown(elemNull);
        }
        let arr = this.properties.fieldCurr;
        let temp = arr[elemNullPos[0]][elemNullPos[1]];
        arr[elemNullPos[0]][elemNullPos[1]] =
          arr[elemClickPos[0]][elemClickPos[1]];
        arr[elemClickPos[0]][elemClickPos[1]] = temp;
        this._setNullToProp();
        this.elements.field.innerHTML = "";
        this.elements.field.appendChild(this._createFieldItem());
        this.fillFieldItem();
        let items = this.elements.field.querySelectorAll(".field__item");
        items.forEach((elem) => {
          elem.style.width = this.properties.itemSize;
          elem.style.height = this.properties.itemSize;
        });
      }
    });
    if (this.isMatchTarget()) this.popUp();
  },

  _searchElement(element) {
    for (let i in this.properties.fieldCurr) {
      for (let j in this.properties.fieldCurr[i]) {
        if (this.properties.fieldCurr[i][j] == element) element = [+i, +j];
      }
    }
    return element;
  },
  time() {
    let scoreTime = document.querySelector(".score__time");
    let seconds = 0;
    let minutes = 0;
    let timer;
    let updateSec = () => {
      seconds += 1;
      if (seconds > 59) {
        seconds = 0;
        minutes += 1;
      }
      if (minutes > 59) {
        minutes = 0;
      }
      scoreTime.innerHTML = `${minutes}:${seconds}`;
    };
  },
  moveCount() {
    this.properties.moves += 1;
    this.elements.moves.innerHTML = this.properties.moves;
  },

  createElements() {
    let fragment = document.createDocumentFragment();
    this._createHeader();
    this._createMain();
    this._createFooter();
    fragment.appendChild(this.elements.header);
    fragment.appendChild(this.elements.main);
    fragment.appendChild(this.elements.footer);
    document.body.appendChild(fragment);

    let popUp = document.createElement("div")
    let text = document.createElement("p")
    popUp.classList.add("popup")
    text.innerHTML = "WINNER"
    popUp.appendChild(text)
    popUp.addEventListener("click", this.popUp)
    document.body.appendChild(popUp)

  },
  _createHeader() {
    //!create header
    this.elements.header = document.createElement("header");
    let container = document.createElement("div");
    let title = document.createElement("h1");
    title.innerHTML = "RSS Gem Puzzle";
    container.classList.add("container");
    container.appendChild(title);
    this.elements.header.appendChild(container);
  },
  _createMain() {
    //create main
    this.elements.main = document.createElement("main");
    //container
    let container = document.createElement("div");
    container.classList.add("container", "main__content");
    //controls
    let controls = document.createElement("div");
    controls.classList.add("controls");
    //!controls Size
    this.elements.controlsSize = document.createElement("select");
    this.elements.controlsSize.classList.add("controls__size");
    this.elements.controlsSize.addEventListener(
      "change",
      this.setProperties.bind(this)
    );

    //box
    let optionsBox = document.createDocumentFragment();
    for (let i = 3; i <= 8; i++) {
      let option = document.createElement("option");
      option.innerHTML = `${i} x ${i}`;
      option.setAttribute(`value`, `${i}`);
      if (i == 4) option.setAttribute("selected", true);
      optionsBox.appendChild(option);
    }

    //box
    let buttonsBox = document.createDocumentFragment();
    let buttons = [
      ["controls__new", "New Game"],
      ["controls__save", "Save"],
      ["controls__result", "Results"],
    ];
    buttons.forEach((elem) => {
      let btn = document.createElement("button");
      btn.classList.add(elem[0]);
      btn.innerHTML = `${elem[1]}`;
      if (elem[0] == "controls__new")
        btn.addEventListener("click", this.setProperties.bind(this));

      buttonsBox.appendChild(btn);
    });
    //!score
    let score = document.createElement("div");
    score.classList.add("score");
    //time
    let scoreTime = document.createElement("div");
    scoreTime.classList.add("score__time");
    let timeInner = document.createElement("span");
    timeInner.innerHTML = "Time:";
    this.elements.time = document.createElement("span");
    this.elements.time.setAttribute("id", "time");
    this.elements.time.innerHTML = this.properties.timer;
    scoreTime.appendChild(timeInner);
    scoreTime.appendChild(this.elements.time);
    score.appendChild(scoreTime);
    //!moves
    let scoreMoves = document.createElement("div");
    scoreMoves.classList.add("score__moves");
    let movesInner = document.createElement("span");
    movesInner.innerHTML = "Moves:";
    this.elements.moves = document.createElement("span");
    this.elements.moves.setAttribute("id", "moves");
    this.elements.moves.innerHTML = this.properties.moves;
    scoreMoves.appendChild(movesInner);
    scoreMoves.appendChild(this.elements.moves);
    score.appendChild(scoreMoves);
    //field
    this.elements.field = document.createElement("div");
    this.elements.field.classList.add("field");
    this.elements.items = this._createFieldItem();
    this.elements.field.appendChild(this._createFieldItem());

    //!собираем MAIN ++
    this.elements.controlsSize.appendChild(optionsBox);
    controls.appendChild(this.elements.controlsSize);
    controls.appendChild(buttonsBox);
    container.appendChild(controls);
    container.appendChild(score);

    container.appendChild(this.elements.field);
      this.elements.main.appendChild(container);
  },
  _createFieldItem() //Создаем пустые Item на базе fieldCurr
  {
    const fragment = document.createDocumentFragment();
    let fieldCurr = this.properties.fieldCurr.flat();
    fieldCurr.forEach((elem) => {
      let fieldItem = document.createElement("div");
      fieldItem.classList.add("field__item");
      if (elem) fieldItem.addEventListener("click", this.toMove.bind(this));
      if (!elem) {
        fieldItem.classList.add("empty");
      }
      fragment.appendChild(fieldItem);
    });
    return fragment;
  },
  //Заполняем массив на базе field, в случае рестарта
  fillFieldItem() {
    let fieldItems = this.elements.field.querySelectorAll(".field__item");
    let fieldCurr = this.properties.fieldCurr.flat();
    fieldItems.forEach((item, index) => {
      item.innerHTML = "";
      item.innerHTML = fieldCurr[index];
    });
  },
  _createFooter() {
    //!create Footer
    this.elements.footer = document.createElement("footer");
    let container = document.createElement("div");
    container.classList.add("container");
    let author = document.createElement("h2");
    author.innerHTML = "2022";
    container.appendChild(author);
    this.elements.footer.appendChild(container);
  },
};

gamePuzzle.init();
