import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editOneSpot } from '../../store/spots';

function EditSpot({spots, hideForm}){
    const dispatch = useDispatch();
    const editSelector = useSelector((state) => console.log("!!eee!!",state.spots)
    );


    const [name, setName] = useState(spots.name);
    const [description, setDescription] = useState(spots.description);
    const [price, setPrice] = useState(spots.price);
    const [address, setAddress] = useState(spots.address);
    const [city, setCity] = useState(spots.city);
    const [state, setState] = useState(spots.state);
    const [country, setCountry] = useState(spots.country);


    const updateName = (e) => setName(e.target.value);
    const updateDescription = (e) => setDescription(e.target.value);
    const updatePrice= (e) => setPrice(e.target.value);
    const updateAddress = (e) => setAddress(e.target.value);
    const updateCity = (e) => setCity(e.target.value);
    const updateState = (e) => setState(e.target.value);
    const updateCountry = (e) => setCountry(e.target.value);


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('submitted')

        const updatingSpot = {
          ...spots,
          name,
          description,
          price,
          address,
          city,
          state,
          country,
        };

        let updatedSpot = await dispatch(editOneSpot(updatingSpot));
        if (updatedSpot) {
          hideForm();
        }
      };

      const handleCancelClick = (e) => {
        e.preventDefault();
        hideForm();
      };


    return (
        <section className="edit-form-holder centered middled">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={updateName}
          />
          <input
            type="text"
            placeholder="description"
            value={description}
            onChange={updateDescription}
          />
          <input
            type="number"
            placeholder="price"
            value={price}
            onChange={updatePrice}
          />
            <input
            type="text"
            placeholder="address"
            value={address}
            onChange={updateAddress}
          />
           <input
            type="text"
            placeholder="city"
            value={city}
            onChange={updateCity}
          />
          <input
            type="text"
            placeholder="state"
            value={state}
            onChange={updateState}
          />
            <input
            type="text"
            placeholder="country"
            value={country}
            onChange={updateCountry}
          />

          <button type="submit">Update Spot</button>
          <button
            type="button"
            onClick={handleCancelClick}
          >
            Cancel
          </button>
        </form>
      </section>
    );
  }

  export default EditSpot;
