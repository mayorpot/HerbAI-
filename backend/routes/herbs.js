// backend/routes/herbs.js
const express = require('express');
const router = express.Router();

// Mock herb database (in production, use real database)
const herbDatabase = [
  {
    id: 1,
    name: 'Ginger',
    scientificName: 'Zingiber officinale',
    uses: ['Nausea', 'Digestion', 'Inflammation', 'Cold & Flu'],
    preparation: 'Tea: Steep 2-3 thin slices in hot water for 10 minutes',
    dosage: '2-3 cups daily',
    warnings: 'May interact with blood thinners',
    benefits: ['Anti-inflammatory', 'Improves digestion', 'Reduces nausea'],
    image: '🫚'
  },
  {
    id: 2,
    name: 'Chamomile',
    scientificName: 'Matricaria chamomilla',
    uses: ['Anxiety', 'Insomnia', 'Digestion', 'Skin inflammation'],
    preparation: 'Tea: Steep 2-3 tsp dried flowers in hot water for 5-10 minutes',
    dosage: '2-3 cups daily, especially before bed',
    warnings: 'May cause drowsiness, avoid if allergic to ragweed',
    benefits: ['Calming', 'Promotes sleep', 'Anti-inflammatory'],
    image: '🌼'
  },
  {
    id: 3,
    name: 'Peppermint',
    scientificName: 'Mentha piperita',
    uses: ['Headache', 'Digestion', 'Respiratory issues', 'Energy'],
    preparation: 'Tea: Steep 1-2 tsp dried leaves in hot water for 5-7 minutes',
    dosage: '2-3 cups daily between meals',
    warnings: 'Avoid if you have GERD or acid reflux',
    benefits: ['Relieves bloating', 'Clears sinuses', 'Energizing'],
    image: '🌿'
  },
  {
    id: 4,
    name: 'Turmeric',
    scientificName: 'Curcuma longa',
    uses: ['Inflammation', 'Joint pain', 'Immunity', 'Antioxidant'],
    preparation: 'Golden milk: Mix 1 tsp powder with warm milk and honey',
    dosage: '1-2 times daily',
    warnings: 'May interact with blood thinners, high doses may cause stomach upset',
    benefits: ['Powerful anti-inflammatory', 'Antioxidant', 'Joint support'],
    image: '🟡'
  },
  {
    id: 5,
    name: 'Echinacea',
    scientificName: 'Echinacea purpurea',
    uses: ['Immune support', 'Cold prevention', 'Respiratory health'],
    preparation: 'Tea: Steep 1-2 tsp dried herb in hot water for 10 minutes',
    dosage: 'At first sign of cold, 3-4 cups daily for up to 10 days',
    warnings: 'Not for long-term use, avoid if allergic to ragweed',
    benefits: ['Immune booster', 'Antiviral properties', 'Anti-inflammatory'],
    image: '💜'
  }
];

// Get all herbs
router.get('/', (req, res) => {
  res.json({
    herbs: herbDatabase,
    total: herbDatabase.length
  });
});

// Search herbs by name or use
router.get('/search', (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  const searchTerm = q.toLowerCase();
  const results = herbDatabase.filter(herb => 
    herb.name.toLowerCase().includes(searchTerm) ||
    herb.scientificName.toLowerCase().includes(searchTerm) ||
    herb.uses.some(use => use.toLowerCase().includes(searchTerm)) ||
    herb.benefits.some(benefit => benefit.toLowerCase().includes(searchTerm))
  );

  res.json({
    results,
    query: q,
    count: results.length
  });
});

// Get herb by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const herb = herbDatabase.find(h => h.id === parseInt(id));
  
  if (!herb) {
    return res.status(404).json({ error: 'Herb not found' });
  }

  res.json({ herb });
});

// Get herbs by symptom
router.get('/symptom/:symptom', (req, res) => {
  const { symptom } = req.params;
  const symptomLower = symptom.toLowerCase();
  
  const relevantHerbs = herbDatabase.filter(herb =>
    herb.uses.some(use => use.toLowerCase().includes(symptomLower))
  );

  res.json({
    symptom,
    herbs: relevantHerbs,
    count: relevantHerbs.length
  });
});

module.exports = router;