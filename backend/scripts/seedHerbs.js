// backend/scripts/seedHerbs.js
const mongoose = require('mongoose');
const Herb = require('../models/Herb');
require('dotenv').config();

const sampleHerbs = [
  {
    name: "Turmeric",
    scientific: "Curcuma longa",
    description: "A bright yellow spice known for its powerful anti-inflammatory and antioxidant properties. Used traditionally in Ayurvedic and Chinese medicine.",
    benefits: ["Reduces inflammation", "Powerful antioxidant", "Improves brain function", "Supports joint health", "Aids digestion"],
    conditions: ["Arthritis", "Inflammation", "Joint pain", "Digestive issues", "Oxidative stress"],
    imageUrl: "https://images.unsplash.com/photo-1596040033221-a1f6f4c31dee?w=400"
  },
  {
    name: "Ginger",
    scientific: "Zingiber officinale",
    description: "A flowering plant whose rhizome is widely used as a spice and folk medicine. Known for its anti-nausea and anti-inflammatory effects.",
    benefits: ["Reduces nausea", "Anti-inflammatory", "Aids digestion", "Relieves pain", "Boosts immunity"],
    conditions: ["Nausea", "Indigestion", "Inflammation", "Muscle pain", "Morning sickness"],
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400"
  },
  {
    name: "Garlic",
    scientific: "Allium sativum",
    description: "A species in the onion genus used for both culinary and medicinal purposes. Known for its cardiovascular and immune benefits.",
    benefits: ["Boosts immunity", "Lowers blood pressure", "Reduces cholesterol", "Antibacterial properties", "Rich in antioxidants"],
    conditions: ["High blood pressure", "High cholesterol", "Common cold", "Infections", "Cardiovascular issues"],
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400"
  },
  {
    name: "Peppermint",
    scientific: "Mentha piperita",
    description: "A hybrid mint known for its refreshing aroma and digestive benefits. Commonly used for IBS and digestive discomfort.",
    benefits: ["Relieves digestive issues", "Reduces headaches", "Clears respiratory tract", "Antimicrobial properties", "Mental clarity"],
    conditions: ["IBS", "Indigestion", "Headaches", "Nasal congestion", "Nausea"],
    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0f95c1e5b44?w=400"
  },
  {
    name: "Chamomile",
    scientific: "Matricaria chamomilla",
    description: "A daisy-like plant known for its calming properties. Often used as a tea for relaxation and sleep support.",
    benefits: ["Promotes relaxation", "Aids sleep", "Reduces anxiety", "Anti-inflammatory", "Skin health"],
    conditions: ["Anxiety", "Insomnia", "Digestive issues", "Skin irritation", "Stress"],
    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0f95c1e5b44?w=400"
  },
  {
    name: "Echinacea",
    scientific: "Echinacea purpurea",
    description: "A flowering plant in the daisy family known for its immune-boosting properties. Commonly used to prevent and treat colds.",
    benefits: ["Boosts immune system", "Fights infections", "Reduces inflammation", "Antioxidant properties", "Wound healing"],
    conditions: ["Common cold", "Respiratory infections", "Immune weakness", "Inflammation", "Skin wounds"],
    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0f95c1e5b44?w=400"
  },
  {
    name: "Lavender",
    scientific: "Lavandula angustifolia",
    description: "A flowering plant known for its calming fragrance and relaxing properties. Used for anxiety, sleep, and skin health.",
    benefits: ["Reduces anxiety", "Promotes sleep", "Skin healing", "Pain relief", "Antimicrobial"],
    conditions: ["Anxiety", "Insomnia", "Stress", "Skin irritation", "Headaches"],
    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0f95c1e5b44?w=400"
  },
  {
    name: "Ginseng",
    scientific: "Panax ginseng",
    description: "A slow-growing perennial plant with fleshy roots, known for its energy-boosting and adaptogenic properties.",
    benefits: ["Boosts energy", "Reduces stress", "Improves cognitive function", "Enhances immunity", "Anti-fatigue"],
    conditions: ["Fatigue", "Stress", "Low energy", "Weak immunity", "Mental fog"],
    imageUrl: "https://images.unsplash.com/photo-1594736797933-d0f95c1e5b44?w=400"
  }
];

async function seedHerbs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing herbs
    await Herb.deleteMany({});
    console.log('✅ Cleared existing herbs');

    // Add sample herbs
    for (const herbData of sampleHerbs) {
      const herb = new Herb({
        ...herbData,
        createdBy: new mongoose.Types.ObjectId() // Default admin user
      });
      await herb.save();
      console.log(`✅ Added: ${herb.name}`);
    }

    console.log('🎉 Sample herbs added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding herbs:', error);
    process.exit(1);
  }
}

seedHerbs();