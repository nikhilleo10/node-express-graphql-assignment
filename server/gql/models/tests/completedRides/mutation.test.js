import get from 'lodash/get';
import { getResponse } from '@utils/testUtils';

describe('Completed ride mutations', () => {
  const createRequestedRide = `
  mutation endRide {
    updateCompletedRide(actualFare: 900.05, tip: 10,tripId: 1, updateType: "END_A_RIDE"){
      id
      tripId
      actualFare
      tip
      createdAt
    }
  }
  `;
  it('should update record for completed ride found', async () => {
    await getResponse(createRequestedRide).then(response => {
      const result = get(response, 'body.data.updateCompletedRide');
      expect(result).toBeTruthy();
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('tripId');
      expect(result).toHaveProperty('actualFare');
      expect(result).toHaveProperty('tip');
      expect(result).toHaveProperty('createdAt');
    });
  });
});
