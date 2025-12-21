import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/MainPage/Navbar';
import Home from './components/MainPage/Home';

import PDFTools from './components/PDFTools/PDFTools';
import ToolPage from './components/PDFTools/ToolPage';

import CalculatorDashboard from "./components/Calculators/CalculatorDashboard";
import CalculatorTopicList from "./components/Calculators/CalculatorTopicList";
import CalculatorDetail from "./components/Calculators/CalculatorDetail";
import AgeCalculator from "./components/Calculators/Other/AgeCalculator";
import DateCalculator from "./components/Calculators/Other/DateCalculator";
import TimeCalculator from './components/Calculators/Other/TimeCalculator';
import HoursCalculator from './components/Calculators/Other/HoursCalculator';
import GPACalculator from './components/Calculators/Other/GPACalculator';
import GradeCalculator from './components/Calculators/Other/GradeCalculator';
import ConcreteCalculator from './components/Calculators/Other/ConcreteCalculator';
import SubnetCalculator from './components/Calculators/Other/SubnetCalculator';
import PasswordGenerator from './components/Calculators/Other/PasswordGenerator';
import ScientificCalculator from './components/Calculators/Math/ScientificCalculator';
import FractionCalculator from './components/Calculators/Math/FractionCalculator';
import PercentageCalculator from './components/Calculators/Math/PercentageCalculator';
import RandomNumberGenerator from './components/Calculators/Math/RandomNumberGenerator';
import TriangleCalculator from './components/Calculators/Math/TriangleCalculator';
import StandardDeviationCalculator from './components/Calculators/Math/StandardDeviationCalculator';
import MortgageCalculator from './components/Calculators/Finance/MortgageCalculator';
import AmortizationCalculator from './components/Calculators/Finance/AmortizationCalculator';
import LoanCalculator from './components/Calculators/Finance/LoanCalculator';
import AutoLoanCalculator from './components/Calculators/Finance/AutoLoanCalculator';
import InterestCalculator from './components/Calculators/Finance/InterestCalculator';
import InterestRateCalculator from './components/Calculators/Finance/InterestRateCalculator';
import CompoundInterestCalculator from './components/Calculators/Finance/CompoundInterestCalculator';
import InvestmentCalculator from './components/Calculators/Finance/InvestmentCalculator';
import InflationCalculator from './components/Calculators/Finance/InflationCalculator';
import FinanceCalculator from './components/Calculators/Finance/FinanceCalculator';
import IncomeTaxCalculator from './components/Calculators/Finance/IncomeTaxCalculator';
import SalaryCalculator from './components/Calculators/Finance/SalaryCalculator';
import SalesTaxCalculator from './components/Calculators/Finance/SalesTaxCalculator';
import PaymentCalculator from './components/Calculators/Finance/PaymentCalculator';
import RetirementCalculator from './components/Calculators/Finance/RetirementCalculator';
import BMICalculator from './components/Calculators/Fitness/BMICalculator';
import CalorieCalculator from './components/Calculators/Fitness/CalorieCalculator';
import BodyFatCalculator from './components/Calculators/Fitness/BodyFatCalculator';
import BMRCalculator from './components/Calculators/Fitness/BMRCalculator';
import IdealWeightCalculator from './components/Calculators/Fitness/IdealWeightCalculator';
import PaceCalculator from './components/Calculators/Fitness/PaceCalculator';
import PregnancyCalculator from './components/Calculators/Fitness/PregnancyCalculator';
import PregnancyConceptionCalculator from './components/Calculators/Fitness/PregnancyConceptionCalculator';
import DueDateCalculator from './components/Calculators/Fitness/DueDateCalculator';

import CompressionPage from './components/Compressions/CompressionPage';
import PdfCompressionTool from './components/Compressions/EachCompressionTool/PdfCompressionTool';
import WordCompressionTool from './components/Compressions/EachCompressionTool/WordCompressionTool';
import ImageCompressionTool from './components/Compressions/EachCompressionTool/ImageCompressionTool';

