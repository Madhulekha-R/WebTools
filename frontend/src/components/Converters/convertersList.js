import {
  FaRuler, FaFont, FaStrikethrough, FaRandom, FaHashtag,
  FaAlignLeft, FaListOl, FaParagraph, FaCalculator,
  FaEyeSlash, FaClock, FaCog, FaImage
} from "react-icons/fa";
import { GiWeight, GiShotgun } from "react-icons/gi";
import { MdEmojiEmotions } from "react-icons/md";
const converters = [
  { name: "Length & Distance Converter", path: "/length-distance", category: "converters", icon: FaRuler },
  { name: "Capitalization Converter", path: "/capitalization", category: "converters", icon: FaFont },
  { name: "Strikethrough Text Converter", path: "/strikethrough-text", category: "converters", icon: FaStrikethrough },
  { name: "Scrambled Text Converter", path: "/scrambled-text", category: "converters", icon: FaRandom },
  { name: "Leet(1337) Text Converter", path: "/leet-text", category: "converters", icon: FaHashtag },
  { name: "Number to Words Converter", path: "/number-to-words", category: "converters", icon: FaAlignLeft },
  { name: "Add Commas to Numbers", path: "/add-commas", category: "converters", icon: FaHashtag },
  { name: "Monospace Text Converter", path: "/monospace-text", category: "converters", icon: FaFont },
  { name: "Unicode Monospace Text Converter", path: "/unicode-monospace-text", category: "converters", icon: FaFont },
  { name: "Word Counter", path: "/word-counter", category: "counters", icon: FaListOl },
  { name: "Sentence Counter", path: "/sentence-counter", category: "counters", icon: FaParagraph },
  { name: "Line Counter", path: "/line-counter", category: "counters", icon: FaAlignLeft },
  { name: "Paragraph Counter", path: "/paragraph-counter", category: "counters", icon: FaParagraph },
  { name: "Text Character Counter", path: "/text-character-counter", category: "counters", icon: FaCalculator },
  { name: "CountLetters in Text", path: "/count-letters", category: "counters", icon: FaFont },
  { name: "CountFullStops in Text", path: "/count-fullstops", category: "counters", icon: FaAlignLeft },
  { name: "CountCommas in Text", path: "/count-commas", category: "counters", icon: FaHashtag },
  { name: "Punctuation Counter in Text", path: "/punctuation-counter", category: "counters", icon: FaCalculator },
  { name: "Count Vowels in Text", path: "/count-vowels", category: "counters", icon: FaFont },
  { name: "Emoji Counter", path: "/emoji-counter", category: "counters", icon: MdEmojiEmotions },
  { name: "Capital Letter Counter", path: "/capital-letter-counter", category: "counters", icon: FaFont },
  { name: "Invisible Character Detector", path: "/invisible-character-detector", category: "specials", icon: FaEyeSlash },
  { name: "Text Speed Reader", path: "/text-speed-reader", category: "specials", icon: FaClock },
  { name: "Apothecaries Weight Converter", path: "/apothecaries-weight-converter", category: "specials", icon: GiWeight },
  { name: "Shotgun Gauge to Bore Diameter", path: "/shotgun-gauge-to-bore-diameter", category: "specials", icon: GiShotgun },
  { name: "Estimate Text Reading Time", path: "/estimate-text-reading-time", category: "specials", icon: FaClock },
];
export default converters;