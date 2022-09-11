const db = require('../db');
const User = require('../../../models/UserModel');
const userService = require('../../../services/userService');

const userId = 'WEyiZuPjiHBMXctBbtJCH2EEOqu51iAC';

beforeAll(async () => await db.connect());

afterEach(async () => await db.clearDatabase());

afterAll(async () => await db.closeDatabase());

describe('getUserInfo', () => {
  it('gets user info from user', (done) => {
    const newUser = new User({
      _id: userId,
      nickname: 'Isaac Dreier',
      benchmarks: [],
      phone: '614-403-5347',
      email: 'isaac.dreier@gmail.com',
      site: '03148000',
      visits: 32,
    });

    newUser.save(async function (err) {
      if (err) console.log(err);
      try {
        const userInfo = await userService.getUserInfo(userId);
        expect(userInfo.nickname).toEqual('Isaac Dreier');
        done();
      } catch (err) {
        done(err);
      }
    });
  });
});

describe('createUser', () => {
  it('creates a new user in database', (done) => {
    userService
      .createUser(
        userId,
        'Isaac Dreier',
        '614-403-5347',
        'isaac.dreier@gmail.com',
        '03148000'
      )
      .then(async () => {
        try {
          const userInfo = await User.findById(userId);
          expect(userInfo.nickname).toEqual('Isaac Dreier');
          done();
        } catch (err) {
          done(err);
        }
      })
      .catch((err) => {
        done(err);
      });
  });

  it('throws if the user already exists', async () => {
    const user = new User({
      _id: userId,
      nickname: 'Autumn Dreier',
      benchmarks: [],
      phone: '740-221-7927',
      email: 'autumnroseparker21@gmail.com',
      site: '03148000',
      visits: 0,
    });
    await user.save();
    return expect(
      userService.createUser(
        userId,
        'Isaac Dreier',
        '614-403-5347',
        'isaac.dreier@gmail.com',
        '03148000'
      )
    ).rejects.toThrow('duplicate key error');
  });
});

describe('update user', () => {
  beforeEach(async () => {
    const newUser = new User({
      _id: userId,
      nickname: 'Isaac Dreier',
      benchmarks: [],
      phone: '614-403-5347',
      email: 'isaac.dreier@gmail.com',
      site: '03148000',
      visits: 32,
    });
    await newUser.save();
  });

  it('updates user info', async () => {
    await userService.updateUser(userId, {
      nickname: 'IZeeke',
      phone: '740-221-6708',
      email: 'isaac@dreierdesigngroup.com',
      site: '03148001',
    });
    const user = await User.findById(userId).exec();
    expect(user.nickname).toEqual('IZeeke');
    expect(user.phone).toEqual('740-221-6708');
    expect(user.email).toEqual('isaac@dreierdesigngroup.com');
    expect(user.site).toEqual('03148001');
  });

  it('rejects if the user does not exist', async () => {
    return expect(
      userService.updateUser('WEyiZuPjiHBMXctBbtJCH2EEOqu51iAB', {
        nickname: 'zeke',
      })
    ).rejects.toMatch('user not found');
  });

  it('rejects if id parameter is invalid', async () => {
    return expect(
      userService.updateUser('WEyiZuPjiHBMXctB()*&)', {
        nickname: 'zeke',
      })
    ).rejects.toMatch('user id is invalid');
  });

  it('throws if property is invalid', async () => {
    return expect(
      userService.updateUser(userId, {
        nickname: 'zeke#$%',
      })
    ).rejects.toThrow('nickname should be alphanumeric');
  });
});

describe('delete user', () => {
  beforeEach(async () => {
    const newUser = new User({
      _id: userId,
      nickname: 'Isaac Dreier',
      benchmarks: [],
      phone: '614-403-5347',
      email: 'isaac.dreier@gmail.com',
      site: '03148000',
      visits: 32,
    });
    await newUser.save();
  });

  it('deletes a user', async () => {
    await userService.deleteUser(userId);
    const user = await User.findById(userId).exec();
    expect(user).toEqual(null);
  });

  it('rejects if the id is invalid', async () => {
    return expect(
      userService.deleteUser('elkfjaoeiwjfw243(*&$(*')
    ).rejects.toMatch('user id is invalid');
  });
});

describe('createBenchmark', () => {
  beforeEach(() => {
    return new Promise((resolve, reject) => {
      const newUser = new User({
        _id: userId,
        nickname: 'Isaac Dreier',
        benchmarks: [],
        phone: '614-403-5347',
        email: 'isaac.dreier@gmail.com',
        site: '03148000',
        visits: 32,
      });

      try {
        newUser.save(async function (err) {
          resolve();
        });
      } catch (err) {
        reject(err);
      }
    });
  });

  it('creates a new benchmark on the user', async () => {
    await userService.createBenchmark(userId, 4.5, 'greater', true, '03148000');
    const user = await User.findById(userId).exec();
    expect(user.benchmarks[0].value).toEqual(4.5);
  });

  it('rejects if the user does not exist', async () => {
    return expect(
      userService.createBenchmark(
        'ejo34224532',
        4.6,
        'greater',
        true,
        '03148000'
      )
    ).rejects.toMatch('user not found');
  });
});

