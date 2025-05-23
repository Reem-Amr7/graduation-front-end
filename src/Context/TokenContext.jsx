import { useEffect, useState, createContext } from "react";

export let TokenContext = createContext();

export default function TokenContextProvider(props) {
    const [token, setToken] = useState(localStorage.getItem("userToken") || null);

    useEffect(() => {
        if (localStorage.getItem("userToken")) {
            setToken(localStorage.getItem("userToken"));
        }
    }, []);

    return (
        <TokenContext.Provider value={{ token, setToken }}>
            {props.children}
        </TokenContext.Provider>
    );
<<<<<<< HEAD
}
=======
}
>>>>>>> 6fef4e1abb7dfe55287dc1a01738559d4c7a4a9e
