import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Gem, Wallet, PieChart, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import Fireworks from '@/components/Fireworks';
import ProgressStepper from '@/components/ProgressStepper';
import ScrollReveal from '@/components/ScrollReveal';
import InteractiveBackground from '@/components/InteractiveBackground';
import Preloader from '@/components/Preloader';
import AnimatedNumber from '@/components/AnimatedNumber';
import CursorGlow from '@/components/CursorGlow';
import { currencies, investmentTypes, allCurrencies } from '@/data/investmentData';

// Custom hook for portfolio calculations
const usePortfolioCalculator = (monthlyIncome, investmentRate, assetDistribution) => {
  return useMemo(() => {
    const income = parseFloat(monthlyIncome) || 0;
    const investmentAmount = (income * investmentRate) / 100;
    const distributionTotal = Object.values(assetDistribution).reduce(
      (acc, val) => acc + (parseFloat(val) || 0),
      0
    );
    const isBalanced = Math.abs(distributionTotal - 100) < 0.01;
    
    return {
      monthlyIncome: income,
      investmentFund: investmentAmount,
      distributionTotal,
      isBalanced,
      remainingAllocation: 100 - distributionTotal
    };
  }, [monthlyIncome, investmentRate, assetDistribution]);
};

function App() {
  // State management with more descriptive names
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [investmentRate, setInvestmentRate] = useState(100);
  const [assetDistribution, setAssetDistribution] = useState({});
  const [celebrationActive, setCelebrationActive] = useState(false);
  const [activeSection, setActiveSection] = useState(1);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Refs for smooth navigation
  const incomeInputRef = useRef(null);
  const distributionRef = useRef(null);
  const summaryRef = useRef(null);

  // Get currency details
  const currencyDetails = allCurrencies.find(c => c.code === selectedCurrency);
  
  // Use custom hook for calculations
  const portfolio = usePortfolioCalculator(monthlyIncome, investmentRate, assetDistribution);

  // Celebration effect when portfolio is balanced
  useEffect(() => {
    if (portfolio.isBalanced && portfolio.investmentFund > 0) {
      setCelebrationActive(true);
      const celebrationTimer = setTimeout(() => setCelebrationActive(false), 3500);
      
      const scrollTimer = setTimeout(() => {
        summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);

      return () => {
        clearTimeout(celebrationTimer);
        clearTimeout(scrollTimer);
      };
    }
  }, [portfolio.isBalanced, portfolio.investmentFund]);

  // Handle asset allocation updates with validation
  const updateAssetAllocation = useCallback((assetId, percentage) => {
    const numericValue = parseFloat(percentage);
    if (isNaN(numericValue) || (numericValue >= 0 && numericValue <= 100)) {
      setAssetDistribution(prev => ({
        ...prev,
        [assetId]: percentage
      }));
    }
  }, []);

  // Currency formatter with fallback
  const formatMoneyValue = useCallback((amount) => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: selectedCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (error) {
      return `${currencyDetails?.symbol || '$'}${amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }
  }, [selectedCurrency, currencyDetails]);
  
  // Navigate to specific section
  const navigateToSection = useCallback((sectionId) => {
    const sectionMap = {
      1: incomeInputRef,
      2: distributionRef,
      3: summaryRef
    };
    
    const targetSection = sectionMap[sectionId];
    if (targetSection?.current) {
      targetSection.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Animation variants for staggered entrance
  const pageAnimations = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  if (isInitializing) {
    return <Preloader onComplete={() => setIsInitializing(false)} />;
  }

  return (
    <>
      <Helmet>
        <title>Wealth Allocator - Strategic Portfolio Planning</title>
        <meta name="description" content="Design your personalized wealth strategy with our advanced allocation tool. Input your income, distribute across multiple asset classes, and track your financial growth journey." />
        <meta name="author" content="shahzaibRana" />
      </Helmet>
      <InteractiveBackground />
      <CursorGlow />
      <AnimatePresence>
        {celebrationActive && <Fireworks />}
      </AnimatePresence>
      <div className="min-h-screen p-4 md:p-8 relative z-10">
        <motion.div
          variants={pageAnimations}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto space-y-12 md:space-y-16"
        >
          <ScrollReveal onVisible={() => {}}>
            <div className="text-center space-y-6 pt-8">
              <motion.div
                className="flex justify-center"
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'backOut', delay: 0.1 }}
              >
                <div className="p-4 md:p-5 rounded-full bg-gradient-to-br from-purple-500 via-amber-500 to-orange-600 pulse-glow shadow-lg">
                  <Gem className="h-12 w-12 md:h-14 md:w-14 text-white" />
                </div>
              </motion.div>
              <motion.h1
                className="text-4xl sm:text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-amber-200 to-orange-300 text-glow"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
              >
                Wealth Allocator
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
              >
                Design your personalized investment strategy. Input your monthly income, distribute across diverse asset classes, and visualize your wealth-building journey.
              </motion.p>
            </div>
          </ScrollReveal>

          <div className="sticky top-4 z-50 flex justify-center my-8">
             <div className="w-full max-w-3xl backdrop-blur-md bg-black/30 rounded-2xl border border-zinc-800 shadow-lg p-2">
                <ProgressStepper currentStep={activeSection} onStepClick={navigateToSection} />
             </div>
          </div>

          <ScrollReveal onVisible={() => setActiveSection(1)}>
            <div ref={incomeInputRef}>
              <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                <Card className="card-glow-border hover:shadow-2xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg md:text-xl">
                      <Wallet className="h-6 w-6 text-purple-400" />
                      Phase 1: Income Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="monthly-income" className="text-zinc-300 text-base font-medium">Monthly Net Income</Label>
                        <Input
                          id="monthly-income"
                          type="number"
                          placeholder="Enter amount (e.g., 5000)"
                          value={monthlyIncome}
                          onChange={(e) => setMonthlyIncome(e.target.value)}
                          className="text-lg"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="currency-select" className="text-zinc-300 text-base font-medium">Select Currency</Label>
                        <Select
                          id="currency-select"
                          value={selectedCurrency}
                          onChange={(e) => setSelectedCurrency(e.target.value)}
                        >
                          {Object.entries(currencies).map(([region, currencyList]) => (
                            <optgroup key={region} label={region} className="bg-zinc-900 font-bold text-purple-400">
                              {currencyList.map((curr) => (
                                <option key={curr.code} value={curr.code} className="bg-zinc-800 text-white font-normal">
                                  {curr.code} - {curr.name}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <Label htmlFor="investment-slider" className="text-zinc-300 text-base font-medium">
                        Investment Allocation Rate: <span className="font-bold text-purple-400">{investmentRate}%</span>
                      </Label>
                      <input
                        id="investment-slider"
                        type="range"
                        min="0"
                        max="100"
                        value={investmentRate}
                        onChange={(e) => setInvestmentRate(parseInt(e.target.value))}
                        className="w-full h-3 bg-zinc-800 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-sm text-zinc-500 font-medium">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {portfolio.monthlyIncome > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 md:p-5 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20"
                      >
                        <p className="text-zinc-300 font-medium text-base md:text-lg">
                          Monthly Investment Budget: <span className="text-purple-400 text-xl md:text-2xl font-bold tracking-wider block sm:inline mt-1 sm:mt-0">
                            {formatMoneyValue(portfolio.investmentFund)}
                          </span>
                        </p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </ScrollReveal>

          {portfolio.investmentFund > 0 && (
            <ScrollReveal onVisible={() => setActiveSection(2)}>
              <div ref={distributionRef}>
                <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                  <Card className="card-glow-border hover:shadow-2xl transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-lg md:text-xl">
                        <PieChart className="h-6 w-6 text-amber-400" />
                        Phase 2: Asset Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {investmentTypes.map((asset) => (
                          <motion.div
                            key={asset.id}
                            whileHover={{ scale: 1.02, zIndex: 10, transition: { duration: 0.15 } }}
                            className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-purple-500/50 hover:bg-purple-900/10 transition-all duration-200 shadow-md"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl md:text-3xl">{asset.icon}</span>
                                <span className="text-zinc-200 font-medium text-base md:text-lg">{asset.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={assetDistribution[asset.id] || ''}
                                  onChange={(e) => updateAssetAllocation(asset.id, e.target.value)}
                                  className="w-20 md:w-24 text-center text-lg"
                                  min="0"
                                  max="100"
                                  step="0.1"
                                />
                                <span className="text-zinc-400 text-lg font-medium">%</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="space-y-4 pt-4">
                        <div className={`p-4 rounded-lg border transition-all duration-300 ${
                          portfolio.isBalanced
                            ? 'bg-emerald-500/10 border-emerald-500/30 shadow-emerald-500/20 shadow-lg'
                            : portfolio.distributionTotal > 0
                              ? 'bg-amber-500/10 border-amber-500/30'
                              : 'bg-zinc-900/50 border-zinc-800'
                        }`}>
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                            <span className="text-zinc-200 font-medium text-base md:text-lg">Distribution Total:</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${
                                portfolio.isBalanced ? 'text-emerald-400' :
                                portfolio.distributionTotal > 100 ? 'text-red-400' : 'text-amber-400'
                              }`}>
                                {portfolio.distributionTotal.toFixed(1)}%
                              </span>
                              {portfolio.isBalanced ? (
                                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                              ) : portfolio.distributionTotal > 0 ? (
                                <AlertCircle className="h-6 w-6 text-amber-400" />
                              ) : null}
                            </div>
                          </div>
                          
                          {!portfolio.isBalanced && portfolio.distributionTotal > 0 && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-sm text-amber-400 mt-2 text-center sm:text-left font-medium"
                            >
                              {portfolio.distributionTotal > 100
                                ? `Exceeded by ${(portfolio.distributionTotal - 100).toFixed(1)}%. Please adjust your distribution.`
                                : `Remaining ${portfolio.remainingAllocation.toFixed(1)}% to allocate for complete portfolio.`
                              }
                            </motion.p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </ScrollReveal>
          )}

          {portfolio.isBalanced && (
            <ScrollReveal onVisible={() => setActiveSection(3)}>
              <div ref={summaryRef}>
                <motion.div
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="card-glow-border hover:shadow-2xl transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-emerald-400 text-lg md:text-xl">
                        <CheckCircle2 className="h-6 w-6" />
                        Phase 3: Portfolio Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      <div className="p-4 md:p-6 rounded-lg bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 shadow-lg">
                        <p className="text-zinc-300 text-base md:text-lg mb-4 text-center sm:text-left leading-relaxed">
                          Based on your monthly income of <span className="font-bold text-purple-400">{formatMoneyValue(portfolio.monthlyIncome)}</span>,
                          with <span className="font-bold text-amber-400">{investmentRate}%</span> allocated for investments.
                        </p>
                        <p className="text-zinc-200 text-lg md:text-xl text-center sm:text-left">
                          Your Investment Budget: <span className="font-bold text-emerald-400 text-2xl md:text-3xl tracking-wider block mt-1">
                            <AnimatedNumber value={portfolio.investmentFund} formatCurrency={formatMoneyValue} />
                          </span>
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xl md:text-2xl font-semibold text-zinc-200 mb-4">Asset Distribution Details:</h3>
                        {Object.entries(assetDistribution)
                          .filter(([_, percent]) => parseFloat(percent) > 0)
                          .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))
                          .map(([assetId, percent]) => {
                            const asset = investmentTypes.find(inv => inv.id === assetId);
                            const investmentAmount = (portfolio.investmentFund * parseFloat(percent)) / 100;
                            
                            return (
                              <motion.div
                                key={assetId}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                whileHover={{ scale: 1.01, transition: { duration: 0.15 } }}
                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 p-4 md:p-5 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800/50 hover:border-purple-500/30 transition-all duration-200 shadow-md"
                              >
                                <div className="flex items-center gap-4">
                                  <span className="text-2xl md:text-3xl">{asset.icon}</span>
                                  <div>
                                    <span className="text-zinc-100 font-medium text-base md:text-lg">{asset.name}</span>
                                    <span className="text-zinc-400 text-sm block font-medium">({parseFloat(percent).toFixed(1)}%)</span>
                                  </div>
                                </div>
                                <span className="text-lg md:text-xl font-bold text-emerald-400 tracking-wide self-end sm:self-center">
                                  <AnimatedNumber value={investmentAmount} formatCurrency={formatMoneyValue} />
                                </span>
                              </motion.div>
                            );
                          })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </ScrollReveal>
          )}
        </motion.div>
        
        <Toaster />
      </div>
    </>
  );
}

export default App;