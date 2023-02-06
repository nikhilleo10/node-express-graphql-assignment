import get from 'lodash/get';
import { getResponse } from '@utils/testUtils';

describe('Student graphQL-server-DB query tests', () => {
  const nearByDrivers = `
  query getNearbyDrivers {
    vehicles(
      limit: 10
      offset: 0
      where: { type: "CAR" }
      points: "26.1564 75.6813"
      order: "id ASC"
      first: 1
    ) {
      edges {
        node {
          id
          brand
          color
          vehicleNo
          type
          maxCapacity
          engineType
          insuranceNo
          insuranceExp
          driver {
            id
            dlNo
            dlExpiry
            averageRating
            userId
            user {
              id
              firstName
              lastName
              typeOfUser
              email
              dateOfBirth
              distance_in_km
            }
          }
        }
      }
    }
  }  
  `;
  it('should request for nearby drivers to the students with offset and limit', async () => {
    await getResponse(nearByDrivers).then(response => {
      console.log(response.body.data.vehicles.edges);
      const result = get(response, 'body.data.vehicles.edges[0].node');
      expect(response.body.data.vehicles.edges.length).toBe(1);
      expect(result).toBeTruthy();
      expect(result).toHaveProperty('brand');
      expect(result).toHaveProperty('color');
      expect(result).toHaveProperty('vehicleNo');
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('maxCapacity');
      expect(result).toHaveProperty('engineType');
      expect(result).toHaveProperty('insuranceNo');
      expect(result).toHaveProperty('insuranceExp');
      expect(result).toHaveProperty('driver');
      expect(result.driver).toHaveProperty('id');
      expect(result.driver).toHaveProperty('user');
      expect(result.driver).toHaveProperty('dlNo');
      expect(result.driver.user).toHaveProperty('firstName');
    });
  });

  it('should request for vehicle details', async () => {
    const vehicleQuery = `
    query getVehicle {
      vehicle(id: 1) {
        brand
        color
        vehicleNo
        type
        maxCapacity
        engineType
        insuranceNo
        insuranceExp
        id
        driver {
          dlNo
          dlExpiry
          averageRating
          userId
          id
          user {
            id
            firstName
            lastName
            typeOfUser
            distance_in_km
            email
            dateOfBirth
          } 
        }
      } 
    }
    `;
    await getResponse(vehicleQuery).then(response => {
      const result = get(response, 'body.data.vehicle');
      expect(result).toBeTruthy();
      expect(result).toHaveProperty('brand');
      expect(result).toHaveProperty('color');
      expect(result).toHaveProperty('vehicleNo');
      expect(result).toHaveProperty('type');
      expect(result).toHaveProperty('maxCapacity');
      expect(result).toHaveProperty('engineType');
      expect(result).toHaveProperty('insuranceNo');
      expect(result).toHaveProperty('insuranceExp');
      expect(result).toHaveProperty('driver');
      expect(result.driver).toHaveProperty('id');
      expect(result.driver).toHaveProperty('user');
      expect(result.driver).toHaveProperty('dlNo');
      expect(result.driver.user).toHaveProperty('firstName');
    });
  });
});
