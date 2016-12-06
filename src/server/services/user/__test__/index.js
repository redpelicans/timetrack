import assert from 'assert';
import app from '../../../app';

describe('user service', function() {
  it('registered the users service', () => {
    assert.ok(app.service('users'));
  });
});
