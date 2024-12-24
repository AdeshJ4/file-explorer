import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const initialState = {
  explorerData: {},
  breadcrumbs: [],
  isLoading: false,
  isError: false,
  errorMessage: '',
  successMessage: '',
};

// Fetch folder contents
export const fetchFolderContents = createAsyncThunk(
  'explorer/fetchFolderContents',
  async (parentId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/read`, { params: { parentId } });
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create a new item (folder or file)
export const createItem = createAsyncThunk(
  'explorer/createItem',
  async ({ parentId, name, type }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/create`, { parentId, name, type });
      return { parentId, name, type, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Rename an item
export const renameItem = createAsyncThunk(
  'explorer/renameItem',
  async ({ id, newName }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/rename`, { id, newName });
      return { id, newName, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete an item
export const deleteItem = createAsyncThunk(
  'explorer/deleteItem',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/delete`, { data: { id } });
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const explorerSlice = createSlice({
  name: 'explorer',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.errorMessage = '';
      state.successMessage = '';
    },
    clearBreadcrumbs: (state, action) => {
      const id = action.payload;
      const i = state.breadcrumbs.findIndex((curEle) => curEle.id === id);
      const newArr = state.breadcrumbs.slice(0, i);  
      const uniqueArray = newArr.filter((obj, index, self) => 
        index === self.findIndex((el) => el.id === obj.id)
      ); 
      state.breadcrumbs = uniqueArray;      
    }
  },
  extraReducers: (builder) => {



    // fetchFolderContents
    builder.addCase(fetchFolderContents.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.errorMessage = '';
    });
    builder.addCase(fetchFolderContents.fulfilled, (state, action) => {
      state.breadcrumbs.push({ id: action?.payload?._id, name: action?.payload?.name });
      state.explorerData = action.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchFolderContents.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload;
    });








    //createItem
    builder.addCase(createItem.fulfilled, (state, action) => {
      const { parentId, name, type } = action.payload;
      const newItem = { _id: Date.now().toString(), name, isFolder: type === 'folder', items: [] };

      const updateTree = (node) => {
        if (node._id === parentId) {
          node.items = node.items || [];
          node.items.push(newItem);
        } else if (node.items) {
          node.items.forEach(updateTree);
        }
      };

      updateTree(state.explorerData);
      state.successMessage = action.payload.message;
    });
    builder.addCase(createItem.rejected, (state, action) => {
      state.isError = true;
      state.errorMessage = action.payload;
    });





    // renameItem
    builder.addCase(renameItem.fulfilled, (state, action) => {
      const { id, newName } = action.payload;

      const updateTree = (node) => {
        if (node._id === id) {
          node.name = newName;
        } else if (node.items) {
          node.items.forEach(updateTree);
        }
      };

      updateTree(state.explorerData);
      state.successMessage = action.payload.message;
    });
    builder.addCase(renameItem.rejected, (state, action) => {
      state.isError = true;
      state.errorMessage = action.payload;
    });





    // deleteItem
    builder.addCase(deleteItem.fulfilled, (state, action) => {
      const { id } = action.payload;

      const removeNode = (items) => {
        return items.filter((item) => {
          if (item._id === id) return false;
          if (item.items) item.items = removeNode(item.items);
          return true;
        });
      };

      state.explorerData.items = removeNode(state.explorerData.items);
      state.successMessage = action.payload.message;
    });
    builder.addCase(deleteItem.rejected, (state, action) => {
      state.isError = true;
      state.errorMessage = action.payload;
    });
  },
});

// Export actions and reducer
export const { clearMessages, clearBreadcrumbs } = explorerSlice.actions;
export default explorerSlice.reducer;