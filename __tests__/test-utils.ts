import { EventEmitter } from 'events';

const oldPlatform = process.platform;

export function mockProcessProp(property: string, value: any) {
  Object.defineProperty(process, property, {
    value,
    writable: false,
    enumerable: true
  });
}

export function mockPlatform(platform: string) {
  mockProcessProp('platform', platform);
}

export function resetPlatform() {
  mockPlatform(oldPlatform);
}

export class MockSpawnChild extends EventEmitter {
  public stdin = {
    end: jest.fn()
  };
}

export const mockSpawnChild = new MockSpawnChild();

export const mockSpawnOk = () => {
  setTimeout(() => mockSpawnChild.emit('exit', 0), 200);
  return mockSpawnChild;
};

export const mockSpawnError = () => {
  setTimeout(() => mockSpawnChild.emit('exit', 1), 200);
  return mockSpawnChild;
};
