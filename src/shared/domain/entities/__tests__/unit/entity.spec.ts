import { validate as uuidValidate } from 'uuid';
import { Entity } from '../../entity';

type StubProps = {
  prop1: string;
  prop2: number;
};

class StubEntity extends Entity<StubProps> {}

describe('Entity unit tests', () => {
  it('shound set props and id', () => {
    const props: StubProps = {
      prop1: 'value1',
      prop2: 1,
    };

    const entity = new StubEntity(props);

    expect(entity.props).toStrictEqual(props);
    expect(entity.id).not.toBeNull();
    expect(uuidValidate(entity.id)).toBeTruthy();
  });

  it('shound accept a valid uuid', () => {
    const props: StubProps = {
      prop1: 'value1',
      prop2: 1,
    };
    const id = 'da3030cc-c7ef-4459-afb9-3e3e9955c2ed';
    const entity = new StubEntity(props, id);

    expect(uuidValidate(entity.id)).toBeTruthy();
    expect(entity.id).toEqual(id);
  });

  it('shound convert a entity to a javascriptObject', () => {
    const props: StubProps = {
      prop1: 'value1',
      prop2: 1,
    };
    const id = 'da3030cc-c7ef-4459-afb9-3e3e9955c2ed';
    const entity = new StubEntity(props, id);

    expect(entity.toJson()).toStrictEqual({
      id,
      ...props,
    });
  });
});
