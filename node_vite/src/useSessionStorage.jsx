import React from "react";
import { useState, useEffect } from "react";

const useSessionStorage = (key, defaultValue) => {
    const [value, setValue] = useState(() => {
        const jsonValue = window.sessionStorage.getItem(key);
        if(jsonValue !== null) {
            return JSON.parse(jsonValue);
        }
        return defaultValue;
    })

    useEffect(() => {
        window.sessionStorage.setItem(key, JSON.stringify(value));
    }, [value, setValue]);

    return [value, setValue];
};

export default useSessionStorage;
