const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const cloudinary = require('./helpers/cloudinary'); 



const app = express();
const PORT = 5000;

require('./startup/dbConnection')();


const nodeSchema = new mongoose.Schema({
  name: String,
  isFolder: Boolean,
  filePath: String, // For storing file paths
  fileType: String, // For storing file type (e.g., "pdf", "jpg")
  items: [this],
});



// Model for the file structure
const Node = mongoose.model('Node', nodeSchema);

app.use(cors());
app.use(bodyParser.json());


// Set up storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});


const upload = multer({ storage });





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

      return res.json({ message: `${type} created successfully!` });
    } else {
      return res.status(400).json({ error: 'Parent folder not found or invalid.' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});




// 1. Rename Folder/File
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

      return res.json({ message: 'Item renamed successfully!' });
    } else {
      return res.status(400).json({ error: 'Item not found.' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
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

    const nodeDeleted = deleteNodeByIdRecursive(rootObject, id);
    if (!nodeDeleted) {
      return res.status(400).json({ error: 'Item not found.' });
    }

    // Save the updated structure back to the database
    await Node.updateOne({ _id: root._id }, { $set: { items: rootObject.items } });

    return res.json({ message: 'Item deleted successfully!' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});





// 4. Retrieve Folder Contents
// app.get('/read', async (req, res) => {
//   const { parentId } = req.query;
//   try {
//     // Fetch the folder by ID
//     const folder = await findNodeById(parentId);

//     console.log('folder', folder);
    

//     if (folder) {
//       // Extract only the immediate children of the folder
//       const response = {
//         _id: folder._id,
//         name: folder.name,
//         isFolder: folder.isFolder,
//         items: folder.items.map(item => ({
//           _id: item._id,
//           name: item.name,
//           isFolder: item.isFolder,
//         })),
//       };

//       return res.json(response);
//     } else {
//       return res.status(400).json({ error: 'Folder not found.' });
//     }
//   } catch (err) {
//     console.error('Error:', err); // Log error details
//     return res.status(500).json({ error: err.message });
//   }
// });
app.get('/read', async (req, res) => {
  const { parentId } = req.query;
  try {
    // Fetch the folder by ID
    const folder = await findNodeById(parentId);

    if (folder) {
      // Map through the folder items and include filePath for files
      const response = {
        _id: folder._id,
        name: folder.name,
        isFolder: folder.isFolder,
        items: folder.items.map(item => ({
          _id: item._id,
          name: item.name,
          isFolder: item.isFolder,
          ...(item.isFolder ? {} : { filePath: item.filePath || '' }),  // Add filePath only for files
        })),
      };

      return res.json(response);
    } else {
      return res.status(400).json({ error: 'Folder not found.' });
    }
  } catch (err) {
    console.error('Error:', err); // Log error details
    return res.status(500).json({ error: err.message });
  }
});



// 5. Save Entire Folder Structure
app.post('/updateStructure', async (req, res) => {
  const { data } = req.body;

  try {
    await Node.deleteMany(); // Clear existing structure
    await Node.create(data); // Save new structure
    return res.json({ message: 'Structure updated successfully!' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});



// 6. Upload File
// app.post('/upload', upload.array('files', 10), async (req, res) => {
//   const { parentId } = req.body;
//   const files = req.files; // Array of files
  

//   if (!files || files.length === 0) {
//     return res.status(400).json({ error: 'No files uploaded.' });
//   }

//   try {
//     const root = await Node.findOne({ name: 'root' });
//     if (!root) {
//       return res.status(400).json({ error: 'Root folder not found.' });
//     }

//     const rootObject = root.toObject();
//     const parentNode = findNodeByIdRecursive(rootObject, parentId);

//     if (parentNode && parentNode.isFolder) {
//       const newFileNodes = files.map((file) => ({
//         _id: new mongoose.Types.ObjectId(),
//         name: file.originalname,
//         isFolder: false,
//         filePath: file.path,
//         fileType: path.extname(file.originalname).slice(1),
//         items: [],
//       }));

//       // Add all new file nodes to the parent folder
//       parentNode.items.push(...newFileNodes);

//       await Node.updateOne({ name: 'root' }, { $set: { items: rootObject.items } });

//       res.json({
//         message: 'Files uploaded successfully!',
//         files: newFileNodes,
//       });
//     } else {
//       // Delete uploaded files if the parent folder is invalid
//       files.forEach((file) => fs.unlinkSync(file.path));
//       return res.status(400).json({ error: 'Parent folder not found or invalid.' });
//     }
//   } catch (err) {
//     // Clean up uploaded files in case of an error
//     files.forEach((file) => fs.unlinkSync(file.path));
//     return res.status(500).json({ error: err.message });
//   }
// });

app.post('/upload', upload.array('files', 10), async (req, res) => {
  const { parentId } = req.body;
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded.' });
  }

  try {
    const root = await Node.findOne({ name: 'root' });
    if (!root) {
      return res.status(400).json({ error: 'Root folder not found.' });
    }

    const rootObject = root.toObject();
    const parentNode = findNodeByIdRecursive(rootObject, parentId);

    if (parentNode && parentNode.isFolder) {
      const uploadedFileNodes = [];

      // Upload each file to Cloudinary
      for (const file of files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'uploads',  // Optional folder in Cloudinary
          resource_type: 'auto',  // Supports various file types (image, video, etc.)
        });

        // Create new file node
        const newFileNode = {
          _id: new mongoose.Types.ObjectId(),
          name: file.originalname,
          isFolder: false,
          filePath: result.secure_url,  // Cloudinary URL
          fileType: path.extname(file.originalname).slice(1),
          items: [],
        };

        uploadedFileNodes.push(newFileNode);

        // Clean up local file after successful upload
        fs.unlinkSync(file.path);
      }

      // Add files to parent folder
      parentNode.items.push(...uploadedFileNodes);

      // Update database
      await Node.updateOne({ name: 'root' }, { $set: { items: rootObject.items } });

      res.json({
        message: 'Files uploaded to Cloudinary successfully!',
        files: uploadedFileNodes,
      });
    } else {
      files.forEach((file) => fs.unlinkSync(file.path));
      return res.status(400).json({ error: 'Parent folder not found or invalid.' });
    }
  } catch (err) {
    // Clean up files in case of an error
    files.forEach((file) => fs.unlinkSync(file.path));
    return res.status(500).json({ error: err.message });
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

