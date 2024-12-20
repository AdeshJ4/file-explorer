import React, { useEffect, useState } from 'react'
import Folder from './components/Folder';
import { useDispatch, useSelector } from 'react-redux';
import { createItem, deleteItem, fetchFolderContents, renameItem } from '../store/slices/explorerSlice';
import Loader from './components/common/Loader';

const App = () => {
  const dispatch = useDispatch();
  const { explorerData, isLoading, isError } = useSelector(state => state.explorer);
  const [selectedFolderId, setSelectedFolderId] = useState("1");


  const handleInsertNode = (parentId, name, isFolder) => {
    dispatch(createItem({ parentId, name, type: isFolder? 'folder': 'file' })).then(() => {
        dispatch(fetchFolderContents(1));
    })
  };

  const handleDeleteNode = (folderId) => {
    dispatch(deleteItem(folderId)).then(() => {
        dispatch(fetchFolderContents(1));
    })
  };

  const handleUpdateNode = (nodeId, newName) => {    
    dispatch(renameItem({ id: nodeId, newName })).then(() => {
        dispatch(fetchFolderContents(1));
    })
  };

  const handleSelectedFolderID = (folderId) => {
    setSelectedFolderId(folderId);
  }
  

  useEffect(() => {
    dispatch(fetchFolderContents(selectedFolderId));
  }, [selectedFolderId]);
  
  // console.log('explorerData', explorerData);
  

    if (isLoading) {
        return <Loader />;
    }

  if (isError) {
    return <div>Error loading data. Please try again later.</div>;
  }

  return (
      <div className='p-5'>
          <Folder 
              explorer={explorerData} 
              handleSelectedFolderID={handleSelectedFolderID}
              handleInsertNode={handleInsertNode} 
              handleDeleteNode={handleDeleteNode} 
              handleUpdateNode={handleUpdateNode} 
          />
      </div>
  );
};

export default App;