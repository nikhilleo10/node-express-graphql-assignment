import get from 'lodash/get';
import { getResponse } from '@utils/testUtils';

describe('Requested Rides Queries', () => {
  const createRequestedRide = `
  mutation createRide {
    createRequestedRide(
      pickupLoc: "AA"
      dropLoc: "BB"
      custId: 2
      estDistance: 19.55
    ) {
      pickupLoc
      dropLoc
      dateOfRide
      bookingTime
      estFare
      estDistance
      custId
      driverId
      id
      createdAt
      updatedAt
      deletedAt
    }
  }
  `;
  it('should create a ride in database', async () => {
    await getResponse(createRequestedRide).then(response => {
      const result = get(response, 'body.data.createRequestedRide');
      expect(result).toBeTruthy();
      expect(result).toHaveProperty('pickupLoc');
      expect(result).toHaveProperty('dropLoc');
      expect(result).toHaveProperty('dateOfRide');
      expect(result).toHaveProperty('bookingTime');
      expect(result).toHaveProperty('estFare');
      expect(result).toHaveProperty('estDistance');
      expect(result).toHaveProperty('custId');
      expect(result).toHaveProperty('driverId');
      expect(result).toHaveProperty('id');
    });
  });

  const acceptRideMutation = `
  mutation acceptRide {
    updateRequestedRide(id: 4, updateType: "ACCEPT_A_RIDE", driverId: 1) {
      dateOfRide
      bookingTime
      estFare
      estDistance
      tripStatus
      custId
      driverId
      id
      createdAt
      updatedAt
      deletedAt
    } 
  }
  `;
  it('should update ride and add driver id in requested ride row', async () => {
    await getResponse(acceptRideMutation).then(response => {
      console.log(response.body);
      const result = get(response, 'body.data.updateRequestedRide');
      console.log(result);
      expect(result).toBeTruthy();
      expect(result).toHaveProperty('dateOfRide');
      expect(result).toHaveProperty('bookingTime');
      expect(result).toHaveProperty('estFare');
      expect(result).toHaveProperty('estDistance');
      expect(result).toHaveProperty('tripStatus');
      expect(result).toHaveProperty('estDistance');
      expect(result).toHaveProperty('custId');
      expect(result).toHaveProperty('driverId');
      expect(result).toHaveProperty('id');
    });
  });
});
