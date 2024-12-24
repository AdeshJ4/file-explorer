import React, { useEffect, useState } from 'react';
import Folder from './components/Folder';
import { useDispatch, useSelector } from 'react-redux';
import { clearBreadcrumbs, createItem, deleteItem, fetchFolderContents, renameItem } from '../store/slices/explorerSlice';
import Loader from './components/common/Loader';
import BreadCrumb from './components/common/BreadCrumb';

const App = () => {
  const dispatch = useDispatch();
  const { explorerData, breadcrumbs, isLoading, isError } = useSelector(state => state.explorer);
  const [selectedFolderId, setSelectedFolderId] = useState("6768f9c22784f2983f94111b");
  const [openFolders, setOpenFolders] = useState({});

  const handleInsertNode = (parentId, name, isFolder) => {
    dispatch(createItem({ parentId, name, type: isFolder ? 'folder' : 'file' })).then(() => {
      dispatch(fetchFolderContents(selectedFolderId));
    });
  };

  const handleDeleteNode = (folderId, folderName) => {

    const uniqueArray = Array.from(
      new Map(
        [...breadcrumbs, { id: folderId, name: folderName }]
          .map(obj => [obj.id, obj])
      ).values()
    );

    const deletedFolder = uniqueArray.findIndex((b) => b.id === folderId);
    
    
    dispatch(deleteItem(folderId)).then(() => {
      dispatch(fetchFolderContents(breadcrumbs[deletedFolder-1]?.id));
      dispatch(clearBreadcrumbs(folderId));
    });
  };

  const handleUpdateNode = (nodeId, newName) => {
    dispatch(renameItem({ id: nodeId, newName })).then(() => {
      dispatch(fetchFolderContents(selectedFolderId));
    });
  };

  const handleSelectedFolderID = (folderId, isFolder) => {
    setSelectedFolderId(folderId);
  };

  const toggleFolderExpansion = (folderId) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  useEffect(() => {
    dispatch(fetchFolderContents(selectedFolderId))
  }, [selectedFolderId]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error loading data. Please try again later.</div>;
  }


  return (
    <div className="p-5">

      <BreadCrumb setSelectedFolderId={setSelectedFolderId} />

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