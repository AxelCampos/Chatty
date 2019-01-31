import R from 'ramda';
import faker from 'faker';
import { db } from './connectors';
import bcrypt from 'bcrypt';

// create fake starter data
const GROUPS = 4;
const USERS_PER_GROUP = 5;
const MESSAGES_PER_USER = 5;
const PHOTOS_PER_USER = 8;
const LIFESTYLE_PER_USER = 1;
const ACTIVITY_PER_USER = 1;
const SEARCH_PER_USER = 2;

faker.seed(123); // get consistent data every time we reload app

// you don't need to stare at this code too hard
// just trust that it fakes a bunch of groups, users, and messages

const mockDB = async ({ populating = true, force = true } = {}) => {
  console.log('creating database....');
  await db.sync({ force });

  if (!populating) {
    return Promise.resolve(true);
  }

  console.log('populating groups....');
  const groups = await Promise.all(
    R.times(
      () => db.models.group.create({
        name: faker.lorem.words(3),
      }),
      GROUPS,
    ),
  );

  console.log('populating users....');
  const usersGroups = await Promise.all(
    R.map(async (group) => {
      const users = await Promise.all(
        R.times(async () => {
          const email = faker.internet.email();
          const hash = await bcrypt.hash(email, 10);
          const user = await group.createUser({
            email,
            country: faker.random.arrayElement([
              'España',
            ]),
            city: faker.random.arrayElement([
              "Boadilla del Monte",
              "Las Rozas",
              "Majadahonda",
              "Mostoles",
              "Coslada",
              "Alcobendas",
              "Guadarrama",
              "Madrid",
              "Collado Villalba",
              "Alcalá de Henares",
              "San Sebastián de los Reyes",
              "Pozuelo",
              "Talavera de la Reina",
              "Avila",
              "Guadalajara",
              "Navacerrada",
              "Torrelodones",
              "Alcorcón",
              "Aranjuez",
              "Arroyomolinos",
              "Cercedilla",
              "Colmenar Viejo",
              "El Escorial",
              "Galapagar",
              "Lozoya",
              "Manzanares el Real",
            ]),
            street: faker.address.streetName(),
            streetNumber: faker.address.streetSuffix(),
            zipcode: faker.address.zipCode(),
            password: hash,
            username: faker.internet.userName(),
            age: faker.random.number({ min: 18, max: 90 }),
            gender: faker.random.arrayElement(['no especificado', 'hombre', 'mujer', 'otro']),
            civilStatus: faker.random.arrayElement([
              'no especificado',
              'soltero',
              'separado',
              'divorciado',
              'viudo',
              'otro',
            ]),
            children: faker.random.arrayElement([
              'no especificado',
              'no tiene hijos',
              'tiene hijos',
            ]),
            likes: faker.random.number(20),
            password: faker.internet.password(),
            birthdate: faker.random.number(11111111, 99999999),
            height: faker.random.number(150, 210),
            weight: faker.random.number(45, 100),
            education: faker.random.arrayElement([
              'no especificado',
              'secundario o inferior',
              'modulo profesional',
              'superior',
              'posgrado o master',
            ]),
            profession: faker.lorem.word(1),
            religion: faker.random.arrayElement([
              'no especificado',
              'cristiana',
              'musulmane',
              'judaica',
              'induísta',
              'budista',
              'espiritualista',
              'ateísta',
              'otra',
            ]),
            pets: faker.random.arrayElement([
              'no especificado',
              'tengo',
              'no tengo',
            ]),
            smoker: faker.random.arrayElement([
              'no especificado',
              'fumo',
              'no fumo pero no me molesta',
              'no fumo y me molesta',
            ]),
            description: faker.lorem.paragraph(1),
          });
          await Promise.all(
            R.times(
              () => db.models.message.create({
                userId: user.id,
                groupId: group.id,
                text: faker.lorem.sentences(3),
              }),
              MESSAGES_PER_USER,
            ),
          );
          R.times(
            () => db.models.photo.create({
              userId: user.id,
              groupId: group.id,
              url: faker.image.avatar(),
              name: faker.lorem.words(2),
              comment: faker.lorem.words(65),
            }),
            PHOTOS_PER_USER,
          );
          R.times(
            () => db.models.lifestyle.create({
              userId: user.id,
              gender: faker.random.arrayElement(['no especificado', 'hombre', 'mujer', 'otro']),
              civilStatus: faker.random.arrayElement([
                'no especificado',
                'soltero',
                'separado',
                'divorciado',
                'viudo',
                'otro',
              ]),
              nation: faker.random.arrayElement([
                'no especificado',
                'español',
                'italiano',
                'inglés',
                'otro',
              ]),
              children: faker.random.arrayElement([
                'no especificado',
                'no tiene hijos',
                'tiene hijos',
              ]),
            }),
            LIFESTYLE_PER_USER,
          );
          R.times(
            () => db.models.search.create({
              userId: user.id,
              name: faker.lorem.words(1),
              gender: faker.random.arrayElement(['todos', 'hombre', 'mujer', 'otro']),
              civilStatus: faker.random.arrayElement([
                'todos',
                'soltero',
                'separado',
                'divorciado',
                'viudo',
                'otro',
              ]),
              children: faker.random.arrayElement([
                'todos',
                'no tiene hijos',
                'tiene hijos',
              ]),
            }),
            SEARCH_PER_USER,
          );
          R.times(
            () => db.models.activity.create({
              userId: user.id,
              type: faker.random.arrayElement(['deporte', 'artes', 'viajes']),
            }),
            ACTIVITY_PER_USER,
          );
          return user;
        }, USERS_PER_GROUP),
      );
      return users;
    }, groups),
  );

  console.log('populating friends....');

  await Promise.all(
    R.flatten(
      R.map(
        users => users.map(
          (current, i) => users.map((user, j) => (i !== j ? current.addFriend(user) : false)),
        ),
        usersGroups,
      ),
    ),
  );

  console.log('¡DATABASE CREATED!');
  return 'Este es un return para que eslint no se queje, porque no le mola una función async sin return, o algo asínc';
};

export default mockDB;
