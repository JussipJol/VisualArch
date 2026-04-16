import { faker } from '@faker-js/faker';

type FieldType = 'string' | 'email' | 'number' | 'boolean' | 'date' | 'uuid' | 'name' | 'phone' | 'url' | 'text';

interface EntityField {
  name: string;
  type: string;
  required: boolean;
  unique?: boolean;
}

interface Entity {
  name: string;
  fields: EntityField[];
}

const generateFieldValue = (field: EntityField): unknown => {
  const name = field.name.toLowerCase();
  const type = field.type.toLowerCase() as FieldType;

  if (name === 'id' || name === '_id' || type === 'uuid') return faker.string.uuid();
  if (name === 'email' || type === 'email') return faker.internet.email();
  if (name === 'name' || name === 'fullname' || type === 'name') return faker.person.fullName();
  if (name === 'firstname') return faker.person.firstName();
  if (name === 'lastname') return faker.person.lastName();
  if (name === 'phone' || type === 'phone') return faker.phone.number();
  if (name === 'address') return faker.location.streetAddress();
  if (name === 'city') return faker.location.city();
  if (name === 'country') return faker.location.country();
  if (name === 'url' || name === 'website' || type === 'url') return faker.internet.url();
  if (name === 'image' || name === 'avatar' || name === 'photo') return faker.image.avatar();
  if (name === 'price' || name === 'amount' || name === 'cost') return parseFloat(faker.commerce.price());
  if (name === 'title' || name === 'subject') return faker.lorem.sentence();
  if (name === 'description' || name === 'bio' || name === 'content' || type === 'text') return faker.lorem.paragraph();
  if (name === 'status') return faker.helpers.arrayElement(['active', 'inactive', 'pending']);
  if (name === 'role') return faker.helpers.arrayElement(['admin', 'user', 'moderator']);
  if (name === 'createdat' || name === 'created_at' || type === 'date') return faker.date.past().toISOString();
  if (name === 'updatedat' || name === 'updated_at') return faker.date.recent().toISOString();
  if (type === 'boolean') return faker.datatype.boolean();
  if (type === 'number') return faker.number.int({ min: 1, max: 1000 });
  return faker.lorem.word();
};

export const generateData = (entities: Entity[], count = 100): Record<string, unknown[]> => {
  const result: Record<string, unknown[]> = {};

  for (const entity of entities) {
    result[entity.name] = Array.from({ length: count }, () => {
      const record: Record<string, unknown> = {};
      for (const field of entity.fields) {
        record[field.name] = generateFieldValue(field);
      }
      return record;
    });
  }

  return result;
};

export const generateSQLSchema = (entities: Entity[]): string => {
  return entities.map(entity => {
    const fields = entity.fields.map(f => {
      let sqlType = 'TEXT';
      const t = f.type.toLowerCase();
      if (t === 'number') sqlType = 'INTEGER';
      else if (t === 'boolean') sqlType = 'BOOLEAN';
      else if (t === 'date') sqlType = 'TIMESTAMP';
      else if (t === 'uuid') sqlType = 'UUID';

      const constraints = [];
      if (f.name === 'id') constraints.push('PRIMARY KEY');
      if (f.required) constraints.push('NOT NULL');
      if (f.unique) constraints.push('UNIQUE');

      return `  ${f.name} ${sqlType}${constraints.length ? ' ' + constraints.join(' ') : ''}`;
    }).join(',\n');

    return `CREATE TABLE ${entity.name.toLowerCase()} (\n${fields}\n);`;
  }).join('\n\n');
};
