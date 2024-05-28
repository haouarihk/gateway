import { handler as moderateContentHandler } from './moderateContent';
import testCreds from './.test-creds.json';

describe.only('moderateContentHandler', () => {
  it('should return an error if hook type is not supported', async () => {
    const context = { hookType: 'unsupported' };
    const parameters = {};
    const result = await moderateContentHandler(context, parameters);
    expect(result.error).toBeDefined();
    expect(result.verdict).toBe(false);
    expect(result.data).toBeNull();
  });

  it('should return an error if fetch request fails', async () => {
    const context = { hookType: 'beforeRequestHook' };
    const parameters = { PORTKEY_API_KEY: 'test' };
    const result = await moderateContentHandler(context, parameters);
    expect(result.error).toBeDefined();
    expect(result.verdict).toBe(false);
    expect(result.data).toBeNull();
  });

  it('should return verdict and data if fetch request succeeds', async () => {
    const context = {
      hookType: 'beforeRequestHook',
      request: { text: 'this is a test string for moderations' },
    };
    const parameters = { 
      credentials: { PORTKEY_API_KEY: testCreds.PORTKEY_API_KEY, PORTKEY_VIRTUAL_KEY: testCreds.PORTKEY_VIRTUAL_KEY }, 
      categories: ['violence']
    }
    const result = await moderateContentHandler(context, parameters);
    expect(result.error).toBeNull();
    expect(result.verdict).toBeDefined();
    expect(result.data).toBeDefined();
  });

  it('should return verdict as false if text is flagged', async () => {
    const context = {
      hookType: 'beforeRequestHook',
      request: { text: 'I really want to murder him brutally.' },
    };
    const parameters = { 
      credentials: { PORTKEY_API_KEY: testCreds.PORTKEY_API_KEY, PORTKEY_VIRTUAL_KEY: testCreds.PORTKEY_VIRTUAL_KEY }, 
      categories: ['violence']
    }
    const result = await moderateContentHandler(context, parameters);
    expect(result.error).toBeNull();
    expect(result.verdict).toBe(false);
    expect(result.data).toBeDefined();
  });
});