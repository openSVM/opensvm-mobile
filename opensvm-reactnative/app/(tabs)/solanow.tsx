import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions, Linking } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { LineChart } from '@/components/charts/LineChart';
import { Coins, TrendingUp, Clock, Percent, DollarSign, Calculator, Info, ArrowRight, ChevronDown, ChevronUp, ExternalLink, MessageSquare } from 'lucide-react-native';
import { Platform } from 'react-native';
import { GitHubThread } from '@/components/GitHubThread';

// Constants for the emission mechanism
const INITIAL_INFLATION = 4.5; // Current inflation rate (r)
const DISINFLATION_RATE = 15; // 15% per year
const LONG_TERM_INFLATION = 1.5;
const CURRENT_SUPPLY = 563_837_000; // Current SOL supply
const CURRENT_PRICE = 108.75; // Current SOL price in USD
const CURRENT_STAKING_PERCENTAGE = 65; // Current staking percentage
const C_CONSTANT = 3.14626436994; // Approximately π

export default function SIMDScreen() {
  const [activeTab, setActiveTab] = useState('emission'); // 'emission', 'staking', or 'discussion'
  const [stakingPercentage, setStakingPercentage] = useState(CURRENT_STAKING_PERCENTAGE);
  const [showFormulas, setShowFormulas] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [emissionData, setEmissionData] = useState<any[]>([]);
  const [validatorReturnsData, setValidatorReturnsData] = useState<any[]>([]);
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // For staking calculator
  const [stakingAmount, setStakingAmount] = useState('1000');
  const [stakingPeriod, setStakingPeriod] = useState(12);
  const [stakingYield, setStakingYield] = useState(6.8);

  const openForumLink = () => {
    Linking.openURL('https://forum.solana.com/t/proposal-for-introducing-a-programmatic-market-based-emission-mechanism-based-on-staking-participation-rate/3294');
  };

  const openGitHubPR = () => {
    Linking.openURL('https://github.com/solana-foundation/solana-improvement-documents/pull/228');
  };

  // Calculate emission rate based on staking percentage
  const calculateEmissionRate = useCallback((s: number) => {
    // Convert percentage to decimal
    const stakeRatio = s / 100;
    
    // Calculate using the formula from the paper
    // i(s) = r(1-√s + c · max(1-√2s,0))
    const sqrtS = Math.sqrt(stakeRatio);
    const sqrt2S = Math.sqrt(2 * stakeRatio);
    const maxTerm = Math.max(1 - sqrt2S, 0);
    
    return INITIAL_INFLATION * (1 - sqrtS + C_CONSTANT * maxTerm);
  }, []);

  // Calculate validator returns based on emission rate and staking percentage
  const calculateValidatorReturns = useCallback((s: number) => {
    // Convert percentage to decimal
    const stakeRatio = s / 100;
    
    // Calculate emission rate
    const emissionRate = calculateEmissionRate(s);
    
    // v(s) = i(s)/s
    return emissionRate / stakeRatio;
  }, [calculateEmissionRate]);

  // Generate data for charts
  useEffect(() => {
    const generateChartData = () => {
      const emissionPoints = [];
      const returnsPoints = [];
      const comparisonPoints = [];
      const now = Date.now();
      
      // Generate data points for staking percentages from 10% to 100%
      for (let s = 10; s <= 100; s += 1) {
        const emissionRate = calculateEmissionRate(s);
        const validatorReturn = calculateValidatorReturns(s);
        
        emissionPoints.push({
          timestamp: now,
          value: emissionRate,
          x: s
        });
        
        returnsPoints.push({
          timestamp: now,
          value: validatorReturn,
          x: s
        });
        
        // Add comparison with static emission rate
        comparisonPoints.push({
          timestamp: now,
          value: s === CURRENT_STAKING_PERCENTAGE ? emissionRate : null,
          x: s
        });
      }
      
      setEmissionData(emissionPoints);
      setValidatorReturnsData(returnsPoints);
      setComparisonData(comparisonPoints);
      setIsLoading(false);
    };
    
    generateChartData();
  }, [calculateEmissionRate, calculateValidatorReturns]);

  // Calculate staking rewards for the calculator
  const calculateStakingRewards = () => {
    const amount = parseFloat(stakingAmount) || 0;
    const monthlyYield = stakingYield / 12 / 100;
    let totalRewards = 0;
    let currentAmount = amount;
    
    for (let month = 1; month <= stakingPeriod; month++) {
      const monthlyReward = currentAmount * monthlyYield;
      totalRewards += monthlyReward;
      currentAmount += monthlyReward; // Compound interest
    }
    
    return {
      totalRewards: totalRewards.toFixed(2),
      finalAmount: currentAmount.toFixed(2),
      rewardsUsd: (totalRewards * CURRENT_PRICE).toFixed(2),
      finalAmountUsd: (currentAmount * CURRENT_PRICE).toFixed(2)
    };
  };

  const stakingResults = calculateStakingRewards();
  
  // Calculate current emission rate and validator returns
  const currentEmissionRate = calculateEmissionRate(stakingPercentage);
  const currentValidatorReturns = calculateValidatorReturns(stakingPercentage);

  // Format numbers for display
  const formatNumber = (num: number, decimals = 2) => {
    return num.toFixed(decimals);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>[SIMD-0228]</Text>
          <TouchableOpacity onPress={openForumLink} style={styles.linkButton}>
            <ExternalLink size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>
          Market-Based Emission Mechanism
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'emission' && styles.activeTab]}
          onPress={() => setActiveTab('emission')}
        >
          <Text style={[styles.tabText, activeTab === 'emission' && styles.activeTabText]}>
            Emission Mechanism
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'staking' && styles.activeTab]}
          onPress={() => setActiveTab('staking')}
        >
          <Text style={[styles.tabText, activeTab === 'staking' && styles.activeTabText]}>
            Staking Calculator
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'discussion' && styles.activeTab]}
          onPress={() => setActiveTab('discussion')}
        >
          <Text style={[styles.tabText, activeTab === 'discussion' && styles.activeTabText]}>
            Discussion
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'emission' ? (
        <>
          {/* Emission Mechanism Explanation */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.explanationHeader}
              onPress={() => setShowExplanation(!showExplanation)}
            >
              <Text style={styles.sectionTitle}>Market-Based Emission Mechanism</Text>
              {showExplanation ? <ChevronUp size={20} color={colors.text} /> : <ChevronDown size={20} color={colors.text} />}
            </TouchableOpacity>
            
            {showExplanation && (
              <View style={styles.explanationContent}>
                <Text style={styles.explanationText}>
                  SIMD-0228 introduces a market-based emission mechanism that adjusts Solana's inflation rate based on staking participation. As more SOL is staked, the emission rate decreases, optimizing network security while minimizing unnecessary inflation.
                </Text>
                <Text style={styles.explanationText}>
                  This approach replaces the current static emission schedule with a dynamic one that responds to market conditions, particularly the increasing revenue validators earn from MEV (Maximal Extractable Value).
                </Text>
                <Text style={styles.explanationText}>
                  The mechanism uses a formula that reduces the issuance rate by a factor of the square root of the staking participation rate, with additional adjustments when staking participation falls below 50%.
                </Text>
                <TouchableOpacity 
                  style={styles.readMoreButton}
                  onPress={openForumLink}
                >
                  <Text style={styles.readMoreText}>Read full proposal on forum</Text>
                  <ExternalLink size={14} color={colors.primary} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Formula Section */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.explanationHeader}
              onPress={() => setShowFormulas(!showFormulas)}
            >
              <Text style={styles.sectionTitle}>The Formula</Text>
              {showFormulas ? <ChevronUp size={20} color={colors.text} /> : <ChevronDown size={20} color={colors.text} />}
            </TouchableOpacity>
            
            {showFormulas && (
              <View style={styles.formulaContainer}>
                <Text style={styles.formulaTitle}>Issuance Rate Formula:</Text>
                <Text style={styles.formula}>i(s) = r(1-√s + c · max(1-√2s,0))</Text>
                
                <Text style={styles.formulaTitle}>Validator Returns Formula:</Text>
                <Text style={styles.formula}>v(s) = i(s)/s</Text>
                
                <Text style={styles.formulaExplanation}>
                  Where:
                </Text>
                <Text style={styles.formulaExplanation}>
                  • s is the fraction of total supply staked
                </Text>
                <Text style={styles.formulaExplanation}>
                  • r is the current inflation rate (4.5%)
                </Text>
                <Text style={styles.formulaExplanation}>
                  • c is approximately π (3.14626...)
                </Text>
              </View>
            )}
          </View>

          {/* Interactive Slider */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interactive Simulation</Text>
            <Text style={styles.sliderLabel}>
              Staking Participation: {stakingPercentage}%
            </Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderMin}>10%</Text>
              <View style={styles.slider}>
                <View 
                  style={[
                    styles.sliderTrack,
                    { width: `${((stakingPercentage - 10) / 90) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.sliderMax}>100%</Text>
            </View>
            <View style={styles.sliderButtons}>
              {[10, 25, 33, 50, 65, 75, 90].map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.sliderButton,
                    stakingPercentage === value && styles.sliderButtonActive
                  ]}
                  onPress={() => setStakingPercentage(value)}
                >
                  <Text
                    style={[
                      styles.sliderButtonText,
                      stakingPercentage === value && styles.sliderButtonTextActive
                    ]}
                  >
                    {value}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Results */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Calculated Results</Text>
            <View style={styles.resultsGrid}>
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>Current Emission Rate</Text>
                <Text style={styles.resultValue}>{formatNumber(INITIAL_INFLATION)}%</Text>
                <Text style={styles.resultSubtitle}>Static rate</Text>
              </View>
              
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>New Emission Rate</Text>
                <Text style={styles.resultValue}>{formatNumber(currentEmissionRate)}%</Text>
                <Text style={styles.resultSubtitle}>With {stakingPercentage}% staked</Text>
              </View>
              
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>Current Validator Returns</Text>
                <Text style={styles.resultValue}>{formatNumber(INITIAL_INFLATION * 100 / stakingPercentage)}%</Text>
                <Text style={styles.resultSubtitle}>Static rate / stake %</Text>
              </View>
              
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>New Validator Returns</Text>
                <Text style={styles.resultValue}>{formatNumber(currentValidatorReturns)}%</Text>
                <Text style={styles.resultSubtitle}>Dynamic formula</Text>
              </View>
            </View>
          </View>

          {/* Charts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Emission Rate vs. Staking %</Text>
            <LineChart
              data={emissionData}
              title="Emission Rate (%)"
              color={colors.primary}
              isLoading={isLoading}
              height={220}
              xAxisLabel="Staking Percentage"
              yAxisLabel="Emission Rate (%)"
            />
            
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Validator Returns vs. Staking %</Text>
            <LineChart
              data={validatorReturnsData}
              title="Validator Returns (%)"
              color="#8B5CF6"
              isLoading={isLoading}
              height={220}
              xAxisLabel="Staking Percentage"
              yAxisLabel="Returns (%)"
            />
          </View>

          {/* Key Benefits */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Benefits</Text>
            <View style={styles.benefitCard}>
              <View style={styles.benefitHeader}>
                <TrendingUp size={20} color={colors.primary} />
                <Text style={styles.benefitTitle}>Dynamic Security Incentives</Text>
              </View>
              <Text style={styles.benefitText}>
                Automatically increases rewards when staking participation drops, ensuring network security is maintained.
              </Text>
            </View>
            
            <View style={styles.benefitCard}>
              <View style={styles.benefitHeader}>
                <Coins size={20} color={colors.primary} />
                <Text style={styles.benefitTitle}>Reduced Unnecessary Inflation</Text>
              </View>
              <Text style={styles.benefitText}>
                Minimizes SOL issuance to only what's necessary for security, reducing selling pressure and dilution.
              </Text>
            </View>
            
            <View style={styles.benefitCard}>
              <View style={styles.benefitHeader}>
                <DollarSign size={20} color={colors.primary} />
                <Text style={styles.benefitTitle}>DeFi Growth Stimulus</Text>
              </View>
              <Text style={styles.benefitText}>
                Lower "risk-free" staking rates encourage SOL usage in DeFi protocols, stimulating ecosystem growth.
              </Text>
            </View>
            
            <View style={styles.benefitCard}>
              <View style={styles.benefitHeader}>
                <Info size={20} color={colors.primary} />
                <Text style={styles.benefitTitle}>Market-Driven Approach</Text>
              </View>
              <Text style={styles.benefitText}>
                Leverages market forces rather than arbitrary fixed schedules to determine optimal emission rates.
              </Text>
            </View>
          </View>
        </>
      ) : activeTab === 'staking' ? (
        <>
          {/* Staking Calculator */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Staking Calculator</Text>
            
            <View style={styles.calculatorCard}>
              <View style={styles.calculatorHeader}>
                <Calculator size={24} color={colors.primary} />
                <Text style={styles.calculatorTitle}>Calculate Your Rewards</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Amount to Stake (SOL)</Text>
                <TextInput
                  style={styles.input}
                  value={stakingAmount}
                  onChangeText={setStakingAmount}
                  keyboardType="numeric"
                  placeholder="Enter SOL amount"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Staking Period</Text>
                <View style={styles.periodButtons}>
                  {[3, 6, 12, 24, 36].map((period) => (
                    <TouchableOpacity
                      key={period}
                      style={[
                        styles.periodButton,
                        stakingPeriod === period && styles.periodButtonActive
                      ]}
                      onPress={() => setStakingPeriod(period)}
                    >
                      <Text
                        style={[
                          styles.periodButtonText,
                          stakingPeriod === period && styles.periodButtonTextActive
                        ]}
                      >
                        {period} {period === 1 ? 'month' : 'months'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Annual Yield Rate</Text>
                <View style={styles.yieldButtons}>
                  {[
                    { label: 'Current Static', value: 6.8 },
                    { label: 'New Dynamic', value: currentValidatorReturns }
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.label}
                      style={[
                        styles.yieldButton,
                        stakingYield === option.value && styles.yieldButtonActive
                      ]}
                      onPress={() => setStakingYield(option.value)}
                    >
                      <Text
                        style={[
                          styles.yieldButtonText,
                          stakingYield === option.value && styles.yieldButtonTextActive
                        ]}
                      >
                        {option.label} ({option.value.toFixed(2)}%)
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.resultsContainer}>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Staking Rewards</Text>
                  <Text style={styles.resultValue}>{stakingResults.totalRewards} SOL</Text>
                  <Text style={styles.resultSubvalue}>${stakingResults.rewardsUsd}</Text>
                </View>
                
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Final Amount</Text>
                  <Text style={styles.resultValue}>{stakingResults.finalAmount} SOL</Text>
                  <Text style={styles.resultSubvalue}>${stakingResults.finalAmountUsd}</Text>
                </View>
                
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Effective APY</Text>
                  <Text style={styles.resultValue}>{stakingYield.toFixed(2)}%</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Inflation Schedule */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current vs. Proposed Emission</Text>
            
            <View style={styles.comparisonCard}>
              <View style={styles.comparisonRow}>
                <Text style={styles.comparisonLabel}>Current Mechanism</Text>
                <Text style={styles.comparisonValue}>Static Schedule</Text>
              </View>
              
              <View style={styles.comparisonRow}>
                <Text style={styles.comparisonLabel}>Current Rate</Text>
                <Text style={styles.comparisonValue}>{INITIAL_INFLATION}%</Text>
              </View>
              
              <View style={styles.comparisonRow}>
                <Text style={styles.comparisonLabel}>Disinflation</Text>
                <Text style={styles.comparisonValue}>{DISINFLATION_RATE}% per year</Text>
              </View>
              
              <View style={styles.comparisonRow}>
                <Text style={styles.comparisonLabel}>Long-term Rate</Text>
                <Text style={styles.comparisonValue}>{LONG_TERM_INFLATION}%</Text>
              </View>
              
              <View style={styles.comparisonDivider} />
              
              <View style={styles.comparisonRow}>
                <Text style={styles.comparisonLabel}>Proposed Mechanism</Text>
                <Text style={styles.comparisonValue}>Market-Based</Text>
              </View>
              
              <View style={styles.comparisonRow}>
                <Text style={styles.comparisonLabel}>Current Staking %</Text>
                <Text style={styles.comparisonValue}>{CURRENT_STAKING_PERCENTAGE}%</Text>
              </View>
              
              <View style={styles.comparisonRow}>
                <Text style={styles.comparisonLabel}>New Emission Rate</Text>
                <Text style={styles.comparisonValue}>{formatNumber(calculateEmissionRate(CURRENT_STAKING_PERCENTAGE))}%</Text>
              </View>
              
              <View style={styles.comparisonRow}>
                <Text style={styles.comparisonLabel}>Validator Returns</Text>
                <Text style={styles.comparisonValue}>{formatNumber(calculateValidatorReturns(CURRENT_STAKING_PERCENTAGE))}%</Text>
              </View>
              
              <Text style={styles.comparisonNote}>
                The new market-based emission mechanism adjusts based on staking participation, optimizing network security while minimizing unnecessary inflation.
              </Text>
            </View>
          </View>
        </>
      ) : (
        // Discussion Tab
        <View style={styles.section}>
          <View style={styles.discussionHeader}>
            <Text style={styles.sectionTitle}>GitHub PR Discussion</Text>
            <TouchableOpacity style={styles.githubLink} onPress={openGitHubPR}>
              <MessageSquare size={16} color={colors.primary} />
              <Text style={styles.githubLinkText}>View on GitHub</Text>
            </TouchableOpacity>
          </View>
          
          <GitHubThread showLatestFirst={true} />
          
          <TouchableOpacity style={styles.viewMoreButton} onPress={openGitHubPR}>
            <Text style={styles.viewMoreText}>View full discussion on GitHub</Text>
            <ExternalLink size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    paddingTop: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    fontFamily: typography.mono,
  },
  linkButton: {
    padding: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  activeTabText: {
    color: colors.background,
  },
  section: {
    padding: 16,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  explanationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  explanationContent: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
  },
  explanationText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  readMoreText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  formulaContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
  },
  formulaTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  formula: {
    fontSize: 16,
    fontFamily: typography.mono,
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  formulaExplanation: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 4,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 12,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sliderMin: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  slider: {
    flex: 1,
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  sliderTrack: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  sliderMax: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  sliderButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  sliderButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  sliderButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sliderButtonText: {
    fontSize: 12,
    color: colors.text,
  },
  sliderButtonTextActive: {
    color: colors.background,
    fontWeight: '500',
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  resultCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    fontFamily: typography.mono,
  },
  resultSubtitle: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 4,
  },
  benefitCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  benefitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  benefitText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  calculatorCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  calculatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  calculatorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    fontFamily: typography.mono,
  },
  periodButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    color: colors.text,
  },
  periodButtonTextActive: {
    color: colors.background,
    fontWeight: '500',
  },
  yieldButtons: {
    flexDirection: 'column',
    gap: 8,
  },
  yieldButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  yieldButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  yieldButtonText: {
    fontSize: 14,
    color: colors.text,
  },
  yieldButtonTextActive: {
    color: colors.background,
    fontWeight: '500',
  },
  resultsContainer: {
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    gap: 12,
  },
  resultRow: {
    gap: 4,
  },
  resultSubvalue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  comparisonCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  comparisonLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  comparisonValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    fontFamily: typography.mono,
  },
  comparisonDivider: {
    height: 16,
  },
  comparisonNote: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 16,
    lineHeight: 20,
  },
  discussionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  githubLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  githubLinkText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  viewMoreText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
});