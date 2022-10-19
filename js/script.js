const gamePuzzle = {
  elements: {},
  properties: {
    fieldTarget: [],
    fieldCurr: null,
    fieldSize: 4,
    classes: ["container", "main", "field", "field__item", "empty"],
  },
  // 1
  init() {
    console.log("start init");
    this._createFieldTarget();
  },
  // 2
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
  // 3
  _createFieldCurrent() {
    let array = [...this.properties.fieldTarget];
    let fieldCurr = [];
    // console.log(array);
    array = this._shuffleArray(array);
    // console.log(array);
    for (let i = 0; i < array.length; ) {
    //   console.log(i);
      fieldCurr.push(array.slice(i, i + this.properties.fieldSize));
      i += 4;
    }
    // console.log(fieldCurr);
    let isSolved = this._isSolved(fieldCurr);
    // console.log(isSolved);
    if (isSolved) this.properties.fieldCurr = fieldCurr;
    else this._createFieldCurrent();
  },
  //4
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
  isMatchTarget() {
    let target = this.properties.fieldTarget.flat();
    let current = this.properties.fieldCurr.flat();
    return target.every((el, i) => el == current[i]);
  },
  //5
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
  toMove() {},
  createElements(){


  }
};

gamePuzzle.init();
console.log(gamePuzzle.properties.fieldTarget);
console.log(gamePuzzle.properties.fieldCurr);
const tik = document.querySelector(".tik")
tik.addEventListener("click", move)
function move(){
  console.log(event.target);
  console.log(event.target.innerHTML);
  console.log(tik.innerHTML);
  // let a = tik.style.transform = 'translateY(105%)'
  let a = tik.style.transform = 'translateX(-105%)'
  console.log(a);
}

//element.style.transform: 'translateY(-n%)'
