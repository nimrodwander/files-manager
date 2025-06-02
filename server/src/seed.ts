import { AppDataSource } from './config/data-source.config';
import { faker } from '@faker-js/faker';
import { Tag } from './entity/tag.entity';
import { Contact } from './entity/contact.entity';
import { Repository } from 'typeorm';

/**
 * Seeding the db with 150 contact elements
 * and 4 predefined tags
 */

const TAGS = ['Lead', 'Customer', 'Partner', 'VIP'];

async function seed(): Promise<void> {
  await AppDataSource.initialize();

  const tagRepo: Repository<Tag> = AppDataSource.getRepository(Tag);
  const contactRepo: Repository<Contact> = AppDataSource.getRepository(Contact);

  await contactRepo.createQueryBuilder().delete().execute();

  await tagRepo.createQueryBuilder().delete().execute();

  const tagEntities: Tag[] = [];

  for (const name of TAGS) {
    let tag: Tag | null = await tagRepo.findOne({ where: { name } });
    if (!tag) {
      tag = tagRepo.create({ name });
      await tagRepo.save(tag);
    }
    tagEntities.push(tag);
  }

  for (let i = 0; i < 150; i++) {
    const contact: Contact = contactRepo.create({
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