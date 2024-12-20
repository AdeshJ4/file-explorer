const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs
const cors = require('cors'); // Import the CORS package

const app = express();
const PORT = 5000;
const DATA_FILE = './data/explorer.json';

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// Helper function to load the current file structure
const loadData = () => {
  // checking file exist or not
  if (!fs.existsSync(DATA_FILE)) {
    return { id: '1', name: 'root', isFolder: true, items: [] };
  }
  return fs.readJsonSync(DATA_FILE);
};

// Helper function to save the updated file structure
const saveData = (data) => {
  fs.writeJsonSync(DATA_FILE, data, { spaces: 2 });
};

// 1. Create Folder/File
app.post('/create', (req, res) => {
  const { parentId, name, type } = req.body;
  const data = loadData();

  const createItem = (node) => {
    if (node.id === parentId && node.isFolder) {
      const newItem = { id: uuidv4(), name, isFolder: type === 'folder', items: [] };
      node.items.push(newItem);
      return true;
    }
    for (const child of node.items) {
      if (createItem(child)) return true;
    }
    return false;
  };

  if (createItem(data)) {
    saveData(data);
    res.json({ message: `${type} created successfully!` });
  } else {
    res.status(400).json({ error: 'Parent folder not found or invalid.' });
  }
});

// 2. Rename Folder/File
app.post('/rename', (req, res) => {
  const { id, newName } = req.body;
  const data = loadData();

  const renameItem = (node) => {
    if (node.id === id) {
      node.name = newName;
      return true;
    }
    for (const child of node.items) {
      if (renameItem(child)) return true;
    }
    return false;
  };

  if (renameItem(data)) {
    saveData(data);
    res.json({ message: 'Item renamed successfully!' });
  } else {
    res.status(400).json({ error: 'Item not found.' });
  }
});

// 3. Delete Folder/File
app.delete('/delete', (req, res) => {
  const { id } = req.body;
  const data = loadData();

  const deleteItem = (node, parent) => {
    const index = node.items.findIndex((child) => child.id === id);
    if (index !== -1) {
      node.items.splice(index, 1);
      return true;
    }
    for (const child of node.items) {
      if (deleteItem(child, node)) return true;
    }
    return false;
  };

  if (deleteItem(data, null)) {
    saveData(data);
    res.json({ message: 'Item deleted successfully!' });
  } else {
    res.status(400).json({ error: 'Item not found.' });
  }
});

// 4. Retrieve Folder Contents
// app.get('/read', (req, res) => {
//   const { parentId } = req.query;
//   const data = loadData();

//   const findFolder = (node) => {
//     if (node.id === parentId) return node;
//     for (const child of node.items) {
//       const found = findFolder(child);
//       if (found) return found;
//     }
//     return null;
//   };

//   const folder = findFolder(data);
//   if (folder) {
//     res.json(folder);
//   } else {
//     res.status(400).json({ error: 'Folder not found.' });
//   }
// });
// 4. Retrieve Folder Contents with Optional Nested Expansion
app.get('/read', (req, res) => {
  const { parentId, expandNested = 'false' } = req.query;
  const data = loadData();

  const findFolder = (node) => {
    if (node.id === parentId) return node;
    for (const child of node.items) {
      const found = findFolder(child);
      if (found) return found;
    }
    return null;
  };

  const folder = findFolder(data);
  if (folder) {
    // Remove nested items unless expandNested is true
    if (expandNested !== 'true') {
      folder.items = folder.items.map(item => ({
        id: item.id,
        name: item.name,
        isFolder: item.isFolder,
        items: item.isFolder ? [] : item.items,
      }));
    }
    res.json(folder);
  } else {
    res.status(400).json({ error: 'Folder not found.' });
  }
});





// 5. Save Entire Folder Structure
app.post('/updateStructure', (req, res) => {
  const { data } = req.body;
  saveData(data);
  res.json({ message: 'Structure updated successfully!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

// const express = require('express');
// const bodyParser = require('body-parser');
// const fs = require('fs-extra');
// const { v4: uuidv4 } = require('uuid'); // For generating unique IDs
// const cors = require('cors'); // Import the CORS package

// const app = express();
// const PORT = 5000;
// const DATA_FILE = './data/explorer.json';

// app.use(cors()); // Enable CORS for all routes
// app.use(bodyParser.json());

// // Helper function to load the current file structure
// const loadData = () => {
//   // checking file exist or not
//   if (!fs.existsSync(DATA_FILE)) {
//     return { id: '1', name: 'root', isFolder: true, items: [] };
//   }
//   return fs.readJsonSync(DATA_FILE);
// };

// // Helper function to save the updated file structure
// const saveData = (data) => {
//   fs.writeJsonSync(DATA_FILE, data, { spaces: 2 });
// };

// // 1. Create Folder/File
// app.post('/create', (req, res) => {
//   const { parentId, name, type } = req.body;
//   const data = loadData();

//   const createItem = (node) => {
//     if (node.id === parentId && node.isFolder) {
//       const newItem = { id: uuidv4(), name, isFolder: type === 'folder', items: [] };
//       node.items.push(newItem);
//       return true;
//     }
//     for (const child of node.items) {
//       if (createItem(child)) return true;
//     }
//     return false;
//   };

//   if (createItem(data)) {
//     saveData(data);
//     res.json({ message: `${type} created successfully!` });
//   } else {
//     res.status(400).json({ error: 'Parent folder not found or invalid.' });
//   }
// });

// // 2. Rename Folder/File
// app.post('/rename', (req, res) => {
//   const { id, newName } = req.body;
//   const data = loadData();

//   const renameItem = (node) => {
//     if (node.id === id) {
//       node.name = newName;
//       return true;
//     }
//     for (const child of node.items) {
//       if (renameItem(child)) return true;
//     }
//     return false;
//   };

//   if (renameItem(data)) {
//     saveData(data);
//     res.json({ message: 'Item renamed successfully!' });
//   } else {
//     res.status(400).json({ error: 'Item not found.' });
//   }
// });

// // 3. Delete Folder/File
// app.delete('/delete', (req, res) => {
//   const { id } = req.body;
//   const data = loadData();

//   const deleteItem = (node, parent) => {
//     const index = node.items.findIndex((child) => child.id === id);
//     if (index !== -1) {
//       node.items.splice(index, 1);
//       return true;
//     }
//     for (const child of node.items) {
//       if (deleteItem(child, node)) return true;
//     }
//     return false;
//   };

//   if (deleteItem(data, null)) {
//     saveData(data);
//     res.json({ message: 'Item deleted successfully!' });
//   } else {
//     res.status(400).json({ error: 'Item not found.' });
//   }
// });

// // 4. Retrieve Folder Contents
// app.get('/read', (req, res) => {
//   const { parentId } = req.query;
//   const data = loadData();

//   const findFolder = (node) => {
//     if (node.id === parentId) return node;
//     for (const child of node.items) {
//       const found = findFolder(child);
//       if (found) return found;
//     }
//     return null;
//   };

//   const folder = findFolder(data);
//   if (folder) {
//     res.json(folder);
//   } else {
//     res.status(400).json({ error: 'Folder not found.' });
//   }
// });

// // 5. Save Entire Folder Structure
// app.post('/updateStructure', (req, res) => {
//   const { data } = req.body;
//   saveData(data);
//   res.json({ message: 'Structure updated successfully!' });
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on ${PORT}`);
// });
