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
  const isExpanded = openFolders[explorer?.id] || false;  

  const handleNewFolder = (e, isFolder) => {
    e.stopPropagation();
    toggleFolderExpansion(explorer?.id);
    setShowInput({ visible: true, isFolder });
  };

  const onAddFolder = (e) => {
    if (e.keyCode === 13 && e.target.value) {
      handleInsertNode(explorer?.id, e.target.value, showInput.isFolder);
      setShowInput({ ...showInput, visible: false });
    }
  };

  const onRename = (e) => {
    if (e.keyCode === 13 && e.target.value) {
      handleUpdateNode(explorer?.id, e.target.value);
      setIsRenaming(false);
    }
  };

  return (
    <div className="mt-5 ml-5">
      <div
        className="flex justify-between items-center p-1.5 w-[500px] rounded-sm shadow-md bg-gray-200 hover:bg-gray-300 transition duration-200 cursor-pointer"
        onClick={() => {
          toggleFolderExpansion(explorer?.id);
        //   handleSelectedFolderID(explorer?.id, explorer?.isFolder);
        }}
      >
        <div className="flex items-center space-x-2">
          {explorer?.isFolder && explorer?.items.length > 0 && (
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
            <span className="font-medium text-gray-800" onClick={() => handleSelectedFolderID(explorer?.id, explorer?.isFolder)}>{explorer?.name}</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {explorer?.isFolder && !isRenaming && (
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
              <button onClick={() => handleDeleteNode(explorer?.id)} className="px-3 py-1 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none">
                Delete
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
              key={item.id}
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