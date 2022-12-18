import {  useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editOneSpot } from '../../store/spots';
import { useHistory } from 'react-router-dom'


function EditSpot({ spots }) {
  const dispatch = useDispatch();
  const editSelector = useSelector((state) => state.spots.oneSpot)
  // console.log(editSelector)


  const history = useHistory()

  const [name, setName] = useState(editSelector.name);
  const [description, setDescription] = useState(editSelector.description);
  const [price, setPrice] = useState(editSelector.price);
  const [address, setAddress] = useState(editSelector.address);
  const [city, setCity] = useState(editSelector.city);
  const [state, setState] = useState(editSelector.state);
  const [country, setCountry] = useState(editSelector.country);


  const updateName = (e) => setName(e.target.value);
  const updateDescription = (e) => setDescription(e.target.value);
  const updatePrice = (e) => setPrice(e.target.value);
  const updateAddress = (e) => setAddress(e.target.value);
  const updateCity = (e) => setCity(e.target.value);
  const updateState = (e) => setState(e.target.value);
  const updateCountry = (e) => setCountry(e.target.value);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatingSpot = {
      id: editSelector.id,
      name,
      description,
      price,
      address,
      city,
      state,
      country,
      lat: 890,
      lng: 844
    };

    let updatedSpot = await dispatch(editOneSpot(updatingSpot));
    if (updatedSpot) {
      // redirect
      history.push(`/`);
      // hideForm();
    }
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    history.push(`/`);
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
