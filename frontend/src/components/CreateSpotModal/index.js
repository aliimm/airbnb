import { createOneSpot } from '../../store/spots'
import React, { useState } from 'react';
import { useModal } from "../../context/Modal";
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux';




function CreateSpotModal() {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState([]);
  const history = useHistory()
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [url, setUrl] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    const payload = {
      address,
      city,
      state,
      country,
      lat: +lat,
      lng: +lng,
      name,
      description,
      price: +price,
      url
    };
    // console.log(payload)


    return dispatch(createOneSpot(payload))
    .catch(
      async (res) => {
        if (!res.ok) {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
          if (data && data.message) setErrors([data.message])


        }

      }
      )
      .then(closeModal)
      .then(() => history.push('/'))
    }

//   if (createdSpot) {
//     history.push(`/`);
//     // hideForm();
//   }
//   closeModal()
// };




return (
  <>
    <h1>Create a Spot</h1>
    <form onSubmit={handleSubmit}>
      <ul>
        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
      </ul>
      <label>
        address
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </label>
      <label>
        city
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
      </label>
      <label>
        state
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        />
      </label>
      <label>
        country
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
      </label>
      <label>
        lat
        <input
          type="number"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          required
        />
      </label>
      <label>
        lng
        <input
          type="number"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          required
        />
      </label>
      <label>
        name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        description
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>
      <label>
        price
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </label>
      <label>
        url
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </label>
      <button type="submit">submit</button>
    </form>
  </>
);
}

export default CreateSpotModal;
