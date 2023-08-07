// Mock core functions used in the action
const mockGetInput = jest.fn();
const mockSetFailed = jest.fn();
const mockSetSecret = jest.fn();
const mockSetOutput = jest.fn();
const mockExportVariable = jest.fn();
const mockInfo = jest.fn();

const dotenv = require('dotenv');
// eslint-disable-next-line no-unused-vars
const core = require('@actions/core');
const action = require('./action');
const { Input, Output, Variable } = require('./enums');
const HttpClient = require('./client');

dotenv.config();

const mockAccessToken = 'mock_access_token';

// Set up the mocked core module
jest.mock('@actions/core', () => ({
  getInput: mockGetInput,
  setFailed: mockSetFailed,
  setSecret: mockSetSecret,
  setOutput: mockSetOutput,
  exportVariable: mockExportVariable,
  info: mockInfo,
}));

// shows how the runner will run a javascript action with env / stdout protocol
describe('login action test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
    HttpClient.prototype.post = jest.fn().mockResolvedValue({ access_token: mockAccessToken });
  });

  it('should log in with a token and set outputs', async () => {
    // Set up the input
    const mockToken = 'mock_token';

    // Mock the inputs
    const mockInputs = {
      [Input.TOKEN]: mockToken,
    };

    // Mock the getInput function
    mockGetInput.mockImplementation((input) => mockInputs[input]);

    // Call the action function
    await action();

    // Check if the HttpClient.post method was called with the correct arguments
    expect(HttpClient.prototype.post).toHaveBeenCalledWith('login', {
      token: mockToken,
    });

    // Check if the core functions were called with the expected arguments
    expect(mockSetSecret).toHaveBeenCalledWith(mockAccessToken);
    expect(mockSetOutput).toHaveBeenCalledWith(Output.ACCESS_TOKEN, mockAccessToken);
    expect(mockExportVariable)
      .toHaveBeenCalledWith(Variable.NULLPLATFORM_ACCESS_TOKEN, mockAccessToken);

    // Check if other core functions were not called
    expect(mockSetFailed).not.toHaveBeenCalled();
  });

  it('should log in with a api key and set outputs', async () => {
    // Set up the input
    const apiKey = 'mock_api_key';

    // Mock the inputs
    const mockInputs = {
      [Input.API_KEY]: apiKey,
    };

    // Mock the getInput function
    mockGetInput.mockImplementation((input) => mockInputs[input]);

    // Call the action function
    await action();

    // Check if the HttpClient.post method was called with the correct arguments
    expect(HttpClient.prototype.post).toHaveBeenCalledWith('login', {
      api_key: apiKey,
    });

    // Check if the core functions were called with the expected arguments
    expect(mockSetSecret).toHaveBeenCalledWith(mockAccessToken);
    expect(mockSetOutput).toHaveBeenCalledWith(Output.ACCESS_TOKEN, mockAccessToken);
    expect(mockExportVariable)
      .toHaveBeenCalledWith(Variable.NULLPLATFORM_ACCESS_TOKEN, mockAccessToken);

    // Check if other core functions were not called
    expect(mockSetFailed).not.toHaveBeenCalled();
  });

  it('fails if all inputs are null', async () => {
    // Mock the process.exit function
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    // Mock the setFailed function
    mockSetFailed.mockImplementation((input) => input);

    // Call the run function
    await action();

    // Check if the core.setFailed function was called with the expected message
    expect(mockSetFailed).toHaveBeenCalledWith('Input "access-key" and "secret-access-key" cannot be empty');
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
