import get from 'lodash/get';
import { getResponse } from '@utils/testUtils';

describe('Requested Rides Queries', () => {
  const getCompletedRidesForUser = `
  query completedRides {
    requestedRides(
      limit: 10
      offset: 0
      where: { tripStatus: "COMPLETED", custId: 2 }
      order: "id DESC"
    ) {
      edges {
        node {
          pickupLoc
          dropLoc
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
          completed_ride {
            actualFare
            tip
            tripId
            id
            createdAt
            updatedAt
            deletedAt
          }
        }
      }
    }
  }  
  `;
  it('should get completed rides for the customer', async () => {
    await getResponse(getCompletedRidesForUser).then(response => {
      const result = get(response, 'body.data.requestedRides.edges[0].node');
      expect(result).toBeTruthy();
      expect(result).toHaveProperty('pickupLoc');
      expect(result).toHaveProperty('dropLoc');
      expect(result).toHaveProperty('dateOfRide');
      expect(result).toHaveProperty('bookingTime');
      expect(result).toHaveProperty('estFare');
      expect(result).toHaveProperty('estDistance');
      expect(result).toHaveProperty('tripStatus');
      expect(result).toHaveProperty('custId');
      expect(result).toHaveProperty('driverId');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('completed_ride');
      expect(result.completed_ride).toHaveProperty('actualFare');
      expect(result.completed_ride).toHaveProperty('tip');
      expect(result.completed_ride).toHaveProperty('tripId');
      expect(result.completed_ride).toHaveProperty('id');
    });
  });

  const getIncompleteRidesForUser = `
  query completedRides {
    requestedRides(
        limit: 10
        offset: 0
        where: { tripStatus: "CANCELLED", custId: 2 }
        order: "id ASC"
      ) {
        edges {
          node {
            pickupLoc
            dropLoc
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
            incomplete_ride {
              reasonForCancellation
              tripId
              cancellationTime
              id
              createdAt
              updatedAt
              deletedAt
            } 
          }
        }
      }
  }  
  `;
  it('should get incomplete rides for the customer', async () => {
    await getResponse(getIncompleteRidesForUser).then(response => {
      const result = get(response, 'body.data.requestedRides.edges[0].node');
      expect(result).toBeTruthy();
      expect(result).toHaveProperty('pickupLoc');
      expect(result).toHaveProperty('dropLoc');
      expect(result).toHaveProperty('dateOfRide');
      expect(result).toHaveProperty('bookingTime');
      expect(result).toHaveProperty('estFare');
      expect(result).toHaveProperty('estDistance');
      expect(result).toHaveProperty('tripStatus');
      expect(result).toHaveProperty('custId');
      expect(result).toHaveProperty('driverId');
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('incomplete_ride');
      expect(result.incomplete_ride).toHaveProperty('reasonForCancellation');
      expect(result.incomplete_ride).toHaveProperty('tripId');
      expect(result.incomplete_ride).toHaveProperty('cancellationTime');
      expect(result.incomplete_ride).toHaveProperty('id');
    });
  });
  // Error query
  const invalidQuery = `
  query completedRides {
    requestedRides(
        limit: 10
        offset: 0
        where: { tripStatus: "CANCELLED" }
        order: "id ASC"
      ) {
        edges {
          node {
            pickupLoc
            dropLoc
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
            incomplete_ride {
              reasonForCancellation
              tripId
              cancellationTime
              id
              createdAt
              updatedAt
              deletedAt
            } 
          }
        }
      }
  }  
  `;
  it('should get error that customer id is required', async () => {
    await getResponse(invalidQuery).then(response => {
      const result = get(response, 'body.data.requestedRides');
      const errorMessage = get(response, 'body.errors[0]');
      expect(result).toEqual(null);
      expect(errorMessage.message).toEqual('Customer ID is required in where clause.');
    });
  });
});
