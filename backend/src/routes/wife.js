import { Router } from 'express';

const router = Router();

// GET /api/wife/tips — Returns meal tips ONLY (no medicine data, no clinical data)
router.get('/tips', (req, res) => {
  res.json({
    familyPotTip: {
      title: 'Is hafte ki family pot tip',
      message: 'Sunita ji, agar aloo paratha bana rahi hain to Ramesh ji ke liye ek-do moong dal cheela bhi bana dein. Sugar ke liye accha hota hai. Puri family ke liye healthy hai!',
      why: 'Moong dal cheela has more protein and less starch than aloo paratha.'
    },
    swapSuggestions: [
      { instead: 'Aloo Paratha', tryThis: 'Moong Dal Cheela' },
      { instead: 'White Chawal', tryThis: 'Brown Rice / Daliya' },
      { instead: 'Biryani', tryThis: 'Jeera Rice + Raita (small)' },
      { instead: 'Meetha', tryThis: 'Gud (small) or Fresh Fruit' }
    ],
    privacyNote: 'Yeh page sirf khaane ke tips dikhata hai. Dawai ya test ki koi jaankari nahi dikhti.'
  });
});

export default router;
