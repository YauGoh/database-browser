import { PrimaryKeyPipe } from './primary-key.pipe';

describe('PrimaryKeyPipe', () => {
  it('create an instance', () => {
    const pipe = new PrimaryKeyPipe();
    expect(pipe).toBeTruthy();
  });
});
