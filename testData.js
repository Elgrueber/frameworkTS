const { faker } = require('@faker-js/faker');

export function generateGuestDetails() {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.helpers.fromRegExp(/\+1-\d{3}-\d{3}-\d{4}/)
    };
}

export function generateContactFormData() {
    const phoneLength = faker.number.int({ min: 11, max: 21 });
    let phone;

    if (phoneLength <= 14) {
        const digitsNeeded = phoneLength - 2;
        phone = '+1' + faker.string.numeric(digitsNeeded);
    } else {
        const basePhone = '+1-' + faker.string.numeric(3) + '-' + faker.string.numeric(3) + '-' + faker.string.numeric(4);
        
        if (phoneLength === basePhone.length) {
            phone = basePhone;
        } else if (phoneLength < basePhone.length) {
            phone = '+1' + faker.string.numeric(phoneLength - 2);
        } else {
            const extraCharsNeeded = Math.min(phoneLength - basePhone.length, 7);
            const extension = 'x' + faker.string.numeric(extraCharsNeeded - 1);
            phone = basePhone + extension;
        }
    }

    if (phone.length > 21) {
        phone = phone.substring(0, 21);
    }

    const messageLength = faker.number.int({ min: 20, max: 200 });
    let message = '';
    
    const sentences = [
        'I would like to book a room for my upcoming vacation.',
        'Could you please provide more information about your amenities?',
        'I am interested in making a reservation for next month.',
        'Please let me know about availability and pricing.',
        'I have some questions about your bed and breakfast.'
    ];
    
    while (message.length < messageLength - 20) {
        const randomSentence = faker.helpers.arrayElement(sentences);
        message += randomSentence + ' ';
    }
    
    if (message.length < 20) {
        message = 'I would like to make a booking inquiry for your bed and breakfast.';
    }
    
    message = message.substring(0, messageLength).trim();

    return {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: phone,
        subject: faker.helpers.arrayElement([
            'Room Inquiry',
            'Booking Question',
            'Cancellation Request',
            'Special Requirements',
            'General Information'
        ]),
        message: message
    };
}


export function generateBookingPayload(guestDetails, bookingDates, options = {}) {
    const defaultPrice = faker.number.int({ min: 100, max: 500 });
    return {
        firstname: guestDetails.firstName,
        lastname: guestDetails.lastName,
        totalprice: options.totalprice || defaultPrice,
        depositpaid: options.depositpaid ?? faker.datatype.boolean(),
        bookingdates: {
            checkin: bookingDates.checkIn.split('/').reverse().join('-'),
            checkout: bookingDates.checkOut.split('/').reverse().join('-')
        },
        additionalneeds: options.additionalneeds || faker.helpers.arrayElement(['Breakfast', 'Lunch', 'Dinner', 'WiFi', 'Parking'])
    };
}

export function generateBookingDates() {
    const today = new Date();
    const checkIn = new Date(today);
    checkIn.setDate(today.getDate() + Math.floor(Math.random() * 7) + 1);

    const checkOut = new Date(checkIn);
    checkOut.setDate(checkIn.getDate() + Math.floor(Math.random() * 3) + 1);
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return {
        checkIn: formatDate(checkIn),
        checkOut: formatDate(checkOut)
    };
}