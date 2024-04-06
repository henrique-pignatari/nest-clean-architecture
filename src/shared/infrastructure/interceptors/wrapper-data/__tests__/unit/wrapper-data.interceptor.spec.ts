import { of } from 'rxjs';
import { WrapperDataInterceptor } from '../../wrapper-data.interceptor';

describe('WrapperDataInterceptor', () => {
  let interceptor: WrapperDataInterceptor;
  let props: any;

  beforeEach(() => {
    interceptor = new WrapperDataInterceptor();
    props = { name: 'test name', email: 'a@a.com', password: 'senha12' };
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should wrapp with data key', () => {
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of(props),
    });

    obs$.subscribe({ next: value => expect(value).toEqual({ data: props }) });
  });

  it('should not wrapp with data key when meta key is present', () => {
    const result = { data: [props], meta: { total: 1 } };

    const obs$ = interceptor.intercept({} as any, {
      handle: () => of(result),
    });

    obs$.subscribe({ next: value => expect(value).toEqual(result) });
  });
});
