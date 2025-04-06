import { initializeTrainingData } from '../src/lib/firebase/initTrainingData';

async function main() {
  console.log('Initializing training data...');
  await initializeTrainingData();
  process.exit(0);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
}); 