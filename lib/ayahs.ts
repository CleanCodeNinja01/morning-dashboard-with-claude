const ayahs = [
  { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", text: "Indeed, with hardship comes ease.", ref: "Surah Al-Inshirah 94:6" },
  { arabic: "وَاللَّهُ مَعَ الصَّابِرِينَ", text: "And Allah is with the patient.", ref: "Surah Al-Baqarah 2:249" },
  { arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", text: "For indeed, with hardship will be ease.", ref: "Surah Al-Inshirah 94:5" },
  { arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", text: "And whoever relies upon Allah — then He is sufficient for him.", ref: "Surah At-Talaq 65:3" },
  { arabic: "إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ", text: "Indeed, Allah does not allow to be lost the reward of those who do good.", ref: "Surah Hud 11:115" },
  { arabic: "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ", text: "And do not despair of relief from Allah.", ref: "Surah Yusuf 12:87" },
  { arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", text: "Sufficient for us is Allah, and He is the best Disposer of affairs.", ref: "Surah Al-Imran 3:173" },
  { arabic: "اللَّهُ لَطِيفٌ بِعِبَادِهِ", text: "Allah is Subtle with His servants.", ref: "Surah Ash-Shura 42:19" },
  { arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ", text: "And He is with you wherever you are.", ref: "Surah Al-Hadid 57:4" },
  { arabic: "إِنَّ اللَّهَ مَعَ الَّذِينَ اتَّقَوا", text: "Indeed, Allah is with those who fear Him.", ref: "Surah An-Nahl 16:128" },
  { arabic: "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ", text: "And my success is not but through Allah.", ref: "Surah Hud 11:88" },
  { arabic: "رَبِّ زِدْنِي عِلْمًا", text: "My Lord, increase me in knowledge.", ref: "Surah Ta-Ha 20:114" },
  { arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ", text: "So remember Me; I will remember you.", ref: "Surah Al-Baqarah 2:152" },
  { arabic: "إِنَّ اللَّهَ يُحِبُّ الْمُتَوَكِّلِينَ", text: "Indeed, Allah loves those who rely upon Him.", ref: "Surah Al-Imran 3:159" },
];

export function getDailyAyah() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return ayahs[dayOfYear % ayahs.length];
}
