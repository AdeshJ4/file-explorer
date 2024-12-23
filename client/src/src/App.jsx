import React, { useEffect, useState } from 'react';
import Folder from './components/Folder';
import { useDispatch, useSelector } from 'react-redux';
import { createItem, deleteItem, fetchFolderContents, renameItem } from '../store/slices/explorerSlice';
import Loader from './components/common/Loader';

const App = () => {
  const dispatch = useDispatch();
  const { explorerData, isLoading, isError } = useSelector(state => state.explorer);
  const [selectedFolderId, setSelectedFolderId] = useState("1");
  const [selectedFolderIsFolder, setSelectedFolderIsFolder] = useState(true);
  const [loadedFolders, setLoadedFolders] = useState([]);
  const [openFolders, setOpenFolders] = useState({});

  const handleInsertNode = (parentId, name, isFolder) => {
    dispatch(createItem({ parentId, name, type: isFolder ? 'folder' : 'file' })).then(() => {
      dispatch(fetchFolderContents(selectedFolderId));
    });
  };

  const handleDeleteNode = (folderId) => {
    dispatch(deleteItem(folderId)).then(() => {
      dispatch(fetchFolderContents(selectedFolderId));
    });
  };

  const handleUpdateNode = (nodeId, newName) => {
    dispatch(renameItem({ id: nodeId, newName })).then(() => {
      dispatch(fetchFolderContents(selectedFolderId));
    });
  };

  const handleSelectedFolderID = (folderId, isFolder) => {
    setSelectedFolderId(folderId);
    setSelectedFolderIsFolder(isFolder);
  };

  const toggleFolderExpansion = (folderId) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  useEffect(() => {
    if (!loadedFolders.includes(selectedFolderId) && selectedFolderIsFolder) {
      dispatch(fetchFolderContents(selectedFolderId)).then(() => {
        setLoadedFolders((prev) => [...prev, selectedFolderId]);
      });
    }
  }, [selectedFolderId, loadedFolders]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error loading data. Please try again later.</div>;
  }

  return (
    <div className="p-5">
      <Folder
        explorer={explorerData}
        openFolders={openFolders}
        toggleFolderExpansion={toggleFolderExpansion}
        handleSelectedFolderID={handleSelectedFolderID}
        handleInsertNode={handleInsertNode}
        handleDeleteNode={handleDeleteNode}
        handleUpdateNode={handleUpdateNode}
      />
    </div>
  );
};

export default App;