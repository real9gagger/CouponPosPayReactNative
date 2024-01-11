import { useCallback, useRef, useState } from "react";

export default function useStateRef(initialState) {
    const [state, setState] = useState(initialState);

    const stateRef = useRef(initialState);

    const stateDispatch = useCallback(stateAction => {
        stateRef.current = (typeof stateAction === "function" ? stateAction(stateRef.current) : stateAction);
        setState(stateRef.current);
    }, []);

    //state：用于视图渲染，仅视图代码能够获取到最新的值，在业务代码中获取到的是旧值（除非使用useEffect监听）
    //stateRef：用于业务代码，修改了不会影响视图代码，不会引起视图的更新
    return [state, stateDispatch, stateRef];
}