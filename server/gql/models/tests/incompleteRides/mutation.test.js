import get from 'lodash/get';
import { getResponse } from '@utils/testUtils';

describe('Cancel ride mutations', () => {
  const createRequestedRide = `
  mutation cancelRide {
    createIncompleteRide(
      reasonForCancellation: "I got a better ride at low cost"
      tripId: 3
      updateType: "CANCEL_A_RIDE"
    ) {
      id
      tripId
      reasonForCancellation
      cancellationTime
    }
  }  
  `;
  it('should update record for completed ride found', async () => {
    await getResponse(createRequestedRide).then(response => {
      const result = get(response, 'body.data.createIncompleteRide');
      expect(result).toBeTruthy();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('tripId');
      expect(result).toHaveProperty('reasonForCancellation');
      expect(result).toHaveProperty('cancellationTime');
    });
  });
});
