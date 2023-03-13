import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'previewModeId',
  initialState: {
    value: null,
  },
  reducers: {
    tooglePreviewModeId: (state, action) => {
      state.value =  action.payload;;
    },
  },
});

export const { tooglePreviewModeId } = slice.actions;



// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const getPreviewModeId = state => state.previewModeId.value;

export default slice.reducer;
