import React, { useState, useEffect, useContext, useRef, useReducer, useMemo, useCallback } from "react";
import "./App.css";
import infoContext from "./main.jsx";
import SomeChild from "./SomeChild.jsx";
import useSessionStorage from "./useSessionStorage.jsx";

// ViteのHMR（Hot Module Replacement）を有効にするためのコード
if (import.meta.hot) {
    console.log("HMR is enabled");
    import.meta.hot.accept(() => {
        console.log("Module updated!");
    });
}

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
    /* useStateを使ってカウントの状態を管理 */
    const [count, setCount] = useState(0);

    const handlePlusClick = () => {
        console.log("handlePlusClick");
        setCount(count + 1);
    };

    const handleMinusClick = () => {
        console.log("handleMinusClick");
        setCount(count - 1);
    };


    /* useEffectを使って副作用を管理 */
    // 初回レンダリング時に実行され、countが更新されるたびに実行される
    useEffect(() => {
        console.log("useEffect");
        // setCount(count + 1);
    }, [count]);


    /* useContextを使ってコンテキストの値を取得 */
    // main.jsxで定義されたinfoContextを使用
    const info = useContext(infoContext);


    /* useRefを使ってDOM要素を参照 */
    // useRefはコンポーネントのライフサイクルに依存しない参照を作成する
    const ref = useRef();

    const handleRef = () => {
        console.log(ref);
        alert("value：" + ref.current.value);
    };


    /* useReducerを使って状態管理 */
    const [state, dispatch] = useReducer(reducer, 0);


    /* useMemoを使って計算結果をメモ化 */
    // useMemoは計算結果をメモ化し、依存配列が変更されない限り再計算を避ける
    const [countForMemo01, setCountForMemo01] = useState(0);
    const [countForMemo02, setCountForMemo02] = useState(0);
    // useMemoを使わない場合は以下のコメントアウトを外す
    // const square = () => {
    //     let i = 0;
    //     while (i < 2000000000) {
    //         i++;
    //     }
    //     return count02 * count02;
    // }

    // 依存配列に指定しているcountForMemo02が変更されない限り、計算結果を再利用する
    const square = useMemo(() => {
        let i = 0;
        while (i < 2000000000) {
            i++;
        }
        return countForMemo02 * countForMemo02;
    }, [countForMemo02]);


    /* useCallbackを使って関数をメモ化 */
    // useCallbackは関数をメモ化し、依存配列が変更されない限り新しい関数を作成しない
    const [counter, setCounter] = useState(0);
    // const showCount = () => {
    //     alert('これは重い処理です。現在のカウントは ' + counter + ' です。');
    // };

    // 依存配列に指定しているcounterが変更されない限り、同じ関数を再利用する
    const showCount = useCallback(() => {
        alert('これは重い処理です。現在のカウントは ' + counter + ' です。');
    }, [counter]);


    /* customHookを使ってローカルストレージに値を保存 */
    // useLocalStorageはカスタムフックで、ローカルストレージに値を保存する
    const [age, setAge] = useSessionStorage("age", 24);


    return (
        <div className="app">
            <h1>🚀 Vite + React サンプル</h1>
            <h2>useState, useEffect</h2>
            <p>現在のカウント：</p>
            <h2>{count}</h2>
            <button onClick={handleMinusClick}>-1する</button>
            <button onClick={handlePlusClick}>+1する</button>
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
            <button onClick={() => dispatch({ type: "decrement" })}>－</button>
            <button onClick={() => dispatch({ type: "increment" })}>＋</button>
            <hr />

            <h2>useMemo</h2>
            <div>カウント１：{countForMemo01}</div>
            <div>カウント２：{countForMemo02}</div>
            {/* useMemoを使わない場合は以下のコメントアウトを外す
            画面のレンダリング時に毎回関数が実行されるため、パフォーマンスが低下する。 */}
            {/* <div>結果：{square()}</div> */}
            <div>結果：{square}</div>
            <button onClick={() => setCountForMemo01(countForMemo01 + 1)}>＋</button>
            <button onClick={() => setCountForMemo02(countForMemo02 + 1)}>＋</button>
            <hr />

            <h2>useCallback</h2>
            <div>現在のカウンター：{counter}</div>
            <button onClick={() => setCounter(counter + 1)}>＋</button>
            <SomeChild showCount={showCount} />
            <hr />

            <h2>customHook</h2>
            <p>{age}</p>
            <button onClick={() => setAge(80)}>年齢をセット</button>
        </div>
    );
}

export default App;
