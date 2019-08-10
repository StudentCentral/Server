const newBooking = function() {
  console.log('newBooking')
  
  let newBooking = {
    user_id: '2',
    vehicle_model_id: 'vehicle_model_id',
    booking_device: 'booking_device',
    booking_created: 'booking_created',
    from_lat: 'from_lat',
    from_long: 'from_long',
    to_lat: 'to_lat',
    to_long: 'to_long',
    package_id: 'package_id',
    travel_type_id: 'test',
    from_area_id: 'test',
    to_area_id: 'test',
    from_city_id: 'test',
    to_city_id: 'test',
    from_date: 'test',
    to_date: '2',
    Car_Cancellation: '1',
  }
  
  $.post('new_booking', newBooking, (data, status) => {
    console.log(data)
    console.log(status)
  })
}