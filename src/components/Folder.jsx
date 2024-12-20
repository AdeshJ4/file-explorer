import React, { useState } from 'react';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/solid';


const Folder = ({ explorer, handleInsertNode, handleDeleteNode, handleUpdateNode }) => {

    console.log('explorer', explorer)
    const [expand, setExpand] = useState(false);
    const [showInput, setShowInput] = useState({ visible: false, isFolder: null });
    const [isRenaming, setIsRenaming] = useState(false);

    const handleNewFolder = (e, isFolder) => {
        e.stopPropagation();
        setExpand(true);
        setShowInput({ visible: true, isFolder });
    };

    const onAddFolder = (e) => {
        if (e.keyCode === 13 && e.target.value) {
            handleInsertNode(explorer.id, e.target.value, showInput.isFolder);
            setShowInput({ ...showInput, visible: false });
        }
    };

    const onRename = (e) => {
        if (e.keyCode === 13 && e.target.value) {
            handleUpdateNode(explorer.id, e.target.value);
            setIsRenaming(false);
        }
    };

    return (
        <div className="mt-5 ml-5">
            <div
                className="flex justify-between items-center p-1.5 w-[500px] rounded-sm shadow-md bg-gray-200 hover:bg-gray-300 transition duration-200 cursor-pointer"
                onClick={() => setExpand((prev) => !prev)}
            >
                <div className="flex items-center space-x-2">
                {explorer?.isFolder && explorer?.items.length > 0 && (
                        expand ?
                            <ChevronDownIcon className="h-5 w-5 inline-block" /> :
                            <ChevronRightIcon className="h-5 w-5 inline-block" />
                    )}
                    <span className="text-xl">{explorer.isFolder ? "📁" : "📄"}</span>
                    {isRenaming ? (
                        <input
                            type="text"
                            autoFocus
                            defaultValue={explorer.name}
                            onKeyDown={onRename}
                            onBlur={() => setIsRenaming(false)}
                            className="w-full pl-3 py-1.5 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"

                        />
                    ) : (
                        <span className="font-medium text-gray-800">{explorer.name}</span>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                {explorer.isFolder && !isRenaming && (
                    <>
                        <button onClick={(e) => handleNewFolder(e, true)} className="px-3 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none">
                            Folder +
                        </button>
                        <button onClick={(e) => handleNewFolder(e, false)} className="px-3 py-1 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none">
                            File +
                        </button>
                    </>
                )}
                {!isRenaming && (
                    <>
                    <button onClick={() => setIsRenaming(true)} className="px-3 py-1 text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none">
                        Rename
                    </button>
                    <button onClick={() => handleDeleteNode(explorer.id)} className="px-3 py-1 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none" >
                        Delete
                    </button>
                    </>
                )}

                    </div>

            </div>
            {expand && (
                <div className="pl-7 transition-all duration-200 ease-in-out">
                    {showInput.visible && (
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
                    )}
                    {explorer.items.map((item) => (
                        <Folder
                            key={item.id}
                            explorer={item}
                            handleInsertNode={handleInsertNode}
                            handleDeleteNode={handleDeleteNode}
                            handleUpdateNode={handleUpdateNode}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Folder;






































// import React, { useState } from 'react';

// const Folder = ({ explorer, handleInsertNode, handleDeleteNode, handleUpdateNode }) => {
//     const [expand, setExpand] = useState(false);
//     const [showInput, setShowInput] = useState({ visible: false, isFolder: null });
//     const [isRenaming, setIsRenaming] = useState(false);
//     const [showFileModal, setShowFileModal] = useState(false); // State for file modal visibility
//     const [selectedFile, setSelectedFile] = useState(null); // To hold the selected file


//     const handleNewFolder = (e, isFolder) => {
//         e.stopPropagation();
//         setExpand(true);
//         setShowInput({ visible: true, isFolder });
//     };

//     const onAddFolder = (e) => {

//         console.log(e.keyCode, e.target.value, 'o');
        
//         if (e.keyCode === 13 && e.target.value) {
//             handleInsertNode(explorer.id, e.target.value, showInput.isFolder);
//             setShowInput({ ...showInput, visible: false });
//         }
//     };

//     const onRename = (e) => {
//         if (e.keyCode === 13 && e.target.value) {
//             handleUpdateNode(explorer.id, e.target.value);
//             setIsRenaming(false);
//         }
//     };

//     // Handle file selection
//     const handleFileSelect = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setSelectedFile(file); // Save the selected file
//             setShowFileModal(false); // Close the modal
//             // You can process the file here (e.g., upload, save to state, etc.)
//             console.log('file', file.name);
            
//             if (e.keyCode === 13 && e.target.value) {
//                 handleInsertNode(explorer.id, file?.name, false);
//                 setShowInput({ ...showInput, visible: false });
//             }
//         }
//     };

//     return (
//         <div className="mt-5 ml-5">
//             <div
//                 className="flex justify-between items-center p-1.5 w-[500px] rounded-sm shadow-md bg-gray-200 hover:bg-gray-300 transition duration-200 cursor-pointer"
//                 onClick={() => setExpand((prev) => !prev)}
//             >
//                 <div className="flex items-center space-x-2">
//                     <span className="text-xl">{explorer.isFolder ? "📁" : "📄"}</span>
//                     {isRenaming ? (
//                         <input
//                             type="text"
//                             autoFocus
//                             defaultValue={explorer.name}
//                             onKeyDown={onRename}
//                             onBlur={() => setIsRenaming(false)}
//                             className="w-full pl-10 pr-3 py-1.5 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//                         />
//                     ) : (
//                         <span className="font-medium text-gray-800">{explorer.name}</span>
//                     )}
//                 </div>

//                 <div className="flex items-center space-x-2">
//                     {explorer.isFolder && !isRenaming && (
//                         <>
//                             <button onClick={(e) => handleNewFolder(e, true)} className="px-3 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none">
//                                 Folder +
//                             </button>
//                             <button onClick={() => setShowFileModal(true)} className="px-3 py-1 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none">
//                                 File +
//                             </button>
//                         </>
//                     )}
//                     {!isRenaming && (
//                         <>
//                             <button onClick={() => setIsRenaming(true)} className="px-3 py-1 text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none">
//                                 Rename
//                             </button>
//                             <button onClick={() => handleDeleteNode(explorer.id)} className="px-3 py-1 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none" >
//                                 Delete
//                             </button>
//                         </>
//                     )}
//                 </div>
//             </div>
//             {expand && (
//                 <div className="pl-7 transition-all duration-200 ease-in-out">
//                     {showInput.visible && (
//                         <div className="relative mt-2 w-96 ml-5 ">
//                             <input
//                                 type="text"
//                                 onKeyDown={onAddFolder}
//                                 className="w-full pl-10 pr-3 py-1.5 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//                                 autoFocus
//                                 onBlur={() => setShowInput({ ...showInput, visible: false })}
//                                 placeholder={showInput.isFolder ? "New Folder" : "New File"}
//                             />
//                             <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400">
//                                 {showInput.isFolder ? "📁" : "📄"}
//                             </span>
//                         </div>
//                     )}
//                     {explorer.items.map((item) => (
//                         <Folder
//                             key={item.id}
//                             explorer={item}
//                             handleInsertNode={handleInsertNode}
//                             handleDeleteNode={handleDeleteNode}
//                             handleUpdateNode={handleUpdateNode}
//                         />
//                     ))}
//                 </div>
//             )}

//             {/* Modal for file selection */}
//             {showFileModal && (
//                 <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
//                     <div className="bg-white p-6 rounded-md shadow-md">
//                         <h3 className="text-xl font-semibold mb-4">Select a File</h3>
//                         <input
//                             type="file"
//                             onChange={handleFileSelect}
//                             accept="*/*" // Allow all file types
//                             className="mb-4"
//                         />
//                         {selectedFile && (
//                             <div className="mt-2">
//                                 <span className="font-medium">Selected File: </span>
//                                 <span>{selectedFile.name}</span> {/* Display the selected file name */}
//                             </div>
//                         )}
//                         <button
//                             onClick={() => setShowFileModal(false)}
//                             className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
//                         >
//                             Close
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Folder;
