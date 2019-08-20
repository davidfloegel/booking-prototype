# Studio Booking Prototype

This is a prototype to test out how working with majorly complex booking rules given by rehearsal
studios could work in an interface.

## Get it running

```
git clone git@github.com:davidfloegel/booking-prototype.git
yarn
yarn start
```

## Booking Rules Examples

Timestable:
- Off peak: 11am - 5pm
- On Peak: 5pm - Close

Prices:
- Off Peak: £6.50 p/h
- On Peak: £17.50 p/h

### Solo Slot

> A solo slot is a booking option for single musicians that just want to practice on their own.  

- Available Monday - Friday, 11am - 5pm
- Solo sessions *after 5pm* are only bookable on the day or the day before
- Prices during the day are £6.50 p/h
- Prices in the evening are £17.50 p/h

### Teaching Slot

> A teaching slot is meant for teachers that use the facilities to teach their students.

- Available Monday - Friday, 11am - 5pm
- Teaching slots *after 5pm* are only bookable on the day or the day before
- The minimum booking duration is 3 hours
- Can be booked for less than 3 hours if booked on the day and there is a 2h slot for example
- Prices during the day are £10.00 p/h
- Prices during the evening are £17.50 p/h

### Band Slot

> A band slot is for a group of several people to rehearse.

- Available Monday - Friday, 11am - Close
- Band Slots *after 5pm* require a minimum booking duration of 3 hours
- Can book slots less than 3h if there's a slot available that's for example 1h or 2h
- Prices during the day are £6.50 p/h
- Prices in the evening are £17.50 p/h
