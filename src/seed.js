const { seed } = require('./seeds/20240920_seed_employees');

(async () => {
  await seed();
  console.log('Seeding completed');
})();
