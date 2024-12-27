import React, { useState } from 'react';
import axios from 'axios';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import RenameIcon from './common/RenameIcon';
import DeleteIcon from './common/DeleteIcon';
import DownloadIcon from './common/DownloadIcon';
import UploadIcon from './common/UploadIcon';
import FileIcon from './common/FileIcon';
import FolderIcon from './common/FolderIcon';
import { useDispatch } from 'react-redux';
import { fetchFolderContents } from '../../store/slices/explorerSlice';

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
  const [selectedFiles, setSelectedFiles] = useState(null);
  const isExpanded = openFolders[explorer?._id] || false;
  const dispatch = useDispatch();

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

  const handleFileSelect = (e) => {
    const files = e.target.files;
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (!selectedFiles) return;
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i]);
    };
    formData.append('parentId', explorer?._id);
    try {
      await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch(fetchFolderContents(explorer?._id));
    } catch (error) {
      // alert("An error occurred during upload.");
      console.error(error);
    }
  };


  const handleDownloadNode = (downloadPath) => {
    if (!downloadPath) {
      alert('Download path not available.');
      return;
    }
  
    // Extract the base URL and file path
    const parts = downloadPath.split('/upload/');
    if (parts.length < 2) {
      alert('Invalid download path.');
      return;
    }
  
    // Inject fl_attachment after /upload/
    const downloadUrl = `${parts[0]}/upload/fl_attachment/${parts[1]}`;
  
    // Extract filename from path
    const fileName = downloadPath.split('/').pop();
  
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;  // Use the original file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                <FolderIcon />
              </button>
              <button onClick={(e) => handleNewFolder(e, false)} className="px-3 py-1 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none">
                <FileIcon />
              </button>
              <button onClick={() => document.getElementById("file-input").click()} className="">
                <UploadIcon />
              </button>
              <input
                id="file-input"
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <button onClick={handleUpload} className="px-3 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none">
                Upload Files
              </button>
            </>
          )}
          {!isRenaming && (
            <>
              <button onClick={() => setIsRenaming(true)} className="px-3 py-1 text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none">
                <RenameIcon />
              </button>
              <button onClick={() => handleDeleteNode(explorer?._id, explorer?.name)} className="px-3 py-1 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none">
                <DeleteIcon />
              </button>
              {
                !explorer?.isFolder && <button onClick={() => handleDownloadNode(explorer?.filePath)} className="px-3 py-1 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none">
                  <DownloadIcon />
                </button>
              }
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