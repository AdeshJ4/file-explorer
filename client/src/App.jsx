
import React, { useState } from 'react'
import explorer from './data/folderData';
import Folder from './components/Folder';
import useTraverseTree from './hooks/use-traverse-tree';


const App = () => {
  const [explorerData, setExplorerData] = useState(explorer);
  const { insertNode, deleteNode, updateNode } = useTraverseTree();

  const handleInsertNode = (folderId, item, isFolder) => {
      console.log(folderId, item, isFolder);
      
      const finalTree = insertNode(explorerData, folderId, item, isFolder);
      setExplorerData(finalTree);
  };

  const handleDeleteNode = (nodeId) => {
      const finalTree = deleteNode(explorerData, nodeId);
      setExplorerData(finalTree);
  };

  const handleUpdateNode = (nodeId, newName) => {
      const finalTree = updateNode(explorerData, nodeId, newName);
      setExplorerData(finalTree);
  };


  console.log(explorerData);
  

  return (
      <div>
          <Folder 
              explorer={explorerData} 
              handleInsertNode={handleInsertNode} 
              handleDeleteNode={handleDeleteNode} 
              handleUpdateNode={handleUpdateNode} 
          />
      </div>
  );
};

export default App;
