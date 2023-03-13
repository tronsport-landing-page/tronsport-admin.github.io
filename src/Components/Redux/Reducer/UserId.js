import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'userId',
  initialState: {
    value: "",
  },
  reducers: {
    toogleuserId: (state, action) => {
      state.value =  action.payload;;
    },
  },
});

export const { toogleuserId } = slice.actions;



// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const getuserId = state => state.userId.value;

export default slice.reducer;
