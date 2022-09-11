const User = require('../../../models/UserModel');

let testUser = {};
let testBench = {};
beforeEach(() => {
  testUser = {
    _id: 'WEyiZuPjiHBMXctBbtJCH2EEOqu51iAC',
    nickname: 'Isaac Dreier',
    benchmarks: [],
    phone: '614-403-5347',
    email: 'isaac.dreier@gmail.com',
    site: '03148000',
    visits: 32,
  };

  testBench = {
    value: 6,
    comparison: 'greater',
    alert: false,
    site: '03148000',
  };
});

describe('UserModel Validation', () => {
  it('throws on a bad user id', async () => {
    testUser._id = 'dafjoi23013n#$@';
    const user = new User(testUser);
    return expect(user.validate()).rejects.toThrow('is not a valid user id');
  });

  it('throws on a non alphanumeric nickname', async () => {
    testUser.nickname = 'Isaac Dreier();';
    const user = new User(testUser);
    return expect(user.validate()).rejects.toThrow('should be alphanumeric');
  });

  it('throws on a long nickname', async () => {
    testUser.nickname =
      'Isaac Dreieradfadfaeregafgaeafahhtrqaeraqrhahaewefsageae';
    const user = new User(testUser);
    return expect(user.validate()).rejects.toThrow('nickname is too long');
  });

  it('throws on an invalid phone number', async () => {
    testUser.phone = '52afdf34-42-1a3425';
    const user = new User(testUser);
    return expect(user.validate()).rejects.toThrow('phone number is invalid');
  });

  it('throws on an invalid email', async () => {
    testUser.email = 'isaac';
    const user = new User(testUser);
    return expect(user.validate()).rejects.toThrow('email is invalid');
  });

  it('throws on a non-numeric site number', async () => {
    testUser.site = 'ai3425221';
    const user = new User(testUser);
    return expect(user.validate()).rejects.toThrow('is not valid');
  });

  it('throws on a long site number', async () => {
    testUser.site = '987437593978539784973347937845';
    const user = new User(testUser);
    return expect(user.validate()).rejects.toThrow('is not valid');
  });

  it('throws on a short site number', async () => {
    testUser.site = '98743';
    const user = new User(testUser);
    return expect(user.validate()).rejects.toThrow('is not valid');
  });

  it('throws on negative visits', async () => {
    testUser.visits = -5;
    const user = new User(testUser);
    return expect(user.validate()).rejects.toThrow('visits cannot be negative');
  });
});

describe('BenchmarkSchema Validation', () => {
  it('throws with a negative value', async () => {
    testBench.value = -5;
    const user = new User(testUser);
    user.benchmarks.push(testBench);
    return expect(user.validate()).rejects.toThrow('value cannot be negative');
  });

  it('throws with an invalid comparison', async () => {
    testBench.comparison = 'bigger';
    const user = new User(testUser);
    user.benchmarks.push(testBench);
    return expect(user.validate()).rejects.toThrow(
      'not a supported comparison'
    );
  });

  it('throws on a non-numeric site number', async () => {
    testBench.site = 'ai3425221';
    const user = new User(testUser);
    user.benchmarks.push(testBench);
    return expect(user.validate()).rejects.toThrow('is not valid');
  });

  it('throws on a long site number', async () => {
    testBench.site = '987437593978539784973347937845';
    const user = new User(testUser);
    user.benchmarks.push(testBench);
    return expect(user.validate()).rejects.toThrow('is not valid');
  });

  it('throws on a short site number', async () => {
    testBench.site = '98743';
    const user = new User(testUser);
    user.benchmarks.push(testBench);
    return expect(user.validate()).rejects.toThrow('is not valid');
  });
});
