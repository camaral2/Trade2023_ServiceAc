import { Test, TestingModule } from '@nestjs/testing';
import { RequestUtils } from './request.utils';
import axios from 'axios';
import { UnauthorizedException } from '@nestjs/common';

// Mock jest and set the type
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('RequestUtils', () => {
  let requestUtilsService: RequestUtils;
  //let axiosObj: axios;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestUtils],
    }).compile();
    //axiosObj = module.get<axios>(axios);
    requestUtilsService = module.get<RequestUtils>(RequestUtils);
  });

  it('should be defined', () => {
    expect(requestUtilsService).toBeDefined();
  });

  it('Should return html of get', async () => {
    const html = '<html><head></head></html>';
    const retAxios = {
      data: html,
      status: 200,
      statusText: 'Ok',
      headers: {},
      config: {},
    };

    const spyRequest = mockedAxios.get.mockResolvedValue(retAxios);

    const ret = await requestUtilsService.getRequest('http://teste');
    expect(spyRequest).toBeCalled();
    expect(ret).toEqual(html);
  });

  it('Should not return error', async () => {
    const spyRequest = mockedAxios.get.mockRejectedValue(new Error('Teste'));
    try {
      const ret = await requestUtilsService.getRequest('http://teste', 'ocorr');
      expect(spyRequest).toBeCalled();
      expect(ret).toEqual(null);
    } catch (error) {
      expect(error.message).toEqual('Error: Teste');
    }
  });
});
