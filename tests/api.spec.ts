import { test, expect } from '@playwright/test';
import { generateGuestDetails, generateBookingDates, generateBookingPayload } from '../testData.js';
import { authenticateUser } from '../helpers/apiMethods.js';

test.describe('Booking API CRUD', () => {
  let bookingId: number;
  let authToken: string;
  const baseURL = process.env.BASE_API_URL!;

  test.beforeAll(async ({ request }) => {
    authToken = await authenticateUser(request, baseURL);
  });

  test('Create booking', async ({ request }) => {
    const guestDetails = generateGuestDetails();
    const bookingDates = generateBookingDates();
    const bookingPayload = generateBookingPayload(guestDetails, bookingDates);

    const response = await request.post(`${baseURL}/booking`, {
      data: bookingPayload,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    bookingId = responseBody.bookingid;

    expect(bookingId).toBeDefined();
    expect(typeof bookingId).toBe('number');
    expect(responseBody.booking).toBeDefined();

    expect(responseBody.booking.firstname).toBe(bookingPayload.firstname);
    expect(responseBody.booking.lastname).toBe(bookingPayload.lastname);
    expect(responseBody.booking.totalprice).toBe(bookingPayload.totalprice);
    expect(responseBody.booking.depositpaid).toBe(bookingPayload.depositpaid);
    expect(responseBody.booking.additionalneeds).toBe(bookingPayload.additionalneeds);
    expect(responseBody.booking.bookingdates.checkin).toBe(bookingPayload.bookingdates.checkin);
    expect(responseBody.booking.bookingdates.checkout).toBe(bookingPayload.bookingdates.checkout);

    const verifyResponse = await request.get(`${baseURL}/booking/${bookingId}`);
    expect(verifyResponse.status()).toBe(200);
  });

  test('Get booking', async ({ request }) => {
    const guestDetails = generateGuestDetails();
    const bookingDates = generateBookingDates();
    const createPayload = generateBookingPayload(guestDetails, bookingDates);

    const createResponse = await request.post(`${baseURL}/booking`, {
      data: createPayload,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const createBody = await createResponse.json();
    const createdBookingId = createBody.bookingid;

    const getResponse = await request.get(`${baseURL}/booking/${createdBookingId}`);

    expect(getResponse.status()).toBe(200);

    const booking = await getResponse.json();

    expect(booking.firstname).toBeDefined();
    expect(booking.lastname).toBeDefined();
    expect(booking.totalprice).toBeDefined();
    expect(booking.depositpaid).toBeDefined();
    expect(booking.bookingdates).toBeDefined();
    expect(booking.bookingdates.checkin).toBeDefined();
    expect(booking.bookingdates.checkout).toBeDefined();

    expect(typeof booking.firstname).toBe('string');
    expect(typeof booking.lastname).toBe('string');
    expect(typeof booking.totalprice).toBe('number');
    expect(typeof booking.depositpaid).toBe('boolean');

    expect(booking.firstname).toBe(createPayload.firstname);
    expect(booking.lastname).toBe(createPayload.lastname);
    expect(booking.totalprice).toBe(createPayload.totalprice);
    expect(booking.depositpaid).toBe(createPayload.depositpaid);
  });

  test('Update booking', async ({ request }) => {
    const guestDetails = generateGuestDetails();
    const bookingDates = generateBookingDates();
    const createPayload = generateBookingPayload(guestDetails, bookingDates);

    const createResponse = await request.post(`${baseURL}/booking`, {
      data: createPayload,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const createBody = await createResponse.json();
    const createdBookingId = createBody.bookingid;

    const updatedDetails = generateGuestDetails();
    const updatePayload = generateBookingPayload(updatedDetails, bookingDates, {
      depositpaid: false,
      additionalneeds: "Lunch"
    });

    const updateResponse = await request.put(`${baseURL}/booking/${createdBookingId}`, {
      data: updatePayload,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${authToken}`
      }
    });

    expect(updateResponse.status()).toBe(200);

    const updatedBooking = await updateResponse.json();

    expect(updatedBooking.firstname).toBe(updatePayload.firstname);
    expect(updatedBooking.lastname).toBe(updatePayload.lastname);
    expect(updatedBooking.totalprice).toBe(updatePayload.totalprice);
    expect(updatedBooking.depositpaid).toBe(updatePayload.depositpaid);
    expect(updatedBooking.additionalneeds).toBe(updatePayload.additionalneeds);

    expect(updatedBooking.bookingdates.checkin).toBe(createPayload.bookingdates.checkin);
    expect(updatedBooking.bookingdates.checkout).toBe(createPayload.bookingdates.checkout);

    const verifyResponse = await request.get(`${baseURL}/booking/${createdBookingId}`);
    expect(verifyResponse.status()).toBe(200);
    const verifyBooking = await verifyResponse.json();
    expect(verifyBooking.firstname).toBe(updatePayload.firstname);
    expect(verifyBooking.depositpaid).toBe(updatePayload.depositpaid);
  });

  test('Delete booking', async ({ request }) => {
    const guestDetails = generateGuestDetails();
    const bookingDates = generateBookingDates();
    const createPayload = generateBookingPayload(guestDetails, bookingDates);

    const createResponse = await request.post(`${baseURL}/booking`, {
      data: createPayload,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const createBody = await createResponse.json();
    const createdBookingId = createBody.bookingid;

    const deleteResponse = await request.delete(`${baseURL}/booking/${createdBookingId}`, {
      headers: {
        'Cookie': `token=${authToken}`
      }
    });

    expect(deleteResponse.status()).toBe(201);

    const deleteResponseText = await deleteResponse.text();
    expect(deleteResponseText).toBe('Created');

    const getResponse = await request.get(`${baseURL}/booking/${createdBookingId}`);
    expect(getResponse.status()).toBe(404);

    const notFoundResponse = await getResponse.text();
    expect(notFoundResponse).toBe('Not Found');
  });
});
