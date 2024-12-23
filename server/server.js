const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
const PORT = 5000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/explorer', { useNewUrlParser: true, useUnifiedTopology: true });

// Define the schema for a folder/file
const nodeSchema = new mongoose.Schema({
  name: String,
  isFolder: Boolean,
  items: [this], // Recursive schema for nested items
});


// Model for the file structure
const Node = mongoose.model('Node', nodeSchema);

app.use(cors());
app.use(bodyParser.json());

// Helper function to find a node by ID recursively
const findNodeByIdRecursive = (node, id) => {
  if (!node || !node._id) return null;

  // Compare _id as string
  if (node._id.toString() === id) return node;

  // Recursively search in items if it has any
  for (const child of node.items || []) {
    const result = findNodeByIdRecursive(child, id);
    if (result) return result;
  }
  return null;
};

// Helper function to find a node by ID recursively
const findNodeById = async (id) => {
  const root = await Node.findOne({ name: 'root' });
  if (!root) {
    throw new Error('Root folder not found.');
  }

  // Recursively search for the node by ID within the entire tree
  return findNodeByIdRecursive(root, id);
};







// 1. Create Folder/File
app.post('/create', async (req, res) => {
  const { parentId, name, type } = req.body;

  try {
    const root = await Node.findOne({ name: 'root' });
    if (!root) {
      return res.status(400).json({ error: 'Root folder not found.' });
    }

    const rootObject = root.toObject();
    const parentNode = findNodeByIdRecursive(rootObject, parentId);

    if (parentNode && parentNode.isFolder) {
      const newNode = { _id: new mongoose.Types.ObjectId(), name, isFolder: type === 'folder', items: [] };
      parentNode.items.push(newNode);

      await Node.updateOne({ name: 'root' }, { $set: { items: rootObject.items } });

      res.json({ message: `${type} created successfully!` });
    } else {
      res.status(400).json({ error: 'Parent folder not found or invalid.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





app.post('/rename', async (req, res) => {
  const { id, newName } = req.body;
  try {
    // Fetch the root node and recursively search for the target node
    const root = await Node.findOne({ name: 'root' });
    if (!root) {
      return res.status(400).json({ error: 'Root folder not found.' });
    }

    const node = findNodeByIdRecursive(root, id);
    if (node) {
      // Update the node name directly in the nested structure
      node.name = newName;

      // Save the updated structure back to the database
      await Node.updateOne({ _id: root._id }, { $set: { items: root.items } });

      res.json({ message: 'Item renamed successfully!' });
    } else {
      res.status(400).json({ error: 'Item not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});








const deleteNodeByIdRecursive = (node, id) => {
  if (!node || !node.items) return false;

  for (let i = 0; i < node.items.length; i++) {
    if (node.items[i]._id.toString() === id) {
      // Remove the item from the array
      node.items.splice(i, 1);
      return true;
    }

    // Recursively check in the item's children
    const result = deleteNodeByIdRecursive(node.items[i], id);
    if (result) return true;
  }

  return false;
};



// 3. Delete Folder/File
app.delete('/delete', async (req, res) => {
  const { id } = req.body;

  try {
    const root = await Node.findOne({ name: 'root' });
    if (!root) {
      return res.status(400).json({ error: 'Root folder not found.' });
    }

    const rootObject = root.toObject();

    // Log the tree structure before attempting deletion
    console.log('Tree Before Deletion:', JSON.stringify(rootObject, null, 2));

    const nodeDeleted = deleteNodeByIdRecursive(rootObject, id);
    if (!nodeDeleted) {
      return res.status(400).json({ error: 'Item not found.' });
    }

    // Save the updated structure back to the database
    await Node.updateOne({ _id: root._id }, { $set: { items: rootObject.items } });

    res.json({ message: 'Item deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





// 4. Retrieve Folder Contents
app.get('/read', async (req, res) => {
  const { parentId } = req.query;

  try {
    // Fetch the folder by ID
    const folder = await findNodeById(parentId);

    if (folder) {
      // Extract only the immediate children of the folder
      const response = {
        _id: folder._id,
        name: folder.name,
        isFolder: folder.isFolder,
        items: folder.items.map(item => ({
          _id: item._id,
          name: item.name,
          isFolder: item.isFolder,
        })),
      };

      res.json(response);
    } else {
      res.status(400).json({ error: 'Folder not found.' });
    }
  } catch (err) {
    console.error('Error:', err); // Log error details
    res.status(500).json({ error: err.message });
  }
});



// app.get('/read', async (req, res) => {
//   const { folderId } = req.query;

//   try {
//     // Validate folderId
//     // if (!folderId || !folderId.match(/^[0-9a-fA-F]{24}$/)) {
//     //   return res.status(400).json({ error: 'Invalid folder ID.' });
//     // }

//     // Retrieve the root structure from the database
//     const root = await Node.findOne({ _id: "6768f9c22784f2983f94111b" }); // Root folder ID
//     if (!root) {
//       return res.status(400).json({ error: 'Root folder not found.' });
//     }

//     // Convert Mongoose Document to Plain JavaScript Object
//     const rootObject = root.toObject();

//     // Helper function to find the folder by ID recursively
//     const findFolder = (node, folderId) => {
//       if (node._id.toString() === folderId) return node; // Match by _id
//       for (const child of node.items || []) {
//         if (child.isFolder) {
//           const found = findFolder(child, folderId);
//           if (found) return found;
//         }
//       }
//       return null;
//     };

//     const folder = findFolder(rootObject, folderId);

//     if (folder) {
//       // Ensure all items are fully populated recursively
//       const populateItems = (node) => {
//         return {
//           ...node,
//           items: (node.items || []).map((item) =>
//             item.isFolder ? populateItems(item) : item
//           ),
//         };
//       };

//       const populatedFolder = populateItems(folder);

//       res.json(populatedFolder);
//     } else {
//       res.status(404).json({ error: 'Folder not found.' });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error.' });
//   }
// });























// 5. Save Entire Folder Structure
app.post('/updateStructure', async (req, res) => {
  const { data } = req.body;

  try {
    await Node.deleteMany(); // Clear existing structure
    await Node.create(data); // Save new structure
    res.json({ message: 'Structure updated successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





// Initialize root folder if not already present
const initializeRootFolder = async () => {
  const rootExists = await Node.findOne({ name: 'root' });
  if (!rootExists) {
    await Node.create({ name: 'root', isFolder: true, items: [] });
    console.log('Root folder initialized.');
  }
};




// Start the server
app.listen(PORT, async () => {
  console.log(`Server running on ${PORT}`);
  await initializeRootFolder();
});

