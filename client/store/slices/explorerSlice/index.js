import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const API_BASE_URL = 'http://localhost:5000';



const initialState = {
  explorerData: null,
  isLoading: false,
  isError: false,
  errorMessage: '',
  successMessage: '',
};


export const fetchFolderContents = createAsyncThunk('explorer/fetchFolderContents', async (parentId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/read`, { params: { parentId } });
    return response?.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
}
);

export const createItem = createAsyncThunk('explorer/createItem', async ({ parentId, name, type }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create`, { parentId, name, type });
    return { parentId, name, type, message: response.data.message };
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
}
);

export const renameItem = createAsyncThunk('explorer/renameItem', async ({ id, newName }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/rename`, { id, newName });
    return { id, newName, message: response.data.message };
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
}
);

export const deleteItem = createAsyncThunk('explorer/deleteItem', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/delete`, { data: { id } });
    return { id, message: response.data.message };
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
}
);

export const updateStructure = createAsyncThunk('explorer/updateStructure', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/updateStructure`, { data });
    return { data, message: response.data.message };
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
  },
  extraReducers: (builder) => {

    // fetchFolderContents
    builder.addCase(fetchFolderContents.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.errorMessage = '';
    });
    builder.addCase(fetchFolderContents.fulfilled, (state, action) => {

      const oldData = JSON.parse(JSON.stringify(state.explorerData)); 
      console.log('old data ', oldData); // null
      console.log('new data ', action.payload);  // {id: '1', name: 'root', isFolder: true, items: Array(4)}
      
      const updatedItems = oldData?.items?.map(obj =>
        obj.id === action.payload.id ? action.payload : obj
      );
      console.log('updatedItems', updatedItems);  // undefined
      
      const data = {};
      if(oldData === null){console.log(true);
        data = {
          ...action.payload,
          items: updatedItems || [],
        };
      
      }else{
        data = {
          ...oldData,
          items: updatedItems || [],
        };
      }
      
      console.log('data', data);
      
      // state.explorerData = action.payload;
      state.explorerData = data;
      state.isLoading = false;
    });
    builder.addCase(fetchFolderContents.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload;
    });






    // createItem
    builder.addCase(createItem.fulfilled, (state, action) => {
      state.successMessage = action.payload.message;
    });
    builder.addCase(createItem.rejected, (state, action) => {
      state.isError = true;
      state.errorMessage = action.payload;
    });







    // renameItem
    builder.addCase(renameItem.fulfilled, (state, action) => {
      state.successMessage = action.payload.message;
    });
    builder.addCase(renameItem.rejected, (state, action) => {
      state.isError = true;
      state.errorMessage = action.payload;
    });







    // deleteItem
    builder.addCase(deleteItem.fulfilled, (state, action) => {
      state.successMessage = action.payload.message;
    });
    builder.addCase(deleteItem.rejected, (state, action) => {
      state.isError = true;
      state.errorMessage = action.payload;
    });







    // updateStructure
    builder.addCase(updateStructure.fulfilled, (state, action) => {
      state.successMessage = action.payload.message;
    });
    builder.addCase(updateStructure.rejected, (state, action) => {
      state.isError = true;
      state.errorMessage = action.payload;
    });
  },
});

// Export actions and reducer
export const { clearMessages } = explorerSlice.actions;
export default explorerSlice.reducer;
