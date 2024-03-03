import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    origin:null,
    destination:null,
    travelTimeInfo:null,
    plan:null
}

export const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
      setOrigin: (state, action) => {
        state.origin = action.payload
      },
      setDestination:(state,action)=>{
        state.destination = action.payload  
      },
      setTravelTimeInfo:(state,action)=>{
        state.travelTimeInfo = action.payload  
      },
      setPlan:(state,action)=>{
        state.plan = action.payload
      }
    },
  })

export const { setOrigin, setDestination, setTravelTimeInfo , setPlan } = navSlice.actions;

//selectors

export const selectOrigin = (state)=>  state.nav.origin;
export const selectDestination = (state)=>  state.nav.destination;
export const selectTravelTimeInfo = (state)=>  state.nav.travelTimeInfo;
export const selectPlan = (state)=>  state.nav.plan;

export default navSlice.reducer;