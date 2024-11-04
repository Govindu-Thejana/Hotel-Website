import { useState } from "react";
import DotLoader from "react-spinners/BarLoader";

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

const Loader = () => {
    let [loading] = useState(true);
    let [color] = useState("#14274A");

    return (
        <div className=" h-screen items-center flex sweet-loading">

            <DotLoader
                color={color}
                loading={loading}
                cssOverride={override}
                size={10}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    );
}

export default Loader;