describe('delete benchmark', () => {
  beforeEach(async () => {
    const newUser = new User({
      _id: userId,
      nickname: 'Isaac Dreier',
      benchmarks: [],
      phone: '614-403-5347',
      email: 'isaac.dreier@gmail.com',
      site: '03148000',
      visits: 32,
    });
    newUser.benchmarks.push({
      value: 4.5,
      comparison: 'greater',
      shouldAlert: false,
      site: '03148000',
    });
    await newUser.save();
  });

  it('deletes a benchmark', async () => {
    let user = await User.findById(userId).exec();
    let benchmark = user.benchmarks[0];
    const benchID = benchmark.id.toString();
    //console.log(benchID);
    await userService.deleteBenchmark(userId, benchmark._id.toString());
    user = await User.findById(userId).exec();
    benchmark = user.benchmarks.id(benchID);
    expect(benchmark).toEqual(null);
  });

  it('rejects if user does not exist', async () => {
    let user = await User.findById(userId).exec();
    let benchmark = user.benchmarks[0];
    const benchID = benchmark.id.toString();
    return expect(
      userService.deleteBenchmark(
        'NOTREALjiHBMXctBbtJCH2EEOqu51iAD',
        benchmark._id.toString()
      )
    ).rejects.toMatch('user not found');
  });

  it('rejects if user id is not valid', async () => {
    let user = await User.findById(userId).exec();
    let benchmark = user.benchmarks[0];
    const benchID = benchmark.id.toString();
    return expect(
      userService.deleteBenchmark(
        'NOTREALjiHBMXctBbtJCH2EEOqu5$%###@D',
        benchmark._id.toString()
      )
    ).rejects.toMatch('user id is invalid');
  });

  it('rejects if benchmark id is not valid', async () => {
    let user = await User.findById(userId).exec();
    let benchmark = user.benchmarks[0];
    const benchID = benchmark.id.toString();
    return expect(
      userService.deleteBenchmark(userId, benchmark._id.toString() + '#$#')
    ).rejects.toMatch('benchmark id is invalid');
  });

  it('rejects if benchmark is not found', async () => {
    const user = await User.findById(userId).exec();
    const benchmarkId = user.benchmarks[0]._id.toString() + 'A';
    return expect(
      userService.deleteBenchmark(userId, benchmarkId)
    ).rejects.toMatch('benchmark not found');
  });
});

describe('update benchmark', () => {
  beforeEach(async () => {
    const newUser = new User({
      _id: userId,
      nickname: 'Isaac Dreier',
      benchmarks: [],
      phone: '614-403-5347',
      email: 'isaac.dreier@gmail.com',
      site: '03148000',
      visits: 32,
    });
    newUser.benchmarks.push({
      value: 4.5,
      comparison: 'greater',
      shouldAlert: false,
      site: '03148000',
    });
    await newUser.save();
  });
  it('updates a benchmark', async () => {
    let user = await User.findById(userId).exec();
    let benchmark = user.benchmarks[0];
    const benchID = benchmark.id.toString();
    //console.log(benchID);
    await userService.updateBenchmark(userId, benchmark._id.toString(), {
      value: 23.4,
      comparison: 'less',
      shouldAlert: true,
      site: '03148001',
    });
    user = await User.findById(userId).exec();
    benchmark = user.benchmarks.id(benchID);
    expect(benchmark.value).toEqual(23.4);
    expect(benchmark.comparison).toEqual('less');
    expect(benchmark.shouldAlert).toEqual(true);
    expect(benchmark.site).toEqual('03148001');
  });

  it('rejects if user is not found', async () => {
    return expect(
      userService.updateBenchmark(userId + 'b', 'somebenchmarkid', {
        shouldAlert: true,
      })
    ).rejects.toMatch('user not found');
  });

  it('rejects if benchmark is not found', async () => {
    const user = await User.findById(userId).exec();
    return expect(
      userService.updateBenchmark(userId, 'somebenchmarkid', {
        shouldAlert: true,
      })
    ).rejects.toMatch('benchmark not found');
  });

  it('rejects if the user id is invalid', async () => {
    return expect(
      userService.updateBenchmark(userId + '#$$##', 'somebenchmarkid', {})
    ).rejects.toMatch('user id is invalid');
  });

  it('rejects if the benchmark id is invalid', async () => {
    return expect(
      userService.updateBenchmark(userId, 'somebenchmarkidwith$YBols', {
        shouldAlert: true,
      })
    ).rejects.toMatch('benchmark id is invalid');
  });
});
