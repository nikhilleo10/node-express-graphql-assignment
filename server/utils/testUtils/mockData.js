import { hashSync } from 'bcryptjs';
import range from 'lodash/range';
import moment from 'moment';
import sequelize from 'sequelize';
import { TRIP_STATUS_TYPES } from '../constants';
const { faker } = require('@faker-js/faker');
const _ = require('lodash');

export const userTable = range(1, 10).map((item, index) => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const typeOfUser = _.sample(['DRIVER', 'CUSTOMER']);
  const coordinates = faker.address.nearbyGPSCoordinate([26.164324, 75.604077], 15);
  const point = sequelize.fn('ST_GeomFromText', `POINT(${coordinates[0]} ${coordinates[1]})`);
  return {
    id: index + 1,
    firstName,
    lastName,
    email: faker.internet.email(firstName, lastName).toLowerCase(),
    mobile: Math.floor(Math.random() * 9000000000) + 1000000000,
    password: hashSync(`${firstName}1`, 8),
    typeOfUser,
    dateOfBirth: moment(faker.date.future().toUTCString()).format('YYYY-MM-DD'),
    city: faker.address.city(),
    location: point,
    createdAt: moment(moment.now()).format('YYYY-MM-DD HH:mm:ss')
  };
});

export const driverTable = range(1, 10).map((item, index) => ({
  id: index + 1,
  dlNo: `AXB${faker.random.numeric(3)}${faker.random.alphaNumeric(7, { casing: 'upper' })}`,
  dlExpiry: moment(faker.date.future().toUTCString()).format('YYYY-MM-DD'),
  averageRating: 0,
  userId: index + 1,
  createdAt: moment(moment.now()).format('YYYY-MM-DD HH:mm:ss')
}));

export const vehicleTable = range(1, 10).map((item, index) => {
  const typeOfVehicle = _.sample(['CAR', 'BIKE', 'AUTO']);
  let capacity;
  switch (typeOfVehicle) {
    case 'CAR':
      capacity = 4;
      break;
    case 'BIKE':
      capacity = 1;
      break;
    case 'AUTO':
      capacity = 3;
      break;
    default:
      break;
  }
  return {
    id: `${index + 1}`,
    brand: faker.vehicle.manufacturer(),
    color: faker.vehicle.color(),
    vehicleNo: faker.vehicle.vrm(),
    type: typeOfVehicle,
    maxCapacity: capacity,
    engineType: _.sample(['PETROL', 'DIESEL', 'ELECTRIC', 'CNG']),
    insuranceNo: faker.vehicle.vin(),
    insuranceExp: moment(faker.date.future(+faker.random.numeric()).toUTCString()).format('YYYY-MM-DD'),
    driverId: index + 1,
    driver: {
      ...driverTable[0],
      user: {
        ...userTable[0],
        distance_in_km: faker.random.numeric(1) + 0.0
      }
    }
  };
});

export const requestedRidesTable = range(1, 10).map((item, index) => ({
  id: index + 1,
  pickupLoc: faker.address.city(),
  dropLoc: faker.address.city(),
  dateOfRide: moment(moment.now()).format('YYYY-MM-DD'),
  bookingTime: moment(moment.now()).format('YYYY-MM-DD HH:mm:ss'),
  estFare: (_.random(1, 10) * _.random(10, 100)).toFixed(2),
  estDistance: _.random(4, 20),
  tripStatus: TRIP_STATUS_TYPES.PENDING,
  custId: index + 1,
  driverId: index + 1
}));

export const DB_ENV = {
  POSTGRES_HOST: 'host',
  POSTGRES_USER: 'user',
  POSTGRES_PASSWORD: 'password',
  POSTGRES_DB: 'table'
};
