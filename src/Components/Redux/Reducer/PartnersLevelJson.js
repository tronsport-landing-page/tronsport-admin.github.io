import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'partnersLevelJson',
  initialState: {
    value: {},
  },
  reducers: {
    tooglePartnersLevelJson: (state, action) => {
      state.value =  action.payload;;
    },
  },
});

export const { tooglePartnersLevelJson } = slice.actions;



// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const getPartnersLevelJson = state => state.partnersLevelJson.value;

export default slice.reducer;
