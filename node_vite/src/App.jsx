import React, { useState, useEffect, useContext, useRef, useReducer, useMemo } from "react";
import "./App.css";
import infoContext from "./main.jsx";

// useReducerの初期値
const reducer = (state, action) => {
    switch (action.type) {
        case "increment":
            return state + 1;
        case "decrement":
            return state - 1;
        default:
            return state;
    }
};

function App() {
    // useStateを使ってカウントの状態を管理
    const [count, setCount] = useState(0);

    // useEffectを使って副作用を管理
    useEffect(() => {
        console.log("useEffect");
        // setCount(count + 1);
    }, [count]);

    // useContextを使ってコンテキストの値を取得
    const info = useContext(infoContext);

    // useRefを使ってDOM要素を参照
    const ref = useRef();

    // useReducerを使って状態管理
    const [state, dispatch] = useReducer(reducer, 0);

    // useMemoを使って計算結果をメモ化
    const [count01, setCount01] = useState(0);
    const [count02, setCount02] = useState(0);
    // const square = () => {
    //     let i = 0;
    //     while (i < 2000000000) {
    //         i++;
    //     }
    //     return count02 * count02;
    // }

    const square = useMemo(() => {
        let i = 0;
        while (i < 2000000000) {
            i++;
        }
        return count02 * count02;
    }, [count02]);

    
    const handlePlusClick = () => {
        console.log("handlePlusClick");
        setCount(count + 1);
    };

    const handleMinusClick = () => {
        console.log("handleMinusClick");
        setCount(count - 1);
    };

    const handleRef = () => {
        console.log(ref);
        console.log("value=" + ref.current.value);
    };

    return (
        <div className="app">
            <h1>🚀 Vite + React サンプル</h1>
            <h2>useState, useEffect</h2>
            <p>現在のカウント：</p>
            <h2>{count}</h2>
            <button onClick={handlePlusClick}>+1する</button>
            <button onClick={handleMinusClick}>-1する</button>
            <hr />

            <h2>useContext</h2>
            <p>名前：{info.name}</p>
            <p>年齢：{info.age}</p>
            <hr />

            <h2>useRef</h2>
            <input type="text" ref={ref} />
            <button onClick={handleRef}>UseRef</button>

            <hr />
            <h2>useReducer</h2>
            <p>現在のカウント：{state}</p>
            <button onClick={() => dispatch({ type: "increment" })}>＋</button>
            <button onClick={() => dispatch({ type: "decrement" })}>－</button>

            <hr />
            <h2>useMemo</h2>
            <div>カウント１：{count01}</div>
            <div>カウント２：{count02}</div>
            <div>結果：{square}</div>
            <button onClick={() => setCount01(count01 + 1)}>＋</button>
            <button onClick={() => setCount02(count02 + 1)}>＋</button>
        </div>
    );
}

export default App;
