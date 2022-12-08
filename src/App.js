import Wrapper from "./components/Wrapper";
import Screen from "./components/Screen";
import ButtonBox from "./components/ButtonBox";
import Button from "./components/Button";
import { useState } from "react";
import { useEffect } from "react";

const btnValues = [
  ["C", "+-", "%", "/"],
  ["7", "8", "9", "X"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["0", ".", "="]
];

const removeSpaces = (num) => {
  return num.toString().replace(/\s/g, "");
}

const toLocaleString = (num) => String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

function App() {

  useEffect(() => {
    document.title = "React Calculator"
  }, []);

  let [calc, setCalc] = useState({
    sign: "", // sinal selecionado
    num: 0, // valor inserido
    res: 0 // valor calculado
  });

  const resetClickHandler = () => {
    setCalc({
      ...calc,
      sign: "",
      num: 0,
      res: 0,
    });
  }

  const invertClickHandler = () => {
    setCalc({
      ...calc,
      num: calc.num ? toLocaleString(removeSpaces(calc.num) * -1) : 0,
      res: calc.res ? toLocaleString(removeSpaces(calc.res) * -1) : 0,
      sign: "",
    });
  }

  const percentClickHandler = () => {
    let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
    let res = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;

    setCalc({
      ...calc,
      num: (num /= Math.pow(100, 1)),
      res: (res /= Math.pow(100, 1)),
      sign: "",
    });
  }

  const equalsClickHandler = () => {
    if (calc.sign && calc.num) {
      const math = (a, b, sign) =>
        sign === "+"
          ? a + b
          : sign === "-"
          ? a - b
          : sign === "X"
          ? a * b
          : a / b;

      setCalc({
        ...calc,
        res:
          calc.num === "0" && calc.sign === "/"
            ? "Can't divide with 0"
            : toLocaleString(
                math(
                  Number(removeSpaces(calc.res)),
                  Number(removeSpaces(calc.num)),
                  calc.sign
                )
              ),
        sign: "",
        num: 0,
      });
    }
  }

  const signClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    setCalc({
      ...calc,
      sign: value,
      res: !calc.res && calc.num ? calc.num : calc.res,
      num: 0,
    });
  }

  const commaClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;
    setCalc({
      ...calc,
      num: !calc.num.toString().includes(".") ? calc.num + value : calc.num,
    });
  }

  const numClickHandler = (e) => { // this function is triggered when buttons 0-9 are pressed
    e.preventDefault();
    const value = e.target.innerHTML;
    if( removeSpaces(calc.num).length < 16 ) {
      setCalc({
        ...calc,
        num:
          removeSpaces(calc.num) % 1 === 0 && !calc.num.toString().includes(".")
          ? toLocaleString(Number(removeSpaces(calc.num + value)))
          : toLocaleString(calc.num + value),
        res: !calc.sign ? 0 : calc.res,
      });
    }
  }

  return (
      <Wrapper>
        <Screen value={ calc.num ? calc.num : calc.res } />
        <ButtonBox>
          {
            btnValues.flat().map( (btn,i) => {
              return (
                <Button 
                  key={i}
                  className={btn === "=" ? "equals" : ""}
                  value={btn}
                  onClick={
                    btn === "C"
                    ? resetClickHandler
                    : btn === "+-"
                    ? invertClickHandler
                    : btn === "%"
                    ? percentClickHandler
                    : btn === "="
                    ? equalsClickHandler
                    : btn === "/" || btn === "X" || btn === "+" || btn === "-"
                    ? signClickHandler
                    : btn === "."
                    ? commaClickHandler
                    : numClickHandler
                  }
                />
              );
            })
          }
        </ButtonBox>
      </Wrapper>
  );
}

export default App;