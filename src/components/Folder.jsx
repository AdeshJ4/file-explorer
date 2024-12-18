import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";


const Folder = ({ explorer, handleInsertNode }) => {
    const [expand, setExpand] = useState(false);
    const [showInput, setShowInput] = useState({ visible: false, isFolder: null });

    const handleNewFolder = (e, isFolder) => {
        e.stopPropagation();
        setExpand(true);
        setShowInput({
            visible: true,
            isFolder
        })
    }

    const onAddFolder = (e) => {
        if(e.keyCode === 13  && e.target.value){
            handleInsertNode(explorer.id, e.target.value, showInput.isFolder)
            setShowInput({...showInput, visible: false});
        }
    }

    if (explorer?.isFolder) {
        return (
            <div className="mt-5 ml-5">
                <div
                    className="flex justify-between items-center p-1.5 w-96 rounded-sm shadow-md bg-gray-200 hover:bg-gray-300 transition duration-200 cursor-pointer"
                    onClick={() => setExpand((prev) => !prev)}
                >
                    <div className="flex items-center space-x-2">
                        <span className="text-xl">📁</span>
                        <span className="font-medium text-gray-800">{explorer.name}</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button onClick={(e) => handleNewFolder(e, true)} className="px-3 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none">
                            Folder +
                        </button>
                        <button onClick={(e) => handleNewFolder(e, false)} className="px-3 py-1 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none">
                            File +
                        </button>
                        {expand ? <span className='text-2xl'>🔼</span> : <span className='text-2xl'>🔽</span>}
                        {/* {expand ? <ChevronUpIcon className="w-5 h-5 text-gray-700" /> : <ChevronDownIcon className="w-5 h-5 text-gray-700" />} */}
                    </div>
                </div>

                <div className={`pl-7 transition-all duration-200 ease-in-out ${expand ? 'block' : 'hidden'}`}>

                    {
                        showInput.visible && (
                            <div className="relative mt-2 w-96 ml-5 ">
                                <input
                                    type="text"
                                    onKeyDown={onAddFolder}
                                    className="w-full pl-10 pr-3 py-1.5 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                    autoFocus
                                    onBlur={() => setShowInput({ ...showInput, visible: false })}
                                    placeholder={showInput.isFolder ? "New Folder" : "New File"}
                                />

                                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    {showInput.isFolder ? "📁" : "📄"}
                                </span>
                            </div>
                        )
                    }
                    {explorer.items.map((exp, index) => (
                        <Folder explorer={exp} handleInsertNode={handleInsertNode} key={index} />
                    ))}
                </div>
            </div>
        );
    } else {
        return (
            <span className="mt-2.5 ml-5 w-96 flex items-center space-x-2 px-3 py-1 text-gray-800 bg-white rounded-md shadow-sm border border-gray-300 hover:bg-gray-100 transition duration-200">
                📄 <span className="font-medium">{explorer.name}</span>
            </span>

        );
    }
};

export default Folder;
