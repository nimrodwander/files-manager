import { AppDataSource } from './data-source';
import { faker } from '@faker-js/faker';
import { Tag } from './entity/tag';
import { Contact } from './entity/contact';

const TAGS = ['Work', 'Friends', 'Family', 'Gym', 'School'];

async function seed() {
  await AppDataSource.initialize();

  const tagRepo = AppDataSource.getRepository(Tag);
  const contactRepo = AppDataSource.getRepository(Contact);

  // Create static tags if not already present
  const tagEntities: Tag[] = [];

  for (const name of TAGS) {
    let tag = await tagRepo.findOne({ where: { name } });
    if (!tag) {
      tag = tagRepo.create({ name });
      await tagRepo.save(tag);
    }
    tagEntities.push(tag);
  }

  // Create 150 random contacts with 1–3 random tags
  for (let i = 0; i < 150; i++) {
    const contact = contactRepo.create({
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      phoneNumber: faker.phone.number(),
      tags: getRandomTags(tagEntities),
    });
    await contactRepo.save(contact);
    console.log(`Contact created: ${contact.fullName}`);
  }

  await AppDataSource.destroy();
}

function getRandomTags(tags: Tag[]): Tag[] {
  return faker.helpers.shuffle(tags).slice(0, faker.number.int({ min: 1, max: 3 }));
}

seed().catch(err => {
  console.error('Seed failed:', err);
});