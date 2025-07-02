import React from "react";

const SomeChild = React.memo(({showCount}) => {
    return (
        <div>
            <div><b>SomeChild</b></div>
            <div>
                <button onClick={showCount}>カウント</button>
            </div>
        </div>
    );
});

export default SomeChild;