import ConvertersPage from './components/Converters/ConvertersPage';
import LengthDistance from './components/Converters/EachConverterTool/LengthDistance';
import CapitalizationConverter from './components/Converters/EachConverterTool/CapitalizationConverter';
import StrikethroughTextConverter from './components/Converters/EachConverterTool/StrikethroughTextConverter';
import ScrambledTextConverter from './components/Converters/EachConverterTool/ScrambledTextConverter';
import LeetTextConverter from './components/Converters/EachConverterTool/LeetTextConverter';
import NumberToWordsConverter from './components/Converters/EachConverterTool/NumberToWordsConverter';
import AddCommasToNumbersConverter from './components/Converters/EachConverterTool/AddCommasToNumbersConverter';
import MonospaceTextConverter from './components/Converters/EachConverterTool/MonospaceTextConverter';
import UnicodeMonospaceTextConverter from './components/Converters/EachConverterTool/UnicodeMonospaceTextConverter';
import WordCounter from './components/Converters/EachConverterTool/WordCounter';
import SentenceCounter from './components/Converters/EachConverterTool/SentenceCounter';
import LineCounter from './components/Converters/EachConverterTool/LineCounter';
import ParagraphCounter from './components/Converters/EachConverterTool/ParagraphCounter';
import TextCharacterCounter from './components/Converters/EachConverterTool/TextCharacterCounter';
import LettersCounter from './components/Converters/EachConverterTool/LettersCounter';
import FullStopCounter from './components/Converters/EachConverterTool/FullStopCounter';
import CountCommas from './components/Converters/EachConverterTool/CountCommas';
import PunctuationCounter from './components/Converters/EachConverterTool/PunctuationCounter';
import CountVowels from './components/Converters/EachConverterTool/CountVowels';
import EmojiCounter from './components/Converters/EachConverterTool/EmojiCounter';
import CapitalLetterCounter from './components/Converters/EachConverterTool/CapitalLetterCounter';
import InvisibleCharacterDetector from './components/Converters/EachConverterTool/InvisibleCharacterDetector';
import TextSpeedReader from './components/Converters/EachConverterTool/TextSpeedReader';
import ApothecariesWeightConverter from './components/Converters/EachConverterTool/ApothecariesWeightConverter';
import ShotgunGaugeConverter from './components/Converters/EachConverterTool/ShotgunGaugeConverter';
import EstimateTextReadingTime from './components/Converters/EachConverterTool/EstimateTextReadingTime';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pdf-tools" element={<PDFTools />} />
        <Route path="/compression" element={<CompressionPage />} />

        <Route path="/calculators" element={<CalculatorDashboard />} />
        <Route path="/calculators/:topic" element={<CalculatorTopicList />} />
        <Route path="/calculators/:topic/:calculatorId" element={<CalculatorDetail />} />
        <Route path="/calculators/other/age" element={<AgeCalculator />} />
        <Route path="/calculators/other/date" element={<DateCalculator />} />
        <Route path="/calculators/other/time" element={<TimeCalculator />} />
        <Route path="/calculators/other/hours" element={<HoursCalculator />} />
        <Route path="/calculators/other/gpa" element={<GPACalculator />} />
        <Route path="/calculators/other/grade" element={<GradeCalculator />} />
        <Route path="/calculators/other/concrete" element={<ConcreteCalculator />} />
        <Route path="/calculators/other/subnet" element={<SubnetCalculator />} />
        <Route path="/calculators/other/password" element={<PasswordGenerator />} />
        <Route path="/calculators/math/scientific" element={<ScientificCalculator />} />
        <Route path="/calculators/math/fraction" element={<FractionCalculator />} />
        <Route path="/calculators/math/percentage" element={<PercentageCalculator />} />
        <Route path="/calculators/math/random-number" element={<RandomNumberGenerator />} />
        <Route path="/calculators/math/triangle" element={<TriangleCalculator />} />
        <Route path="/calculators/math/standard-deviation" element={<StandardDeviationCalculator />} />
        <Route path="/calculators/financial/mortgage" element={<MortgageCalculator />} />
        <Route path="/calculators/financial/amortization" element={<AmortizationCalculator />} />
        <Route path="/calculators/financial/loan" element={<LoanCalculator />} />
        <Route path="/calculators/financial/auto-loan" element={<AutoLoanCalculator />} />
        <Route path="/calculators/financial/interest" element={<InterestCalculator />} />
        <Route path="/calculators/financial/interest-rate" element={<InterestRateCalculator />} />
        <Route path="/calculators/financial/compound-interest" element={<CompoundInterestCalculator />} />
        <Route path="/calculators/financial/investment" element={<InvestmentCalculator />} />
        <Route path="/calculators/financial/inflation" element={<InflationCalculator />} />
        <Route path="/calculators/financial/finance" element={<FinanceCalculator />} />
        <Route path="/calculators/financial/income-tax" element={<IncomeTaxCalculator />} />
        <Route path="/calculators/financial/salary" element={<SalaryCalculator />} />
        <Route path="/calculators/financial/sales-tax" element={<SalesTaxCalculator />} />
        <Route path="/calculators/financial/payment" element={<PaymentCalculator />} />
        <Route path="/calculators/financial/retirement" element={<RetirementCalculator />} />
        <Route path="/calculators/fitness/bmi" element={<BMICalculator />} />
        <Route path="/calculators/fitness/calorie" element={<CalorieCalculator />} />
        <Route path="/calculators/fitness/body-fat" element={<BodyFatCalculator />} />
        <Route path="/calculators/fitness/bmr" element={<BMRCalculator />} />
        <Route path="/calculators/fitness/ideal-weight" element={<IdealWeightCalculator />} />
        <Route path="/calculators/fitness/pace" element={<PaceCalculator />} />
        <Route path="/calculators/fitness/pregnancy" element={<PregnancyCalculator />} />
        <Route path="/calculators/fitness/pregnancy-conception" element={<PregnancyConceptionCalculator />} />
        <Route path="/calculators/fitness/due-date" element={<DueDateCalculator />} />

        <Route path="/pdf-compress" element={<PdfCompressionTool />} />
        <Route path="/word-compress" element={<WordCompressionTool />} />
        <Route path="/image-compress" element={<ImageCompressionTool />} />

        <Route path="/tools/:toolName" element={<ToolPage />} />
        <Route path="/converters" element={<ConvertersPage />} />
        <Route path="/length-distance" element={<LengthDistance />} />
        <Route path="/capitalization" element={<CapitalizationConverter />} />
        <Route path="/strikethrough-text" element={<StrikethroughTextConverter />} />
        <Route path="/scrambled-text" element={<ScrambledTextConverter />} />
        <Route path="/leet-text" element={<LeetTextConverter />} />
        <Route path="/number-to-words" element={<NumberToWordsConverter />} />
        <Route path="/add-commas" element={<AddCommasToNumbersConverter />} />
        <Route path="/monospace-text" element={<MonospaceTextConverter />} />
        <Route path="/unicode-monospace-text" element={<UnicodeMonospaceTextConverter />} />
        <Route path="/word-counter" element={<WordCounter />} />
        <Route path="/sentence-counter" element={<SentenceCounter />} />
        <Route path="/line-counter" element={<LineCounter />} />
        <Route path="/paragraph-counter" element={<ParagraphCounter />} />
        <Route path="/text-character-counter" element={<TextCharacterCounter />} />
        <Route path="/count-letters" element={<LettersCounter />} />
        <Route path="/count-fullstops" element={<FullStopCounter />} />
        <Route path="/count-commas" element={<CountCommas />} />
        <Route path="/punctuation-counter" element={<PunctuationCounter />} />
        <Route path="/count-vowels" element={<CountVowels />} />
        <Route path="/emoji-counter" element={<EmojiCounter />} />
        <Route path="/capital-letter-counter" element={<CapitalLetterCounter />} />
        <Route path="/invisible-character-detector" element={<InvisibleCharacterDetector />} />
        <Route path="/text-speed-reader" element={<TextSpeedReader />} />
        <Route path="/apothecaries-weight-converter" element={<ApothecariesWeightConverter />} />
        <Route path="/shotgun-gauge-to-bore-diameter" element={<ShotgunGaugeConverter />} />
        <Route path="/estimate-text-reading-time" element={<EstimateTextReadingTime />} />
      </Routes>
    </Router>
  );
}

