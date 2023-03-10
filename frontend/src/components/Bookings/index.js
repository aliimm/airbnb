import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react'
import { useHistory, NavLink } from 'react-router-dom'
import { getBookingsThunk, deleteBookingThunk } from '../../store/booking'
import './bookings.css'



const SessionBookings = () => {
    const dispatch = useDispatch()
    const history = useHistory()


    const bookingsObj = useSelector(state => state.booking.bookings)
    const bookings = Object.values(bookingsObj)

    useEffect(() => {
        // console.log('use')
        dispatch(getBookingsThunk())
    }, [dispatch])


    const pastBookings = bookings.filter(booking => {
        const splitEnd = booking.endDate.split('-')
        const endYear = Number(splitEnd[0])
        const endMonth = Number(splitEnd[1])
        const endDay = Number(splitEnd[2])

        const date = new Date()
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()

        if (endYear < year) return true
        else if (endYear === year && endMonth < month) return true
        else if (endMonth === month && endDay < day) return true
        else {
            return false
        }
    })
    const futureBookings = bookings.filter(booking => {
        const splitStart = booking.startDate.split('-')

        const startYear = Number(splitStart[0])
        const startMonth = Number(splitStart[1])
        const startDay = Number(splitStart[2])

        const splitEnd = booking.endDate.split('-')
        const endDay = Number(splitEnd[2])

        const date = new Date()
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()

        if (startYear > year) return true
        else if (startYear === year && startMonth > month) return true
        else if (startYear === year && startMonth === month && startDay >= day) return true
        else if (startYear === year && startMonth === month && startDay < day && endDay > day) return true
        else {
            return false
        }

    })
    console.log('book', bookings)
    console.log('p', pastBookings)
    console.log('f', futureBookings)

    const splitDate = (date) => {
        const split = date.split('T')
        return split[0]
    }

    const handleDeletion = async (id) => {
        const response = dispatch(deleteBookingThunk(id))


        if (response) {
            history.push('/bookings')
            alert('Canceled Successfully!')
        }
    }


    return (
        <div className='bookings-container'>
            <div className='previous-bookings-title'>Upcoming Trips</div>
            <div className='all-bookings'>

                {futureBookings.map(booking => (

                    <div className='bookingCard'>
                        <img className='image-booking' src={booking.Spot.previewImage}></img>
                        <div className='booking-city-date'>
                            <div className='city-booking-title'>{booking.Spot.city}, {booking.Spot.state}</div>
                            <div className='date-booking'>{splitDate(booking.startDate)}</div>
                            <div className='date-booking'>{splitDate(booking.endDate)}</div>
                            <button onClick={() => handleDeletion(booking.id)} className='cancel-booking-button'>Cancel Trip</button>
                        </div>


                    </div>
                ))}

            </div>
            <div className='previous-bookings-title'>Where you’ve been</div>
            <div className='all-bookings'>
                {pastBookings.map(booking => (
                    <div className='bookingCard'>
                        <div><img className='image-booking' src={booking.Spot.previewImage}></img></div>
                        <div className='booking-city-date'>
                            <div className='city-booking-title'>{booking.Spot.city}, {booking.Spot.state}</div>
                            <div className='date-booking'>{splitDate(booking.startDate)}</div>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    )
}

export default SessionBookings
