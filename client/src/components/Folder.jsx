import React, { useState } from 'react';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

const Folder = ({
  explorer,
  openFolders,
  toggleFolderExpansion,
  handleSelectedFolderID,
  handleInsertNode,
  handleDeleteNode,
  handleUpdateNode
}) => {
  const [showInput, setShowInput] = useState({ visible: false, isFolder: null });
  const [isRenaming, setIsRenaming] = useState(false);
  const isExpanded = openFolders[explorer?._id] || false;


  const handleNewFolder = (e, isFolder) => {
    e.stopPropagation();
    toggleFolderExpansion(explorer?._id);
    setShowInput({ visible: true, isFolder });
  };

  const onAddFolder = (e) => {
    if (e.keyCode === 13 && e.target.value) {
      handleInsertNode(explorer?._id, e.target.value, showInput.isFolder);
      setShowInput({ ...showInput, visible: false });
    }
  };

  const onRename = (e) => {
    if (e.keyCode === 13 && e.target.value) {
      handleUpdateNode(explorer?._id, e.target.value);
      setIsRenaming(false);
    }
  };

  return (
    <div className="mt-5 ml-5">
      <div
        className="flex justify-between items-center p-1.5 w-[600px] rounded-sm shadow-md bg-gray-200 hover:bg-gray-300 transition duration-200 cursor-pointer"
        onClick={() => { toggleFolderExpansion(explorer?._id) }}
      >
        <div className="flex items-center space-x-2">
          {explorer?.isFolder && explorer?.items?.length > 0 && (
            isExpanded ? (
              <ChevronDownIcon className="h-5 w-5 inline-block" />
            ) : (
              <ChevronRightIcon className="h-5 w-5 inline-block" />
            )
          )}
          <span className="text-xl">{explorer?.isFolder ? "📁" : "📄"}</span>
          {isRenaming ? (
            <input
              type="text"
              autoFocus
              defaultValue={explorer?.name}
              onKeyDown={onRename}
              onBlur={() => setIsRenaming(false)}
              className="w-full pl-3 py-1.5 text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            />
          ) : (
            <span className="font-medium text-gray-800" onClick={() => handleSelectedFolderID(explorer?._id, explorer?.isFolder)}>{explorer?.name}</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {explorer?.isFolder && !isRenaming && (
            <>
              <button onClick={(e) => handleNewFolder(e, true)} className="px-3 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                </svg>
              </button>
              <button onClick={(e) => handleNewFolder(e, false)} className="px-3 py-1 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </button>
              <button onClick={(e) => handleNewFolder(e, false)} className="px-3 py-1 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                </svg>
              </button>
            </>
          )}
          {!isRenaming && (
            <>
              <button onClick={() => setIsRenaming(true)} className="px-3 py-1 text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </button>
              <button onClick={() => handleDeleteNode(explorer?._id, explorer?.name)} className="px-3 py-1 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
              <button onClick={() => handleDeleteNode(explorer?._id, explorer?.name)} className="px-3 py-1 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="pl-7 transition-all duration-200 ease-in-out">
          {showInput.visible && (
            <div className="relative mt-2 w-96 ml-5">
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
          {explorer?.items?.map((item) => (
            <Folder
              key={item._id}
              explorer={item}
              openFolders={openFolders}
              toggleFolderExpansion={toggleFolderExpansion}
              handleSelectedFolderID={handleSelectedFolderID}
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