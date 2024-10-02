import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = () => {
    return (
        <div className="flex bg-acolor justify-center items-center h-screen">
            <Loader2 className="w-auto h-1/5 text-scolor bg scolor animate-spin" />
        </div>
    );
};

export default Loader;